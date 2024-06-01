import './App.css';
import { createContext, useState, useMemo, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Route, Routes } from "react-router-dom";
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Game from './components/Game';
import CssBaseline from '@mui/material/CssBaseline';
import AboutPage from './components/Pages/AboutPage';
import NewsPage from './components/Pages/NewsPage';
import { wordleAcceptableWords } from './assets/wordle_acceptable_words';

const gamePath = '/';
const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const [colorMode, setColorMode] = useState(localStorage.getItem('colorMode') || 'light');  // TODO: unit test
  const [hardMode, setHardMode] = useState(localStorage.getItem('hardMode') === 'true');  // TODO: unit test
  const [colorBlindMode, setColorBlindMode] = useState(localStorage.getItem('colorBlindMode') === 'true');  // TODO: unit test
  const [hardModeWords, setHardModeWords] = useState(new Set(wordleAcceptableWords));
  const [possibleWords, setPossibleWords] = useState(new Set(wordleAcceptableWords));
  
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

  const darkMode = colorMode === 'dark';  // TODO: useEffect?

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

  const focusGuessesBoard = () => {  // focus on guesses board if at the game
    if (window.location.pathname === gamePath) {
      guessesBoardRef.current.focus();
    }
  }

  const pages = [
    {
      path: gamePath,  // homepage
      label: 'Play',
      element: (
        <Game
          colorMode={colorMode}
          hardMode={hardMode}
          colorBlindMode={colorBlindMode}
          darkMode={darkMode}
          hardModeWords={hardModeWords}
          setHardModeWords={setHardModeWords}
          possibleWords={possibleWords}
          setPossibleWords={setPossibleWords}
          focusGuessesBoard={focusGuessesBoard}
          ref={guessesBoardRef}
        />
      )
    },
    { path: '/about', label: 'About', element: <AboutPage /> },
    { path: '/news', label: 'News', element: <NewsPage /> },
    { path: 'https://docs.google.com/forms/d/e/1FAIpQLSfKeTZCnnicWaVnn0PpGWvUjZvjrXeA7rx1wZUKCNnJJbIthA/viewform?usp=sf_link', label: 'Feedback' },
    { path: 'https://www.paypal.com/donate/?hosted_button_id=JWHYPBKUV6FQE', label: 'Donate' },
  ]

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <ResponsiveAppBar
            pages={pages}
            hardMode={hardMode}
            handleHardModeChange={handleHardModeChange}
            colorBlindMode={colorBlindMode}
            handleColorBlindModeChange={handleColorBlindModeChange}
            darkMode={darkMode}
            toggleColorMode={toggleColorMode}
            focusGuessesBoard={focusGuessesBoard}
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
