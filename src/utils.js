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

function union(a, b) {
    return new Set([...a, ...b]);
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

const getUnsolvedDateForward = (start, end, guessesDB) => {
    let currDate = dayjs(start);
    let currDateStr = currDate.format('YYYY-MM-DD');
    const endStr = dayjs(end).format('YYYY-MM-DD');

    // look forward from current
    while (currDateStr <= endStr) {
        if (!guessesDB[currDateStr]?.solvedDate) {
            return currDateStr;
        }

        // add day
        currDate = currDate.add(1, 'day');
        currDateStr = currDate.format('YYYY-MM-DD');
    }

    return null;  // all solved
}

const getUnsolvedDateBackward = (end, start, guessesDB) => {
    let currDate = dayjs(end);
    let currDateStr = currDate.format('YYYY-MM-DD');
    const startStr = dayjs(start).format('YYYY-MM-DD');

    // look back from current
    while (currDateStr >= startStr) {
        if (!guessesDB[currDateStr]?.solvedDate) {
            return currDateStr;
        }

        // subtract day
        currDate = currDate.subtract(1, 'day');
        currDateStr = currDate.format('YYYY-MM-DD');
    }

    return null;  // all solved
}

const getNextUnsolvedDate = (puzzleDate, today, guessesDB) => {
    const nextDay = dayjs(puzzleDate).add(1, 'day');
    return getUnsolvedDateForward(nextDay, today, guessesDB);
}

const getPreviousUnsolvedDate = (puzzleDate, guessesDB) => {
    const prevDay = dayjs(puzzleDate).subtract(1, 'day');
    return getUnsolvedDateBackward(prevDay, earliestDate, guessesDB);
}

const getEarliestUnsolvedDate = (puzzleDate, guessesDB) => {
    const prevDay = dayjs(puzzleDate).subtract(1, 'day');
    return getUnsolvedDateForward(earliestDate, prevDay, guessesDB);
}

const getLatestUnsolvedDate = (puzzleDate, today, guessesDB) => {
    const nextDay = dayjs(puzzleDate).add(1, 'day');
    return getUnsolvedDateBackward(today, nextDay, guessesDB);
}

function countDuplicateLetters(word) {
    const seen = new Set();
    let dups = 0;
    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        if (seen.has(letter)) {
            dups++;
        }
        seen.add(letter);
    }
    return dups;
}

function getFreqs(words) {
    // get letter frequency by index
    const freqsByIndex = [];
    for (let i = 0; i < numLetters; i++) {
        freqsByIndex.push({});  // push each separately to ensure unique
    }
    const freqOverall = {};
    words.forEach(word => {
        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            freqsByIndex[i][letter] = (freqsByIndex[i][letter] || 0) + 1;
            freqOverall[letter] = (freqOverall[letter] || 0) + 1;
        }
    });
    return [freqsByIndex, freqOverall];
}

function getWordRanks(words, freqs) {
    const wordRanks = [];
    const [freqsByIndex, freqsByOverall] = freqs;
    words.forEach(word => {
        let rankByIndex = 0;
        let rankByOverall = 0;
        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            rankByIndex += freqsByIndex[i][letter];
            rankByOverall += freqsByOverall[letter];
        }
        wordRanks.push({
            word: word,
            dups: countDuplicateLetters(word),
            rankByIndex: rankByIndex,
            rankByOverall: rankByOverall
        });
    });
    return wordRanks;
}

function getTopSuggestions(words, n) {
    const freqs = getFreqs(words);
    const wordRanks = getWordRanks(words, freqs);
    return wordRanks.sort((a,b) => {
        // ascending dups
        if (a.dups < b.dups) {
            return -1;
        }
        if (a.dups > b.dups) {
            return 1;
        }
        // descending rankByOverall
        if (a.rankByOverall > b.rankByOverall) {
            return -1;
        }
        if (a.rankByOverall < b.rankByOverall) {
            return 1;
        }
        // descending rankByIndex
        if (a.rankByIndex > b.rankByIndex) {
            return -1;
        }
        if (a.rankByIndex < b.rankByIndex) {
            return 1;
        }
        // ascending alphabetically
        if (a.word < b.word) {
            return -1;
        }
        if (a.word > b.word) {
            return 1;
        }
        return 0;
    }).map(x => x.word).slice(0, n);
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
    union,
    getDistCountLabel,
    processGuessesDB,
    formatOldDataForIndexedDB,
    getNextUnsolvedDate,
    getPreviousUnsolvedDate,
    getEarliestUnsolvedDate,
    getLatestUnsolvedDate,
    countDuplicateLetters,
    getFreqs,
    getWordRanks,
    getTopSuggestions
}
