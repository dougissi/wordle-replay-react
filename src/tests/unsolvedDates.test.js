import { getNextUnsolvedDate, getPreviousUnsolvedDate, getEarliestUnsolvedDate, getLatestUnsolvedDate } from "../utils";

const solvedDate = '2024-05-28';  // doesn't matter what solved date is, just needs to exist


// getNextUnsolvedDate

it('getnextUnsolvedDate: current day unsolved', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: solvedDate}
    }
    const today = '2024-06-01';
    const puzzleDate = '2024-05-25';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-05-26';
    expect(actual).toEqual(expected);
})

it('getNextUnsolvedDate: current day solved', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: solvedDate}
    }
    const today = '2024-06-01';
    const puzzleDate = '2024-05-28';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-05-29';
    expect(actual).toEqual(expected);
})

it('getNextUnsolvedDate: two days ahead', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: solvedDate},
        '2024-05-29': {solvedDate: solvedDate}
    }
    const today = '2024-06-01';
    const puzzleDate = '2024-05-28';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-05-30';
    expect(actual).toEqual(expected);
})

it('getNextUnsolvedDate: two days ahead is today', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: solvedDate},
        '2024-05-29': {solvedDate: solvedDate}
    }
    const today = '2024-05-30';
    const puzzleDate = '2024-05-28';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-05-30';
    expect(actual).toEqual(expected);
})

it('getNextUnsolvedDate: bridge gap', () => {
    const guessesDB = {
        '2024-05-25': {solvedDate: solvedDate},
        '2024-05-26': {solvedDate: solvedDate},
        // gap
        '2024-05-28': {solvedDate: solvedDate},
        '2024-05-29': {solvedDate: solvedDate}
    }
    const today = '2024-05-30';
    const puzzleDate = '2024-05-25';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-05-27';
    expect(actual).toEqual(expected);
})

it('getNextUnsolvedDate: nothing forward', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: solvedDate},
        '2024-05-29': {solvedDate: solvedDate}
    }
    const today = '2024-05-29';
    const puzzleDate = '2024-05-28';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = null;
    expect(actual).toEqual(expected);
})

it('getNextUnsolvedDate: all solved', () => {
    const guessesDB = {
        '2019-06-19': {solvedDate: solvedDate},
        '2019-06-20': {solvedDate: solvedDate}
    }
    const today = '2019-06-20';
    const puzzleDate = '2019-06-20';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = null;
    expect(actual).toEqual(expected);
})


// getPreviousUnsolvedDate

it('getPreviousUnsolvedDate: current day unsolved', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: solvedDate}
    }
    const puzzleDate = '2024-05-30';
    const actual = getPreviousUnsolvedDate(puzzleDate, guessesDB);
    const expected = '2024-05-29';
    expect(actual).toEqual(expected);
})

it('getPreviousUnsolvedDate: current day solved', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: solvedDate}
    }
    const puzzleDate = '2024-05-28';
    const actual = getPreviousUnsolvedDate(puzzleDate, guessesDB);
    const expected = '2024-05-27';
    expect(actual).toEqual(expected);
})

it('getPreviousUnsolvedDate: two days ago', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: solvedDate},
        '2024-05-29': {solvedDate: solvedDate}
    }
    const puzzleDate = '2024-05-29';
    const actual = getPreviousUnsolvedDate(puzzleDate, guessesDB);
    const expected = '2024-05-27';
    expect(actual).toEqual(expected);
})

it('getPreviousUnsolvedDate: two days prior is earliest day', () => {
    const guessesDB = {
        '2021-06-20': {solvedDate: solvedDate},
        '2021-06-21': {solvedDate: solvedDate}
    }
    const puzzleDate = '2021-06-21';
    const actual = getPreviousUnsolvedDate(puzzleDate, guessesDB);
    const expected = '2021-06-19';
    expect(actual).toEqual(expected);
})

it('getPreviousUnsolvedDate: bridge gap', () => {
    const guessesDB = {
        '2024-05-25': {solvedDate: solvedDate},
        '2024-05-26': {solvedDate: solvedDate},
        // gap
        '2024-05-28': {solvedDate: solvedDate},
        '2024-05-29': {solvedDate: solvedDate}
    }
    const puzzleDate = '2024-05-29';
    const actual = getPreviousUnsolvedDate(puzzleDate, guessesDB);
    const expected = '2024-05-27';
    expect(actual).toEqual(expected);
})

