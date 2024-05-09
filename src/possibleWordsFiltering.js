/**
 * Gets insights from guess and its ranks
 * 
 * @param {*} guess string of 5 letters
 * @param {*} guessRanks string of 5 numbers either 0, 1, 2 representing gray, yellow, green, respectively
 * @returns list of insights
 * 
 * Example:
 * const guess = 'arial';
 * const guessRanks = '21001';
 * const expected = [
 *     'index 0 == a',
 *     'index 1 != r',
 *     'index 4 != l',
 *     'countOf a == 1',
 *     'countOf r >= 1',
 *     'countOf i == 0',
 *     'countOf l >= 1'
 * ]
 */
function getInsightsFromGuessRanks(guess, guessRanks) {
    const letterInfo = {};
    const insights = [];
    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        const rank = guessRanks[i];

        // initialize letter info object if not yet present
        if (!letterInfo[letter]) {
            letterInfo[letter] = {minCount: 0, maxed: false};
        }
        
        // add insights on letters at particular indices
        // and gather info about about letter counts
        if (rank === '2') {  // green
            insights.push(`index ${i} == ${letter}`);
            letterInfo[letter].minCount++;
        } else if (rank === '1') {  // yellow
            insights.push(`index ${i} != ${letter}`);
            letterInfo[letter].minCount++;
        } else {  // gray
            letterInfo[letter].maxed = true;
        }
    }

    // add letter count insights
    for (const [letter, info] of Object.entries(letterInfo)) {
        const equality = info.maxed ? "==" : ">=";
        insights.push(`countOf ${letter} ${equality} ${info.minCount}`);
    }

    return insights;
}

function getLetterCounts(word) {
    const letterCounts = {};
    for (let i = 0; i < word.length; i++) {
        letterCounts[word[i]] = (letterCounts[word[i]] || 0) + 1;
    }
    return letterCounts;
}

function getInsightCallback(insight) {
    const parseError = new Error(`could not parse insight: '${insight}`);
    const insightWords = insight.split(' ');
    if (insightWords[0] === 'index') {
        const i = insightWords[1];
        const equality = insightWords[2];
        const letter = insightWords[3];
        if (equality === "==") {
            return (word, _) => word[i] === letter;
        } else if (equality === "!=") {
            return (word, _) => word[i] !== letter;
        } else {
            throw parseError;
        }
    } else if (insightWords[0] === 'countOf') {
        const letter = insightWords[1];
        const equality = insightWords[2];
        const count = Number(insightWords[3]);
        if (equality === "==") {
            return (_, letterCounts) => (letterCounts[letter] || 0) === count;
        } else if (equality === ">=") {
            return (_, letterCounts) => (letterCounts[letter] || 0) >= count;
        } else {
            throw parseError
        }
    } else {
        throw parseError;
    }
}

function satisfiesAllInsightCallbacks(word, insightCallbacks) {
    const letterCounts = getLetterCounts(word);
    for (let i = 0; i < insightCallbacks.length; i++) {
        const callback = insightCallbacks[i];
        if (!callback(word, letterCounts)) {
            return false;
        }
    }
    return true;
}

// only for testing purposes -- shouldn't create callbacks each time
function satisfiesAllInsights(word, insights) {
    const insightCallbacks = insights.map((insight) => getInsightCallback(insight));
    return satisfiesAllInsightCallbacks(word, insightCallbacks);
}


export {
    getInsightsFromGuessRanks,
    getLetterCounts,
    getInsightCallback,
    satisfiesAllInsightCallbacks,
    satisfiesAllInsights
}