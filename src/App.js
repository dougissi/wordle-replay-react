import './App.css';
import dayjs from 'dayjs';
import { createContext, useEffect, useState, useMemo, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Route, Routes, useSearchParams } from "react-router-dom";
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Game from './components/Game';
import CssBaseline from '@mui/material/CssBaseline';
import AboutPage from './components/Pages/AboutPage';
import NewsPage from './components/Pages/NewsPage';
import { dateToWord } from './assets/date_to_word';
import { wordleAcceptableWords } from './assets/wordle_acceptable_words';
import { blankGuessesGrid, dateIsBetween, dateToPuzzleNum, getDistCountLabel, numIsBetween, puzzleNumToDate } from './utils';
import { colorMap, earliestDate, emptyDistributionData, GREEN, YELLOW, GRAY, lsKeys, maxNewsPostId } from './constants';
import { initDB, deleteItem } from './db';


const gamePath = '/';
const ColorModeContext = createContext({ toggleColorMode: () => {} });
const today = dayjs().format('YYYY-MM-DD');
const todayPuzzleNum = dateToPuzzleNum(today);
const earliestPuzzleNum = dateToPuzzleNum(earliestDate);
const isValidDate = (dateStr) => {
  return dateIsBetween(dateStr, earliestDate, today);
};
const isValidPuzzleNum = (num) => {
  return numIsBetween(num, earliestPuzzleNum, todayPuzzleNum);
};


