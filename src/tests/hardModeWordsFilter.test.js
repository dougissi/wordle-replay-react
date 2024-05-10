import { getInsightsFromGuessRanks, getLetterCounts, getInsightCallback, satisfiesAllInsights } from "../hardModeWordsFiltering";

// getInsightsFromGuessRanks

it('getInsightsFromGuessRanks: two "a" one gray one green, arial 01021', () => {
    const guess = 'arial';
    const guessRanks = '01021';
    const expected = [
        'index 1 != r',
        'index 3 == a',
        'index 4 != l',
        'countOf a == 1',
        'countOf r >= 1',
        'countOf i == 0',
        'countOf l >= 1'
    ]
    const actual = getInsightsFromGuessRanks(guess, guessRanks);
    expect(actual).toEqual(expected);
})

it('getInsightsFromGuessRanks: two "e" one green one yellow, greed 10120', () => {
    const guess = 'greed';
    const guessRanks = '10120';
    const expected = [
        'index 0 != g',
        'index 2 != e',
        'index 3 == e',
        'countOf g >= 1',
        'countOf r == 0',
        'countOf e >= 2',
        "countOf d == 0"
    ]
    const actual = getInsightsFromGuessRanks(guess, guessRanks);
    expect(actual).toEqual(expected);
})

it('getInsightsFromGuessRanks: three "e" one green two yellow, reede 01221', () => {
    const guess = 'reede';
    const guessRanks = '01221';
    const expected = [
        'index 1 != e',
        'index 2 == e',
        'index 3 == d',
        'index 4 != e',
        'countOf r == 0',
        'countOf e >= 3',
        'countOf d >= 1'
    ]
    const actual = getInsightsFromGuessRanks(guess, guessRanks);
    expect(actual).toEqual(expected);
})


// getLetterCounts

it('getLetterCounts: arose', () => {
    const word = 'arose';
    const expected = {
        a: 1,
        r: 1,
        o: 1,
        s: 1,
        e: 1
    }
    const actual = getLetterCounts(word);
    expect(actual).toEqual(expected);
})

it('getLetterCounts: stars', () => {
    const word = 'stars';
    const expected = {
        s: 2,
        t: 1,
        a: 1,
        r: 1
    }
    const actual = getLetterCounts(word);
    expect(actual).toEqual(expected);
})


// getInsightCallback

it('getInsightCallback: "index 2 == o" for "arose"', () => {
    const insight = "index 2 == o";
    const word = "arose";
    const letterCounts = getLetterCounts(word);
    const callback = getInsightCallback(insight);
    expect(callback(word, letterCounts)).toEqual(true);
})

it('getInsightCallback: "index 2 == o" for "ready"', () => {
    const insight = "index 2 == o";
    const word = "ready";
    const letterCounts = getLetterCounts(word);
    const callback = getInsightCallback(insight);
    expect(callback(word, letterCounts)).toEqual(false);
})

it('getInsightCallback: "countOf s == 2" for "stash"', () => {
    const insight = "countOf s == 2";
    const word = "stash";
    const letterCounts = getLetterCounts(word);
    const callback = getInsightCallback(insight);
    expect(callback(word, letterCounts)).toEqual(true);
})

it('getInsightCallback: "countOf s == 2" for "sassy"', () => {
    const insight = "countOf s == 2";
    const word = "sassy";
    const letterCounts = getLetterCounts(word);
    const callback = getInsightCallback(insight);
    expect(callback(word, letterCounts)).toEqual(false);
})

it('getInsightCallback: "countOf s >= 2" for "sassy"', () => {
    const insight = "countOf s >= 2";
    const word = "sassy";
    const letterCounts = getLetterCounts(word);
    const callback = getInsightCallback(insight);
    expect(callback(word, letterCounts)).toEqual(true);
})

it('getInsightCallback: "countOf s >= 2" for "arose"', () => {
    const insight = "countOf s >= 2";
    const word = "arose";
    const letterCounts = getLetterCounts(word);
    const callback = getInsightCallback(insight);
    expect(callback(word, letterCounts)).toEqual(false);
})

it('getInsightCallback: "countOf d == 0" for "arose"', () => {
    const insight = "countOf d == 0";
    const word = "arose";
    const letterCounts = getLetterCounts(word);
    const callback = getInsightCallback(insight);
    expect(callback(word, letterCounts)).toEqual(true);
})

it('getInsightCallback: "countOf d == 0" for "bread"', () => {
    const insight = "countOf d == 0";
    const word = "bread";
    const letterCounts = getLetterCounts(word);
    const callback = getInsightCallback(insight);
    expect(callback(word, letterCounts)).toEqual(false);
})


// satisfiesAllInsights

it('satisfiesAllInsights: arose true', () => {
    const word = 'arose';
    const insights = [
        'index 2 == o',
        'index 4 != t',
        'countOf b == 0',
        'countOf a >= 1',
    ]
    expect(satisfiesAllInsights(word, insights)).toEqual(true);
});

it('satisfiesAllInsights: arose false, not enough As', () => {
    const word = 'arose';
    const insights = [
        'index 2 == o',
        'index 4 != t',
        'countOf b == 0',
        'countOf a >= 2',  // not enough
    ]
    expect(satisfiesAllInsights(word, insights)).toEqual(false);
});

it('satisfiesAllInsights: arose false, has E at end', () => {
    const word = 'arose';
    const insights = [
        'index 2 == o',
        'index 4 != e',  // wrong
        'countOf b == 0',
        'countOf a >= 1',
    ]
    expect(satisfiesAllInsights(word, insights)).toEqual(false);
});