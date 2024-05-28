import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { numLetters, initialNumGuessesToShow, emptyDistributionData, earliestDate, colorMap, NONE } from "./constants";
dayjs.extend(isBetween);

function blankRow(fillValue = "") {
    return Array(numLetters).fill(fillValue);
}

function blankGuessesGrid() {
    return Array(initialNumGuessesToShow).fill(blankRow());
}

function isSingleEnglishLetter(text) {
    // Regular expression to match a single English letter
    const regex = /^[a-zA-Z]$/;
  
    // Check if the text is exactly one character long and matches the regular expression
    return text.length === 1 && regex.test(text);
}

function getTileColor(color, darkMode, colorBlindMode) {
    // TODO: unit tests
    if (color === NONE) {
        return NONE;
    }
    if (darkMode) {
        if (colorBlindMode) {
            return colorMap.dark.colorBlind[color];
        }
        return colorMap.dark.standard[color];
    } // not dark mode
    if (colorBlindMode) {
        return colorMap.light.colorBlind[color];
    }
    return colorMap.light.standard[color];
}

function getGuessRanks(guess, answer) {
    const n = guess.length;
    if (n !== answer.length) {
        throw new Error(`'${guess}' and '${answer}' not same length`);
    }

    const result = [...guess];
    const ans = [...answer];

    // check for greens
    for (let i = 0; i < n; i++) {
        if (guess[i] === ans[i]) {
            result[i] = 2;
            ans[i] = ''
        }
    }

    // check for yellows and grays
    for (let i = 0; i < n; i++) {
        if (result[i] !== 2) {
            const j = ans.indexOf(guess[i]);
            if (j === -1) {
                result[i] = 0;
                ans[j] = '';
            } else {
                result[i] = 1;
                ans[j] = '';
            }
        }
    }

    return result.join("");
}

function getLetterAlphabetIndex(letter) {    
    // Get the ASCII code of the letter and subtract the ASCII code of 'A' to get the position
    const position = letter.charCodeAt(0) - 'A'.charCodeAt(0);
  
    // Check if the input is a valid uppercase letter
    if (position < 0 || position > 25) {
      throw new Error("Input is not a valid uppercase letter");
    }
  
    return position;
}

function dateToPuzzleNum(date) {
    date = dayjs(date);
    return date.diff(dayjs(earliestDate), 'days');
}

function puzzleNumToDate(puzzleNum) {
    return dayjs(earliestDate).add(puzzleNum, 'days').format('YYYY-MM-DD');
}

function dateIsBetween(date, start, end) {
    if (!date) {
        return false;
    }
    const d = dayjs(date);
    if (d.isValid()) {
        return d.isBetween(start, end, 'day', '[]');
    }
    return false;
}

function numIsBetween(num, start, end) {
    if (num === null) {
        return false;
    }
    return num >= start && num <= end;
}

function getDistCountLabel(numGuesses) {
    return numGuesses < 7 ? numGuesses : '7+';
}

function processGuessesDB(guessesDBArr) {
    const distribution = {...emptyDistributionData};
    const guessesDB = {};
    guessesDBArr.forEach((row) => {
        if (row.solvedDate) {  // only included solved in distribution
            const countLabel = getDistCountLabel(row.guesses.length);
            distribution[countLabel] = (distribution[countLabel] || 0) + 1;
        }
        guessesDB[row.date] = row;
    });
    return [distribution, guessesDB];
}

function formatOldDataForIndexedDB(oldData) {
    if (!oldData) {
        return [];
    }
    const parsedData = JSON.parse(oldData);
    const newSolvedData = [];
    for (const [puzzleNum, solvedItem] of Object.entries(parsedData)) {
        newSolvedData.push({
            puzzleNum: parseInt(puzzleNum),
            date: puzzleNumToDate(puzzleNum),
            solvedDate: solvedItem.solvedDate,
            guesses: solvedItem.guesses.map((guess) => [...guess.toUpperCase()])
        });
    }
    return newSolvedData;
}

const getNextUnsolvedDate = (puzzleDate, today, guessesDB) => {
    let currDateStr = puzzleDate;
    let currDate = dayjs(currDateStr);

    // look forward from current
    while (currDateStr <= today) {
      if (!guessesDB[currDateStr]?.solvedDate) {
        return currDateStr;
      }

      // add day
      currDate = currDate.add(1, 'day');
      currDateStr = currDate.format('YYYY-MM-DD');
    }

    // nothing found going forward, instead look back
    currDateStr = puzzleDate;
    currDate = dayjs(currDateStr);
    while (currDateStr >= earliestDate) {
      if (!guessesDB[currDateStr]?.solvedDate) {
        return currDateStr;
      }

      // subtract day
      currDate = currDate.subtract(1, 'day');
      currDateStr = currDate.format('YYYY-MM-DD');
    }

    return null;  // all solved
  }

export {
    blankRow,
    blankGuessesGrid,
    isSingleEnglishLetter,
    getTileColor,
    getGuessRanks,
    getLetterAlphabetIndex,
    dateToPuzzleNum,
    puzzleNumToDate,
    dateIsBetween,
    numIsBetween,
    getDistCountLabel,
    processGuessesDB,
    formatOldDataForIndexedDB,
    getNextUnsolvedDate
}
