import './App.css';
import { createContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Route, Routes } from "react-router-dom";
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Game from './components/Game';
import CssBaseline from '@mui/material/CssBaseline';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = useState('light');  // TODO: unit test and set in localStorage
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <ResponsiveAppBar />
          <Routes>
            <Route path='/' element={<Game colorMode={mode} toggleColorMode={colorMode.toggleColorMode} />} />
            <Route path='/test' element={<div>Doug test</div>} />
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
