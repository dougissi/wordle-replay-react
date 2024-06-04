import { numLetters, rankToColor, backspaceSymbol, initialNumGuessesToShow } from "../constants";
import { useEffect, useState, forwardRef } from 'react';
import { blankRow, isSingleEnglishLetter, getGuessRanks, getLetterAlphabetIndex } from '../utils';
import useScreenSize from './useScreenSize';
// import { DateSelector } from './DateSelector';
// import { SearchBar } from './components/SearchBar';
import GuessesBoard from './GuessesBoard';
import Keyboard from './Keyboard';
import InvalidGuessDialog from "./Dialogs/InvalidGuessDialog";
import WonDialog from "./Dialogs/WonDialog";

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
  setSeenInsights,
  distributionData,
  guessesDB,
  hardModeWords,
  setHardModeWords,
  focusGuessesBoard,
  changeDate,
  resetGame,
  enterGuess,
  invalidGuess,
  invalidGuessDialogOpen,
  setInvalidGuessDialogOpen,
  wonDialogOpen,
  setWonDialogOpen,
  numGuesses,
  nextUnsolvedDate,
  previousUnsolvedDate,
  green,
  gray,
}, guessesBoardRef) => {
  const screenSize = useScreenSize();
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

  const handleInputText = (text) => {
    // console.log(`entered ${text}`);

    if (text === 'ENTER' && nextLetterIndex[1] === numLetters) {  // ENTER at end of word
      const guess = guessesData[nextLetterIndex[0]].join("");
      enterGuess(guess, guessesData);
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
        nextUnsolvedDate={nextUnsolvedDate}
        previousUnsolvedDate={previousUnsolvedDate}
        changeDate={changeDate}
        green={green}
        gray={gray}
      />
      {/* End Dialogs */}
    </div>
  );
});

export default Game;
