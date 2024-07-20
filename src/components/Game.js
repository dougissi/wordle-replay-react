import { numLetters, rankToColor, backspaceSymbol, initialNumGuessesToShow, remainingSolutionsText } from "../constants";
import { useEffect, useState, forwardRef } from 'react';
import { blankRow, isSingleEnglishLetter, getGuessRanks, getLetterAlphabetIndex, union } from '../utils';
import useScreenSize from './useScreenSize';
import GuessesBoard from './GuessesBoard';
import Keyboard from './Keyboard';
import InvalidGuessDialog from "./Dialogs/InvalidGuessDialog";
import WonDialog from "./Dialogs/WonDialog";
import { Button, Stack, Typography } from "@mui/material";

import { getInsightsFromGuessRanks, getInsightCallback, satisfiesAllInsightCallbacks } from '../hardModeWordsFiltering';


const Game = forwardRef(({
  puzzleDate,
  hardMode,
  colorBlindMode,
  suggestionsVisible,
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
  enterGuess,
  invalidGuess,
  invalidGuessDialogOpen,
  setInvalidGuessDialogOpen,
  wonDialogOpen,
  setWonDialogOpen,
  deleteDBDates,
  numGuesses,
  solved,
  setSolved,
  playClosestUnsolvedDate,
  SuggestedGuessButtons,
  green,
  gray,
}, guessesBoardRef) => {
  const screenSize = useScreenSize();
  const [lastLoadedDate, setLastLoadedDate] = useState();
  const [lastLoadAttemptDate, setLastLoadAttemptDate] = useState();
  const [replayConfirm, setReplayConfirm] = useState(false);

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
        newSeenInsights = union(newSeenInsights, insights);

        // track if solved
        if (guessRanks === '22222') {
          isSolved = true;
          setSolved(true);
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
  }, [puzzleDate, lastLoadAttemptDate, lastLoadedDate, guessesDB, answer, hardModeWords, setHardModeWords, letterMaxRanks, focusGuessesBoard, setGuessesColors, setGuessesData, setLetterMaxRanks, setNextLetterIndex, setSeenInsights, setSolved]);

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

      {solved && <Button onClick={() => setWonDialogOpen(true)}>Show Win Screen</Button>}

      {suggestionsVisible && !solved && (
        <Stack spacing={1} sx={{ p: 1 }} >
          <Typography>Top Suggestions</Typography>
          <SuggestedGuessButtons />
          <Typography>{remainingSolutionsText(hardModeWords)}</Typography>
        </Stack>
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
        handleClose={() => {setWonDialogOpen(false); setReplayConfirm(false);}}
        answer={answer}
        numGuesses={numGuesses()}
        deleteDBDates={deleteDBDates}
        guessesColors={guessesColors}
        distributionData={distributionData}
        colorBlindMode={colorBlindMode}
        puzzleNum={puzzleNum}
        puzzleDate={puzzleDate}
        replayConfirm={replayConfirm}
        setReplayConfirm={setReplayConfirm}
        playClosestUnsolvedDate={playClosestUnsolvedDate}
        green={green}
        gray={gray}
      />
      {/* End Dialogs */}
    </div>
  );
});

export default Game;
