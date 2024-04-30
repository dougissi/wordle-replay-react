import './App.css';
import useScreenSize from './components/useScreenSize';
import { useState, useEffect } from 'react';
import { backspaceSymbol, getDateToday, isSingleEnglishLetter } from './utils';
import { dateToWord } from './assets/date_to_word';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import GuessesBoard from './components/GuessesBoard';
import Keyboard from './components/Keyboard';

const numLetters = 5;
const initialNumGuessesToShow = 6;

function App() {
  const screenSize = useScreenSize();
  const [puzzleDate, setPuzzleDate] = useState(getDateToday());
  const [answer, setAnswer] = useState(dateToWord.get(puzzleDate));
  const [guessesData, setGuessesData] = useState(Array(initialNumGuessesToShow).fill(Array(numLetters).fill("")));
  const [nextLetterIndex, setNextLetterIndex] = useState([0,0]);

  // console.log(`${puzzleDate} ${answer}`);
  // console.log(`${new Date()}`);
  // console.log(guessesData);

  const handleInputText = (text) => {
    console.log(`entered ${text}`);

    const newGuessesData = [...guessesData];
    const newNextLetterIndex = [...nextLetterIndex];
    console.log(newNextLetterIndex[1]);

    if (text === 'ENTER' && nextLetterIndex[1] === numLetters) {  // ENTER at end of word
      // TODO: evaluate guess
      console.log(`TODO: evaluate ${guessesData[nextLetterIndex[0]]}`);

      newNextLetterIndex[0]++;
      newNextLetterIndex[1] = 0;
      if (newNextLetterIndex[0] === newGuessesData.length) {  // at end of all words
        newGuessesData.push(Array(numLetters).fill(""));
      }
    } else if ((text === 'BACKSPACE' || text === backspaceSymbol) && nextLetterIndex[1] > 0) {  // BACKSPACE with some letters
      const updatedGuess = [...newGuessesData[nextLetterIndex[0]]];
      updatedGuess[nextLetterIndex[1] - 1] = "";
      newGuessesData[nextLetterIndex[0]] = updatedGuess;
      newNextLetterIndex[1]--;
    } else if (isSingleEnglishLetter(text) && newNextLetterIndex[1] < numLetters) {
      const newGuess = [...newGuessesData[nextLetterIndex[0]]];
      newGuess[nextLetterIndex[1]] = text;
      newGuessesData[nextLetterIndex[0]] = newGuess;
      newNextLetterIndex[1]++;
    }

    setGuessesData(newGuessesData);
    setNextLetterIndex(newNextLetterIndex);
  };

  // Add 'keydown' event listener when the component mounts
  useEffect(() => {

    // Define a function to handle key press events
    const handleKeyPress = (event) => {
      // console.log('Key pressed:', event.key);
      handleInputText(event.key.toUpperCase());
    };

    document.addEventListener('keydown', handleKeyPress);

    // Clean up by removing the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  });

  return (
    <div className="App">
      <ResponsiveAppBar />
      {/* <div>
        <h1>Screen Size Detection with React Hook</h1>
        <p>Width: {screenSize.width}</p>
        <p>Height: {screenSize.height}</p>
      </div> */}

      <GuessesBoard
        screenSize={screenSize}
        answer={answer}
        guessesData={guessesData}
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
