import { emptyDistributionData, numLetters, rankToColor, backspaceSymbol, earliestDate } from "../constants";
import { useEffect, useState, useRef } from 'react';
import { blankRow, blankGuessesGrid, isSingleEnglishLetter, getGuessRanks, getLetterAlphabetIndex, dateToPuzzleNum, dateIsBetween } from '../utils';
import useScreenSize from './useScreenSize';
import { dateToWord } from '../assets/date_to_word';
import { wordleAcceptableWords } from '../assets/wordle_acceptable_words';
import { DateSelector } from './DateSelector';
import GuessesBoard from './GuessesBoard';
import Keyboard from './Keyboard';
import { InvalidGuessDialog, SuggestionsDialog, WonDialog } from './AlertDialog';
import { initDB, addItem, setSolvedStates } from '../db';
import { Button, Stack } from '@mui/material';
import dayjs from 'dayjs';
// import { SearchBar } from './components/SearchBar';
import { getInsightsFromGuessRanks, getInsightCallback, satisfiesAllInsightCallbacks } from '../hardModeWordsFiltering';
import SettingsMenu from './SettingsMenu';
import { useSearchParams } from "react-router-dom";

function Game() {
  const today = dayjs().format('YYYY-MM-DD'); 
  const isValidDate = (dateStr) =>{
    return dateIsBetween(dateStr, earliestDate, today);
  }
  const screenSize = useScreenSize();
  const [searchParams, setSearchParams] = useSearchParams();
  const [puzzleDate, setPuzzleDate] = useState(isValidDate(searchParams.get('date')) ? searchParams.get('date') : today);  // use query param date if valid, else today
  const [puzzleNum, setPuzzleNum] = useState(dateToPuzzleNum(puzzleDate));  
  const [answer, setAnswer] = useState(dateToWord.get(puzzleDate).toUpperCase());
  const [guessesData, setGuessesData] = useState(blankGuessesGrid());
  const [guessesColors, setGuessesColors] = useState(blankGuessesGrid());
  const [letterMaxRanks, setLetterMaxRanks] = useState(Array(26).fill('-1'));
  const [nextLetterIndex, setNextLetterIndex] = useState([0, 0]);
  const [invalidGuess, setInvalidGuess] = useState("");
  const [invalidGuessDialogOpen, setInvalidGuessDialogOpen] = useState(false);
  const [wonDialogOpen, setWonDialogOpen] = useState(false);
  const [distributionData, setDistributionData] = useState({...emptyDistributionData});
  const [hardModeWords, setHardModeWords] = useState(new Set(wordleAcceptableWords));
  const [possibleWords, setPossibleWords] = useState(new Set(wordleAcceptableWords));
  const [seenInsights, setSeenInsights] = useState(new Set());
  const [suggestionsDialogOpen, setSuggestionsDialogOpen] = useState(false);
  const [hardMode, setHardMode] = useState(localStorage.getItem('hardMode') === 'true');  // TODO: unit test

  // console.log(`${puzzleDate} ${answer}`);
  const guessesBoardRef = useRef(null);
  const suggestionsButtonRef = useRef(null);

  useEffect(() => {
    initDB(setDistributionData); // Initialize the database
    guessesBoardRef.current.focus();  // focus on guesses board initially
    if (searchParams.has('date') && !isValidDate(searchParams.get('date'))) {  // if query param date is invalid, reset to today
      setSearchParams({...searchParams, date: today});
    }
  }, []);

  const numGuesses = () => {  // TODO: convert to useEffect?
    return nextLetterIndex[0] + 1;
  };

  const saveGuess = () => {
    const guessesDataNoBlanks = guessesData.filter((guess) => guess[0] !== "");  // remove blank rows
    const newItem = { puzzleNum: puzzleNum, date: puzzleDate, solvedDate: today, guesses: guessesDataNoBlanks };
    addItem(newItem); // Add item to the database
  };

  const handleInputText = (text) => {
    // console.log(`entered ${text}`);

    if (text === 'ENTER' && nextLetterIndex[1] === numLetters) {  // ENTER at end of word
      const guess = guessesData[nextLetterIndex[0]].join("");
      if (!possibleWords.has(guess.toLowerCase())) {
        setInvalidGuess(guess);  // TODO: never gets unset, but works fine
        setInvalidGuessDialogOpen(true);
      } else {  // guess is an acceptable word
        // get the ranks for each letter of the guess
        // in the form of a string of 5 numbers, each [0, 2],
        // where 0 -> gray, 1 -> yellow, 2 -> green
        const guessRanks = getGuessRanks(guess, answer); 
        const guessColors = [...guessRanks].map((rank) => rankToColor[rank]);

        const newGuessesColors = [...guessesColors];
        newGuessesColors[nextLetterIndex[0]] = guessColors;
        setGuessesColors(newGuessesColors);

        // for each letter of guess, keep the max color rank
        // across all guesses
        const newLetterMaxRanks = [...letterMaxRanks];
        for (let i = 0; i < guess.length; i++) {
          const letter = guess[i];
          const j = getLetterAlphabetIndex(letter);
          newLetterMaxRanks[j] = Math.max(newLetterMaxRanks[j], guessRanks[i])
        }
        setLetterMaxRanks(newLetterMaxRanks);

        if (guessRanks === '22222') {  // guess is all greens (i.e., the answer)
          setWonDialogOpen(true);
          saveGuess();
          setSolvedStates(setDistributionData);
        } else {  // guess not the answer
          // update next letter index, potentially adding a new row
          const nextRowIndex = nextLetterIndex[0] + 1;
          if (nextRowIndex === guessesData.length) {  // at end of all words
            setGuessesData([...guessesData, blankRow()]);  // add blank row
            setGuessesColors([...newGuessesColors, blankRow()]); // add blank row
          }
          setNextLetterIndex([nextRowIndex, 0]);
        }

        // update hard mode words and seen insights
        const insights = getInsightsFromGuessRanks(guess.toLowerCase(), guessRanks);
        const newInsights = insights.filter((insight) => !seenInsights.has(insight));
        const newInsightCallbacks = newInsights.map((insight) => getInsightCallback(insight));
        const newHardModeWords = new Set([...hardModeWords].filter((word) => satisfiesAllInsightCallbacks(word, newInsightCallbacks)));
        setSeenInsights(seenInsights.union(new Set(newInsights)));
        setHardModeWords(newHardModeWords);

        // update possible words set if hard mode is on
        if (hardMode) {
          setPossibleWords(newHardModeWords);
        }
      }
    } else if ((text === 'BACKSPACE' || text === backspaceSymbol) && nextLetterIndex[1] > 0) {  // BACKSPACE with some letters
      const newGuessesData = [...guessesData];
      const newGuess = [...guessesData[nextLetterIndex[0]]];
      newGuess[nextLetterIndex[1] - 1] = "";
      newGuessesData[nextLetterIndex[0]] = newGuess;
      setGuessesData(newGuessesData);
      setNextLetterIndex([nextLetterIndex[0], nextLetterIndex[1] - 1]);
    } else if (isSingleEnglishLetter(text) && nextLetterIndex[1] < numLetters) {  // Letter not at end
      const newGuessesData = [...guessesData];
      const newGuess = [...guessesData[nextLetterIndex[0]]];
      newGuess[nextLetterIndex[1]] = text;
      newGuessesData[nextLetterIndex[0]] = newGuess;
      setGuessesData(newGuessesData);
      setNextLetterIndex([nextLetterIndex[0], nextLetterIndex[1] + 1]);
    }
  };

  const clearGuess = () => {
    const newGuessesData = [...guessesData];
    newGuessesData[nextLetterIndex[0]] = blankRow();  // blank guess
    setGuessesData(newGuessesData);
    setNextLetterIndex([nextLetterIndex[0], 0]);
  };

  const resetGame = () => {
    // TODO: need a more robust way of ensuring these states are the same as when the app loads
    setGuessesData(blankGuessesGrid());
    setGuessesColors(blankGuessesGrid());
    setLetterMaxRanks(Array(26).fill('-1'));
    setNextLetterIndex([0, 0]);
    setHardModeWords([...wordleAcceptableWords]);
    setPossibleWords(new Set([...wordleAcceptableWords]));
    setSeenInsights(new Set());
    guessesBoardRef.current.focus();
  };

  const changeDate = (dateStr) => {
    if (dateStr === puzzleDate || !isValidDate(dateStr)) {  // if no date change or invalid date, do nothing
      return;
    }
    setPuzzleDate(dateStr);
    if (searchParams.has('date')) {
      setSearchParams({...searchParams, date: dateStr});
    }
    setPuzzleNum(dateToPuzzleNum(dateStr));
    setAnswer(dateToWord.get(dateStr).toUpperCase());
    resetGame();  // TODO: make this optional?
  };

  const handleHardModeChange = (event) => {
    const newHardMode = event.target.checked;
    const newPossibleWords = newHardMode ? new Set(hardModeWords) : wordleAcceptableWords;
    setHardMode(newHardMode);
    setPossibleWords(newPossibleWords);
    localStorage.setItem('hardMode', newHardMode);  // persist
  };


  return (
    <div className="Game">
      {/* <div>
        <h1>Screen Size Detection with React Hook</h1>
        <p>Width: {screenSize.width}</p>
        <p>Height: {screenSize.height}</p>
      </div> */}

      {/* Row of inputs above Guess Board */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="flex-end"
      >
        <DateSelector today={today} changeDate={changeDate} />

        {/* <SearchBar today={today} changeDate={changeDate} solvedPuzzleNums={solvedPuzzleNums} /> */}

        <Button
          variant="contained"
          ref={suggestionsButtonRef}
          onClick={() => {
            setSuggestionsDialogOpen(true);
            suggestionsButtonRef.current.blur();
          }}
        >
          Suggestions
        </Button>

        <SettingsMenu hardMode={hardMode} handleHardModeChange={handleHardModeChange} />

        {/* {hardMode && <div>Hard Mode Active</div>} */}
      </Stack>

      {/* Dialogs, initially hidden */}
      <InvalidGuessDialog
        open={invalidGuessDialogOpen}
        handleClose={() => setInvalidGuessDialogOpen(false)}
        guess={invalidGuess}
        clearGuess={clearGuess}
        hardMode={hardMode}
      />

      <WonDialog
        open={wonDialogOpen}
        handleClose={() => setWonDialogOpen(false)}
        answer={answer}
        numGuesses={numGuesses()}
        resetGame={resetGame}
        guessesColors={guessesColors}
        distributionData={distributionData}
      />

      <SuggestionsDialog
        open={suggestionsDialogOpen}
        handleClose={() => setSuggestionsDialogOpen(false)}
        hardModeWords={hardModeWords}
      />

      <GuessesBoard
        screenSize={screenSize}
        ref={guessesBoardRef}
        guessesData={guessesData}
        guessesColors={guessesColors}
        handleInputText={handleInputText}
      />

      <Keyboard
        screenSize={screenSize}
        letterMaxRanks={letterMaxRanks}
        handleInputText={handleInputText}
      />
    </div>
  );
}

export default Game;
