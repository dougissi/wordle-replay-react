import { numLetters, rankToColor, backspaceSymbol, initialNumGuessesToShow } from "../constants";
import { useEffect, useState, forwardRef } from 'react';
import { blankRow, isSingleEnglishLetter, getGuessRanks, getLetterAlphabetIndex, getDistCountLabel, getNextUnsolvedDate } from '../utils';
import useScreenSize from './useScreenSize';
// import { DateSelector } from './DateSelector';
// import { SearchBar } from './components/SearchBar';
import GuessesBoard from './GuessesBoard';
import Keyboard from './Keyboard';
import { InvalidGuessDialog, WonDialog } from './AlertDialog';
import { putItem } from '../db';
import { getInsightsFromGuessRanks, getInsightCallback, satisfiesAllInsightCallbacks } from '../hardModeWordsFiltering';


const Game = forwardRef(({
  today,
  puzzleDate,
  hardMode,
  colorBlindMode,
  darkMode,
  puzzleNum,
  answer,
  guessesData,
  setGuessesData,
  guessesColors,
  setGuessesColors,
  letterMaxRanks,
  setLetterMaxRanks,
  nextLetterIndex,
  setNextLetterIndex,
  seenInsights,
  setSeenInsights,
  distributionData,
  setDistributionData,
  guessesDB,
  setGuessesDB,
  hardModeWords,
  setHardModeWords,
  possibleWords,
  setPossibleWords,
  focusGuessesBoard,
  changeDate,
  resetGame,
  green,
  gray,
}, guessesBoardRef) => {
  const screenSize = useScreenSize();
  const [invalidGuess, setInvalidGuess] = useState("");
  const [invalidGuessDialogOpen, setInvalidGuessDialogOpen] = useState(false);
  const [wonDialogOpen, setWonDialogOpen] = useState(false);
  const [lastLoadedDate, setLastLoadedDate] = useState();
  const [lastLoadAttemptDate, setLastLoadAttemptDate] = useState();

  // load any previous guesses from DB for a given puzzle
  // TODO: commonize?
  useEffect(() => {
    if (
      (
        lastLoadAttemptDate !== puzzleDate     // last attempt wasn't this date
        || lastLoadedDate !== puzzleDate       // last successful load wasn't this date
      )
      && guessesDB.hasOwnProperty(puzzleDate)  // DB has this date
    ) {
      console.log("loading board");
      const row = guessesDB[puzzleDate];
      const newGuessesData = [...row.guesses];

      const newLetterMaxRanks = [...letterMaxRanks];
      const newGuessesColors = [];
      let isSolved = false;
      let newSeenInsights = new Set();

      newGuessesData.forEach((guessArr) => {
        const guess = guessArr.join("");
        const guessRanks = getGuessRanks(guess, answer);
        const guessColors = [...guessRanks].map((rank) => rankToColor[rank]);
        newGuessesColors.push(guessColors);

        // update keyboard max ranks
        for (let i = 0; i < guess.length; i++) {
          const letter = guess[i];
          const j = getLetterAlphabetIndex(letter);
          newLetterMaxRanks[j] = Math.max(newLetterMaxRanks[j], guessRanks[i])
        }

        // keep all unique insights (for hard mode word tracking)
        const insights = getInsightsFromGuessRanks(guess.toLowerCase(), guessRanks);
        newSeenInsights = newSeenInsights.union(new Set(insights));

        // track if solved
        if (guessRanks === '22222') {
          isSolved = true;
        }
      });

      // update hard mode words
      const insightCallbacks = [...newSeenInsights].map((insight) => getInsightCallback(insight));
      const newHardModeWords = new Set([...hardModeWords].filter((word) => satisfiesAllInsightCallbacks(word, insightCallbacks)));
      setSeenInsights(newSeenInsights);
      setHardModeWords(newHardModeWords);

      // add blank rows, if needed
      while (newGuessesData.length < initialNumGuessesToShow) {
        newGuessesData.push(blankRow());
        newGuessesColors.push(blankRow());
      }

      if (isSolved) {
        setNextLetterIndex([row.guesses.length - 1, numLetters]);
      } else {
        setNextLetterIndex([row.guesses.length, 0]);
        if (row.guesses.length >= initialNumGuessesToShow) {
          newGuessesData.push(blankRow());
          newGuessesColors.push(blankRow());
        }
      }
      setGuessesData(newGuessesData);
      setGuessesColors(newGuessesColors);
      setLetterMaxRanks(newLetterMaxRanks);
      setLastLoadedDate(puzzleDate);
    }
    setLastLoadAttemptDate(puzzleDate);
    focusGuessesBoard();
  }, [puzzleDate, lastLoadAttemptDate, lastLoadedDate, guessesDB, answer, hardModeWords, setHardModeWords, letterMaxRanks, focusGuessesBoard, setGuessesColors, setGuessesData, setLetterMaxRanks, setNextLetterIndex, setSeenInsights]);

  const numGuesses = () => {  // TODO: convert to useEffect?
    return nextLetterIndex[0] + 1;
  };

  const saveGuess = (isSolved) => {
    const guessesDataNoBlanks = guessesData.filter((guess) => guess[0] !== "");  // remove blank rows
    const newItem = { puzzleNum: puzzleNum, date: puzzleDate, solvedDate: isSolved ? today : null, guesses: guessesDataNoBlanks };
    putItem(newItem); // Add/update item into IndexedDB

    // update guessesDB state
    const newGuessesDB = {...guessesDB};
    newGuessesDB[puzzleDate] = newItem;
    setGuessesDB(newGuessesDB);
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
          if (!guessesDB.hasOwnProperty(puzzleDate) || !guessesDB[puzzleDate].solvedDate) {  // save if never saved or unsolved
            saveGuess(true);  // including `true` will add solved date

            // update distribution
            const countLabel = getDistCountLabel(numGuesses());
            const newDistributionData = {...distributionData};
            newDistributionData[countLabel]++;
            setDistributionData(newDistributionData);
          }
        } else {  // guess not the answer
          // update next letter index, potentially adding a new row
          const nextRowIndex = nextLetterIndex[0] + 1;
          if (nextRowIndex === guessesData.length) {  // at end of all words
            setGuessesData([...guessesData, blankRow()]);  // add blank row
            setGuessesColors([...newGuessesColors, blankRow()]); // add blank row
          }
          setNextLetterIndex([nextRowIndex, 0]);
          saveGuess();  // no `true` param so no solved date will be included
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


  return (
    <div className="Game">
      <GuessesBoard
        screenSize={screenSize}
        ref={guessesBoardRef}
        guessesData={guessesData}
        guessesColors={guessesColors}
        handleInputText={handleInputText}
        darkMode={darkMode}
        colorBlindMode={colorBlindMode}
      />

      <Keyboard
        screenSize={screenSize}
        letterMaxRanks={letterMaxRanks}
        handleInputText={handleInputText}
        darkMode={darkMode}
        colorBlindMode={colorBlindMode}
      />

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
        colorBlindMode={colorBlindMode}
        puzzleDate={puzzleDate}
        puzzleNum={puzzleNum}
        nextUnsolvedDate={getNextUnsolvedDate(puzzleDate, today, guessesDB)}
        changeDate={changeDate}
        green={green}
        gray={gray}
      />
      {/* End Dialogs */}
    </div>
  );
});

export default Game;
