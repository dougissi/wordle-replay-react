import { numLetters, initialNumGuessesToShow, emptyDistributionData } from "./constants";

// Function to generate an array of dates
function generateDateArray(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate > endDate) {
        throw new Error("start date greater than end date")
    }
    let currentDate = new Date(startDate);
    const dateArray = [];

    // Loop through dates until endDate is reached
    while (currentDate <= endDate) {
        dateArray.push(currentDate.toISOString().split('T')[0]); // Push date in 'YYYY-MM-DD' format
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return dateArray;
}

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

function calculateDistribution(dbData) {
    const distribution = {...emptyDistributionData};
    dbData.forEach((solutionData) => {
        const countLabel = solutionData.numGuesses < 7 ? solutionData.numGuesses : '7+';
        distribution[countLabel] = (distribution[countLabel] || 0) + 1;
    });
    return distribution;
}

export {
    generateDateArray,
    blankRow,
    blankGuessesGrid,
    isSingleEnglishLetter,
    getGuessRanks,
    getLetterAlphabetIndex,
    calculateDistribution
}
