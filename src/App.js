import './App.css';
import { createContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Route, Routes } from "react-router-dom";
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Game from './components/Game';
import CssBaseline from '@mui/material/CssBaseline';
import AboutPage from './components/Pages/AboutPage';
import NewsPage from './components/Pages/NewsPage';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = useState(localStorage.getItem('colorMode') || 'light');  // TODO: unit test and set in localStorage
  
  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('colorMode', newMode);  // persist
    setMode(newMode);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  const pages = [
    { path: '/', label: 'Play', element: <Game colorMode={mode} toggleColorMode={toggleColorMode} /> },
    { path: '/about', label: 'About', element: <AboutPage /> },
    { path: '/news', label: 'News', element: <NewsPage /> },
  ]

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <ResponsiveAppBar pages={pages} />
          <Routes>
            {pages.map((page) => (
              <Route key={`${page.label}-page`} path={page.path} element={page.element} />
            ))}
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