function App() {
  const [colorMode, setColorMode] = useState(localStorage.getItem('colorMode') || 'light');  // TODO: unit test
  const [hardMode, setHardMode] = useState(localStorage.getItem('hardMode') === 'true');  // TODO: unit test
  const [colorBlindMode, setColorBlindMode] = useState(localStorage.getItem('colorBlindMode') === 'true');  // TODO: unit test
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
  const [seenInsights, setSeenInsights] = useState(new Set());
  const [distributionData, setDistributionData] = useState({...emptyDistributionData});
  const [guessesDB, setGuessesDB] = useState({});
  const [hardModeWords, setHardModeWords] = useState(new Set(wordleAcceptableWords));
  const [possibleWords, setPossibleWords] = useState(new Set(wordleAcceptableWords));
  const [maxSeenNewsPostId, setMaxSeenNewsPostId] = useState(Number(localStorage.getItem(lsKeys.maxSeenNewsPostId)));  // 0 if doesn't exist
  const [showNewsBadge, setShowNewsBadge] = useState(maxNewsPostId > maxSeenNewsPostId);
  
  const toggleColorMode = () => {
    const newColorMode = colorMode === 'light' ? 'dark' : 'light';
    localStorage.setItem('colorMode', newColorMode);  // persist
    setColorMode(newColorMode);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
        },
      }),
    [colorMode],
  );

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

  const focusGuessesBoard = () => {  // focus on guesses board if at the game
    if (window.location.pathname === gamePath) {
      guessesBoardRef.current.focus();
    }
  }

  useEffect(() => {
    initDB(setDistributionData, setGuessesDB); // Initialize the database
    focusGuessesBoard();  // TODO: can this move to Game? focus on guesses board initially
  }, []);

  const darkMode = colorMode === 'dark';  // TODO: useEffect?
  const colorBlindModeDesc = colorBlindMode ? 'colorBlind' : 'standard';
  const green = colorMap[colorMode][colorBlindModeDesc][GREEN];
  const yellow = colorMap[colorMode][colorBlindModeDesc][YELLOW];
  const gray = colorMap[colorMode][colorBlindModeDesc][GRAY];

  const guessesBoardRef = useRef(null);

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

  const resetGame = () => {
    // TODO: need a more robust way of ensuring these states are the same as when the app loads
    setGuessesData(blankGuessesGrid());
    setGuessesColors(blankGuessesGrid());
    setLetterMaxRanks(Array(26).fill('-1'));
    setNextLetterIndex([0, 0]);
    setHardModeWords([...wordleAcceptableWords]);
    setPossibleWords(new Set([...wordleAcceptableWords]));
    setSeenInsights(new Set());
    focusGuessesBoard();
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

  const deleteDBDates = (dateStrs) => {
    const newGuessesDB = {...guessesDB};
    const newDistributionData = {...distributionData};
    dateStrs.forEach(dateStr => {
      deleteItem(dateStr);  // delete from indexedDB
      delete newGuessesDB[dateStr];  // update DB state
      if (guessesDB[dateStr]?.solvedDate) {  // update distribution counts state if solved
        const countLabel = getDistCountLabel(guessesDB[dateStr].guesses.length);
        newDistributionData[countLabel]--;
      }
    });
    setGuessesDB(newGuessesDB);
    setDistributionData(newDistributionData);

    // reset game if deleting current puzzle
    if (dateStrs.includes(puzzleDate)) {
      resetGame();
    }
  }

  const pages = [
    {
      path: gamePath,  // homepage
      label: 'Play',
      element: (
        <Game
          today={today}
          puzzleDate={puzzleDate}
          hardMode={hardMode}
          colorBlindMode={colorBlindMode}
          darkMode={darkMode}
          puzzleNum={puzzleNum}
          answer={answer}
          guessesData={guessesData}
          setGuessesData={setGuessesData}
          guessesColors={guessesColors}
          setGuessesColors={setGuessesColors}
          letterMaxRanks={letterMaxRanks}
          setLetterMaxRanks={setLetterMaxRanks}
          nextLetterIndex={nextLetterIndex}
          setNextLetterIndex={setNextLetterIndex}
          seenInsights={seenInsights}
          setSeenInsights={setSeenInsights}
          distributionData={distributionData}
          setDistributionData={setDistributionData}
          guessesDB={guessesDB}
          setGuessesDB={setGuessesDB}
          hardModeWords={hardModeWords}
          setHardModeWords={setHardModeWords}
          possibleWords={possibleWords}
          setPossibleWords={setPossibleWords}
          focusGuessesBoard={focusGuessesBoard}
          changeDate={changeDate}
          resetGame={resetGame}
          green={green}
          gray={gray}
          ref={guessesBoardRef}
        />
      )
    },
    { 
      path: '/about',
      label: 'About',
      element: <AboutPage />
    },
    { 
      path: '/news',
      label: 'News',
      element: (
        <NewsPage
          maxSeenNewsPostId={maxSeenNewsPostId}
          setMaxSeenNewsPostId={setMaxSeenNewsPostId}
          showNewsBadge={showNewsBadge}
          setShowNewsBadge={setShowNewsBadge}
        />
      )
    },
    { 
      path: 'https://docs.google.com/forms/d/e/1FAIpQLSfKeTZCnnicWaVnn0PpGWvUjZvjrXeA7rx1wZUKCNnJJbIthA/viewform?usp=sf_link',
      label: 'Feedback'
    },
    { 
      path: 'https://www.paypal.com/donate/?hosted_button_id=JWHYPBKUV6FQE',
      label: 'Donate'
    },
  ];

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <ResponsiveAppBar
            pages={pages}
            today={today}
            puzzleDate={puzzleDate}
            puzzleNum={puzzleNum}
            isValidPuzzleNum={isValidPuzzleNum}
            hardMode={hardMode}
            handleHardModeChange={handleHardModeChange}
            hardModeWords={hardModeWords}
            colorBlindMode={colorBlindMode}
            handleColorBlindModeChange={handleColorBlindModeChange}
            darkMode={darkMode}
            distributionData={distributionData}
            guessesDB={guessesDB}
            toggleColorMode={toggleColorMode}
            focusGuessesBoard={focusGuessesBoard}
            changeDate={changeDate}
            deleteDBDates={deleteDBDates}
            showNewsBadge={showNewsBadge}
            green={green}
            yellow={yellow}
            gray={gray}
          />
          <Routes>
            {pages.map((page) => (
              <Route key={`${page.label}-page`} {...page} />
            ))}
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