it('getPreviousUnsolvedDate: all solved', () => {
    const guessesDB = {
        '2021-06-19': {solvedDate: solvedDate},
        '2021-06-20': {solvedDate: solvedDate}
    }
    const puzzleDate = '2021-06-21';
    const actual = getPreviousUnsolvedDate(puzzleDate, guessesDB);
    const expected = null;
    expect(actual).toEqual(expected);
})


// getEarliestUnsolvedDate

it('getEarliestUnsolvedDate: current day unsolved', () => {
    const guessesDB = {
        '2021-06-20': {solvedDate: solvedDate}
    }
    const puzzleDate = '2021-06-21';
    const actual = getEarliestUnsolvedDate(puzzleDate, guessesDB);
    const expected = '2021-06-19';
    expect(actual).toEqual(expected);
})

it('getEarliestUnsolvedDate: current day solved', () => {
    const guessesDB = {
        '2021-06-20': {solvedDate: solvedDate},
        '2021-06-21': {solvedDate: solvedDate}
    }
    const puzzleDate = '2021-06-21';
    const actual = getEarliestUnsolvedDate(puzzleDate, guessesDB);
    const expected = '2021-06-19';
    expect(actual).toEqual(expected);
})

it('getEarliestUnsolvedDate: earliest date solved', () => {
    const guessesDB = {
        '2021-06-19': {solvedDate: solvedDate},
    }
    const puzzleDate = '2021-06-21';
    const actual = getEarliestUnsolvedDate(puzzleDate, guessesDB);
    const expected = '2021-06-20';
    expect(actual).toEqual(expected);
})

it('getEarliestUnsolvedDate: bridge gap', () => {
    const guessesDB = {
        '2021-06-19': {solvedDate: solvedDate},
        '2021-06-20': {solvedDate: solvedDate},
        // gap
        '2021-06-22': {solvedDate: solvedDate},
        '2021-06-23': {solvedDate: solvedDate}
    }
    const puzzleDate = '2021-06-30';
    const actual = getEarliestUnsolvedDate(puzzleDate, guessesDB);
    const expected = '2021-06-21';
    expect(actual).toEqual(expected);
})

it('getEarliestUnsolvedDate: all solved', () => {
    const guessesDB = {
        '2021-06-19': {solvedDate: solvedDate},
        '2021-06-20': {solvedDate: solvedDate},
    }
    const puzzleDate = '2021-06-21';
    const actual = getEarliestUnsolvedDate(puzzleDate, guessesDB);
    const expected = null;
    expect(actual).toEqual(expected);
})


// getLatestUnsolvedDate

it('getLatestUnsolvedDate: current day unsolved', () => {
    const guessesDB = {
        '2024-05-30': {solvedDate: solvedDate}
    }
    const today = '2024-06-07';
    const puzzleDate = '2024-06-02';
    const actual = getLatestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-06-07';
    expect(actual).toEqual(expected);
})

it('getLatestUnsolvedDate: current day solved', () => {
    const guessesDB = {
        '2024-06-02': {solvedDate: solvedDate}
    }
    const today = '2024-06-07';
    const puzzleDate = '2024-06-02';
    const actual = getLatestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-06-07';
    expect(actual).toEqual(expected);
})

it('getLatestUnsolvedDate: latest date solved', () => {
    const guessesDB = {
        '2024-06-07': {solvedDate: solvedDate}
    }
    const today = '2024-06-07';
    const puzzleDate = '2024-06-02';
    const actual = getLatestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-06-06';
    expect(actual).toEqual(expected);
})

it('getLatestUnsolvedDate: bridge gap', () => {
    const guessesDB = {
        '2024-06-03': {solvedDate: solvedDate},
        '2024-06-04': {solvedDate: solvedDate},
        // gap
        '2024-06-06': {solvedDate: solvedDate},
        '2024-06-07': {solvedDate: solvedDate}
    }
    const today = '2024-06-07';
    const puzzleDate = '2024-05-20';
    const actual = getLatestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-06-05';
    expect(actual).toEqual(expected);
})

it('getLatestUnsolvedDate: all solved', () => {
    const guessesDB = {
        '2024-06-06': {solvedDate: solvedDate},
        '2024-06-07': {solvedDate: solvedDate}
    }
    const today = '2024-06-07';
    const puzzleDate = '2024-06-05';
    const actual = getLatestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = null;
    expect(actual).toEqual(expected);
})

