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
  const [colorMode, setColorMode] = useState(localStorage.getItem('colorMode') || 'light');  // TODO: unit test
  
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

  const pages = [
    { path: '/', label: 'Play', element: <Game colorMode={colorMode} toggleColorMode={toggleColorMode} /> },
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
          <ResponsiveAppBar pages={pages} />
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
