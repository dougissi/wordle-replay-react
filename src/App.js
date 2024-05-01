import './App.css';
import useScreenSize from './components/useScreenSize';
import { useState } from 'react';
import { backspaceSymbol, getDateToday, isSingleEnglishLetter } from './utils';
import { dateToWord } from './assets/date_to_word';
import { wordleAcceptableWords } from './assets/wordle_acceptable_words';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import GuessesBoard from './components/GuessesBoard';
import Keyboard from './components/Keyboard';
import AlertDialog from './components/AlertDialog';


const numLetters = 5;
const initialNumGuessesToShow = 2;

function App() {
  const screenSize = useScreenSize();
  const [puzzleDate, setPuzzleDate] = useState(getDateToday());
  const [answer, setAnswer] = useState(dateToWord.get(puzzleDate));
  const [guessesData, setGuessesData] = useState(Array(initialNumGuessesToShow).fill(Array(numLetters).fill("")));
  const [nextLetterIndex, setNextLetterIndex] = useState([0,0]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // console.log(`${puzzleDate} ${answer}`);
  // console.log(`${new Date()}`);
  // console.log(guessesData);

  const handleInputText = (text) => {
    // console.log(`entered ${text}`);

    if (text === 'ENTER' && nextLetterIndex[1] === numLetters) {  // ENTER at end of word
      const guess = guessesData[nextLetterIndex[0]].join("").toLowerCase();
      if (!wordleAcceptableWords.has(guess)) {
        setDialogOpen(true);
      } else {
        evaluateGuess(guess);

        const nextRowIndex = nextLetterIndex[0] + 1;
        if (nextRowIndex === guessesData.length) {  // at end of all words
          setGuessesData([...guessesData, Array(numLetters).fill("")]);  // add blank row
        }
        setNextLetterIndex([nextRowIndex, 0]);
      }
    } else if ((text === 'BACKSPACE' || text === backspaceSymbol) && nextLetterIndex[1] > 0) {  // BACKSPACE with some letters
      const newGuessesData = [...guessesData];
      const updatedGuess = [...guessesData[nextLetterIndex[0]]];
      updatedGuess[nextLetterIndex[1] - 1] = "";
      newGuessesData[nextLetterIndex[0]] = updatedGuess;
      setGuessesData(newGuessesData);
      setNextLetterIndex([nextLetterIndex[0], nextLetterIndex[1] - 1]);
    } else if (isSingleEnglishLetter(text) && nextLetterIndex[1] < numLetters) {  // Letter not at end
      const newGuessesData = [...guessesData];
      const updatedGuess = [...guessesData[nextLetterIndex[0]]];
      updatedGuess[nextLetterIndex[1]] = text;
      newGuessesData[nextLetterIndex[0]] = updatedGuess;
      setGuessesData(newGuessesData);
      setNextLetterIndex([nextLetterIndex[0], nextLetterIndex[1] + 1]);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const evaluateGuess = (guess) => {
    console.log(`TODO: evaluate ${guess}`);
  };

  return (
    <div className="App">
      <ResponsiveAppBar />
      {/* <div>
        <h1>Screen Size Detection with React Hook</h1>
        <p>Width: {screenSize.width}</p>
        <p>Height: {screenSize.height}</p>
      </div> */}
      {dialogOpen && <AlertDialog open={dialogOpen} handleClose={handleDialogClose}/>}

      <GuessesBoard
        screenSize={screenSize}
        answer={answer}
        guessesData={guessesData}
        handleInputText={handleInputText}
      />
      <Keyboard
        screenSize={screenSize}
        answer={answer}
        handleInputText={handleInputText}
      />

      {/* Default create-react-app screen */}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
