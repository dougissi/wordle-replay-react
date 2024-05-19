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
    return dayjs(date).isBetween(start, end, 'day', '[]');
}

function processGuessesDB(guessesDBArr) {
    const distribution = {...emptyDistributionData};
    const guessesDB = {};
    guessesDBArr.forEach((row) => {
        const countLabel = row.guesses.length < 7 ? row.guesses.length : '7+';
        distribution[countLabel] = (distribution[countLabel] || 0) + 1;
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
    processGuessesDB,
    formatOldDataForIndexedDB
}
