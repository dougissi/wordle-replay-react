import { emptyDistributionData, numLetters, rankToColor, backspaceSymbol, earliestDate, initialNumGuessesToShow, colorMap, GREEN, YELLOW, GRAY } from "../constants";
import { useEffect, useState, useRef } from 'react';
import { blankRow, blankGuessesGrid, isSingleEnglishLetter, getGuessRanks, getLetterAlphabetIndex, dateToPuzzleNum, dateIsBetween, puzzleNumToDate, numIsBetween } from '../utils';
import useScreenSize from './useScreenSize';
import { dateToWord } from '../assets/date_to_word';
import { wordleAcceptableWords } from '../assets/wordle_acceptable_words';
// import { DateSelector } from './DateSelector';
// import { SearchBar } from './components/SearchBar';
import GuessesBoard from './GuessesBoard';
import Keyboard from './Keyboard';
import { InvalidGuessDialog, SuggestionsDialog, WonDialog } from './AlertDialog';
import { deleteItem, initDB, putItem, setSolvedStates } from '../db';
import { Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { getInsightsFromGuessRanks, getInsightCallback, satisfiesAllInsightCallbacks } from '../hardModeWordsFiltering';
import SettingsMenu from './SettingsMenu';
import { useSearchParams } from "react-router-dom";
import Calendar from "./Calendar";
import BoltIcon from '@mui/icons-material/Bolt';
import BarChartIcon from '@mui/icons-material/BarChart';
import StatsDialog from './StatsDialog';
import PuzzleNumSelector from "./PuzzleNumSelector";

const today = dayjs().format('YYYY-MM-DD');
const todayPuzzleNum = dateToPuzzleNum(today);
const earliestPuzzleNum = dateToPuzzleNum(earliestDate);

const isValidDate = (dateStr) => {
  return dateIsBetween(dateStr, earliestDate, today);
};

const isValidPuzzleNum = (num) => {
  return numIsBetween(num, earliestPuzzleNum, todayPuzzleNum);
};


function Game({ colorMode, toggleColorMode }) {
  const screenSize = useScreenSize();
  const [searchParams, setSearchParams] = useSearchParams();
  const [puzzleDate, setPuzzleDate] = useState(  // try use param date, otherwise try use param num, else today
    isValidDate(searchParams.get('date'))
    ? dayjs(searchParams.get('date')).format('YYYY-MM-DD')  // ensure proper format if valid
    : (
      isValidPuzzleNum(searchParams.get('num'))
      ? puzzleNumToDate(searchParams.get('num'))
      : today
    )
  );
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
  const [guessesDB, setGuessesDB] = useState({});
  const [lastLoadedDate, setLastLoadedDate] = useState();
  const [lastLoadAttemptDate, setLastLoadAttemptDate] = useState();
  const [hardModeWords, setHardModeWords] = useState(new Set(wordleAcceptableWords));
  const [possibleWords, setPossibleWords] = useState(new Set(wordleAcceptableWords));
  const [seenInsights, setSeenInsights] = useState(new Set());
  const [suggestionsDialogOpen, setSuggestionsDialogOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [hardMode, setHardMode] = useState(localStorage.getItem('hardMode') === 'true');  // TODO: unit test
  const [colorBlindMode, setColorBlindMode] = useState(localStorage.getItem('colorBlindMode') === 'true');  // TODO: unit test
  const [showPuzzleSelector, setShowPuzzleSelector] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // console.log(`${puzzleDate} ${answer}`);
  const guessesBoardRef = useRef(null);
  const suggestionsButtonRef = useRef(null);

  useEffect(() => {
    initDB(setDistributionData, setGuessesDB); // Initialize the database
    guessesBoardRef.current.focus();  // focus on guesses board initially
  }, []);

  // ensure search params match puzzleDate and puzzleNum
  useEffect(() => {
    const hasParamDate = searchParams.has('date');
    const hasParamNum = searchParams.has('num');
    const paramDate = searchParams.get('date');
    const paramNum = searchParams.get('num');
    if (hasParamDate && hasParamNum) {  // has both
      if (paramDate !== puzzleDate || paramNum !== puzzleNum) {  // if either not right, set both
        setSearchParams({...searchParams, date: puzzleDate, num: puzzleNum})
      }
    } else if (hasParamDate) {  // just date
      if (paramDate !== puzzleDate) {
        setSearchParams({...searchParams, date: puzzleDate})
      }
    } else if (hasParamNum) {  // just num
      if (paramNum !== puzzleNum) {
        setSearchParams({...searchParams, num: puzzleNum})
      }
    }
  }, [searchParams, setSearchParams, puzzleDate, puzzleNum]);

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
  }, [puzzleDate, lastLoadAttemptDate, lastLoadedDate, guessesDB, answer, hardModeWords, letterMaxRanks]);

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

  const deleteDBDates = (dateStrs) => {
    const newGuessesDB = {...guessesDB};
    dateStrs.forEach(dateStr => {
      deleteItem(dateStr);  // delete from indexedDB
      delete newGuessesDB[dateStr];  // update DB state
    });
    setGuessesDB(newGuessesDB);

    // reset game if deleting current puzzle
    if (dateStrs.includes(puzzleDate)) {
      resetGame();
    }
  }

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
          }
          setSolvedStates(setDistributionData, setGuessesDB);
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

  const handleColorBlindModeChange = (event) => {
    const newColorBlindMode = event.target.checked;
    setColorBlindMode(newColorBlindMode);
    localStorage.setItem('colorBlindMode', newColorBlindMode);  // persist
  };

  const darkMode = colorMode === 'dark';

  const colorBlindModeDesc = colorBlindMode ? 'colorBlind' : 'standard';
  const green = colorMap[colorMode][colorBlindModeDesc][GREEN];
  const yellow = colorMap[colorMode][colorBlindModeDesc][YELLOW];
  const gray = colorMap[colorMode][colorBlindModeDesc][GRAY];


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
        spacing={1}
        justifyContent="center"
        alignItems="flex-end"
      >
        {/* <SearchBar today={today} changeDate={changeDate} solvedPuzzleNums={solvedPuzzleNums} /> */}
        {/* <DateSelector today={today} puzzleDate={puzzleDate} changeDate={changeDate} /> */}

        {/* Puzzle Number */}
        <Tooltip title="Enter Puzzle Number">
          <Button onClick={() => setShowPuzzleSelector(prev => !prev)}>
            <Typography>{`#${puzzleNum}`}</Typography>
          </Button>
        </Tooltip>

        {/* Puzzle Date */}
        <Tooltip title="Choose Puzzle Date">
          <Button onClick={() => setShowCalendar(prev => !prev)}>
            <Typography>{puzzleDate}</Typography>
          </Button>
        </Tooltip>

        {/* Suggestions Icon */}
        <Tooltip title="Suggestions">
          <IconButton
            variant="contained"
            ref={suggestionsButtonRef}
            onClick={() => {
              setSuggestionsDialogOpen(true);
              suggestionsButtonRef.current.blur();  // TODO: update
            }}
          >
            <BoltIcon />
          </IconButton>
        </Tooltip>

        {/* Stats Icon */}
        <Tooltip title="Stats & History">
          <IconButton
            variant="contained"
            onClick={() => {
              setStatsDialogOpen(true);
            }}
          >
            <BarChartIcon />
          </IconButton>
        </Tooltip>

        <SettingsMenu
          hardMode={hardMode}
          handleHardModeChange={handleHardModeChange}
          colorBlindMode={colorBlindMode}
          handleColorBlindModeChange={handleColorBlindModeChange}
          darkMode={darkMode}
          toggleColorMode={toggleColorMode}
        />

        {/* {hardMode && <div>Hard Mode Active</div>} */}
      </Stack>

      {showPuzzleSelector && (
        <PuzzleNumSelector
          puzzleNum={puzzleNum}
          isValidPuzzleNum={isValidPuzzleNum}
          changeDate={changeDate}
          setShowPuzzleSelector={setShowPuzzleSelector}
        />
      )}

      {showCalendar && (
        <Calendar
          today={today}
          puzzleDate={puzzleDate}
          guessesDB={guessesDB}
          changeDate={changeDate}
          setShowCalendar={setShowCalendar}
          darkMode={darkMode}
          colorBlindMode={colorBlindMode}
          green={green}
          yellow={yellow}
        />
      )}

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
      />

      <SuggestionsDialog
        open={suggestionsDialogOpen}
        handleClose={() => setSuggestionsDialogOpen(false)}
        hardModeWords={hardModeWords}
      />

      <StatsDialog
        open={statsDialogOpen}
        setOpen={setStatsDialogOpen}
        today={today}
        distributionData={distributionData}
        guessesDB={guessesDB}
        changeDate={changeDate}
        deleteDBDates={deleteDBDates}
        green={green}
        yellow={yellow}
        gray={gray}
      />

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
    </div>
  );
}

export default Game;
