import './App.css';
import useScreenSize from './components/useScreenSize';
import { useState } from 'react';
import { getDateToday, isSingleEnglishLetter, getGuessRanks, getLetterAlphabetIndex } from './utils';
import { rankToColor, backspaceSymbol } from "./constants";
import { dateToWord } from './assets/date_to_word';
import { wordleAcceptableWords } from './assets/wordle_acceptable_words';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import GuessesBoard from './components/GuessesBoard';
import Keyboard from './components/Keyboard';
import { InvalidGuessDialog, WonDialog } from './components/AlertDialog';


const numLetters = 5;
const initialNumGuessesToShow = 6;

function App() {
  const screenSize = useScreenSize();
  const [puzzleDate, setPuzzleDate] = useState(getDateToday());
  const [answer, setAnswer] = useState(dateToWord.get(puzzleDate).toUpperCase());
  const [guessesData, setGuessesData] = useState(Array(initialNumGuessesToShow).fill(Array(numLetters).fill("")));
  const [guessesColors, setGuessesColors] = useState(Array(initialNumGuessesToShow).fill(Array(numLetters).fill("")));
  const [letterMaxRanks, setLetterMaxRanks] = useState(Array(26).fill('-1'));
  const [nextLetterIndex, setNextLetterIndex] = useState([0,0]);
  const [invalidGuess, setInvalidGuess] = useState("");
  const [invalidGuessDialogOpen, setInvalidGuessDialogOpen] = useState(false);
  const [wonDialogOpen, setWonDialogOpen] = useState(false);

  // console.log(`${puzzleDate} ${answer}`);
  // console.log(`${new Date()}`);
  // console.log(guessesData);

  const handleInputText = (text) => {
    // console.log(`entered ${text}`);

    if (text === 'ENTER' && nextLetterIndex[1] === numLetters) {  // ENTER at end of word
      const guess = guessesData[nextLetterIndex[0]].join("");
      if (!wordleAcceptableWords.has(guess.toLowerCase())) {
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
          console.log('TODO: winner!');
          setWonDialogOpen(true);
        } else {  // guess not the answer
          // update next letter index, potentially adding a new row
          const nextRowIndex = nextLetterIndex[0] + 1;
          if (nextRowIndex === guessesData.length) {  // at end of all words
            setGuessesData([...guessesData, Array(numLetters).fill("")]);  // add blank row
            setGuessesColors([...newGuessesColors, Array(numLetters).fill("")]); // add blank row
          }
          setNextLetterIndex([nextRowIndex, 0]);
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
    newGuessesData[nextLetterIndex[0]] = Array(numLetters).fill("");  // blank guess
    setGuessesData(newGuessesData);
    setNextLetterIndex([nextLetterIndex[0], 0]);
  };

  return (
    <div className="App">
      <ResponsiveAppBar />
      {/* <div>
        <h1>Screen Size Detection with React Hook</h1>
        <p>Width: {screenSize.width}</p>
        <p>Height: {screenSize.height}</p>
      </div> */}
      {invalidGuessDialogOpen && (
        <InvalidGuessDialog 
          open={invalidGuessDialogOpen} 
          handleClose={() => setInvalidGuessDialogOpen(false)}
          guess={invalidGuess}
          clearGuess={clearGuess}
        />
      )}

      {wonDialogOpen && (
        <WonDialog
          open={wonDialogOpen}
          handleClose={() => setWonDialogOpen(false)}
          answer={answer}
        />
      )}

      <GuessesBoard
        screenSize={screenSize}
        guessesData={guessesData}
        guessesColors={guessesColors}
        handleInputText={handleInputText}
      />
      <Keyboard
        screenSize={screenSize}
        letterMaxRanks={letterMaxRanks}
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
