import { getNextUnsolvedDate, getPreviousUnsolvedDate } from "../utils";


// getNextUnsolvedDate

it('getnextUnsolvedDate: current day unsolved', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: '2024-05-28'}
    }
    const today = '2024-06-01';
    const puzzleDate = '2024-05-25';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-05-26';
    expect(actual).toEqual(expected);
})

it('getNextUnsolvedDate: current day solved', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: '2024-05-28'}
    }
    const today = '2024-06-01';
    const puzzleDate = '2024-05-28';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-05-29';
    expect(actual).toEqual(expected);
})

it('getNextUnsolvedDate: two days ahead', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: '2024-05-28'},
        '2024-05-29': {solvedDate: '2024-05-29'}
    }
    const today = '2024-06-01';
    const puzzleDate = '2024-05-28';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-05-30';
    expect(actual).toEqual(expected);
})

it('getNextUnsolvedDate: two days ahead is today', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: '2024-05-28'},
        '2024-05-29': {solvedDate: '2024-05-29'}
    }
    const today = '2024-05-30';
    const puzzleDate = '2024-05-28';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-05-30';
    expect(actual).toEqual(expected);
})

it('getNextUnsolvedDate: bridge gap', () => {
    const guessesDB = {
        '2024-05-25': {solvedDate: '2024-05-25'},
        '2024-05-26': {solvedDate: '2024-05-26'},
        // gap
        '2024-05-28': {solvedDate: '2024-05-28'},
        '2024-05-29': {solvedDate: '2024-05-29'}
    }
    const today = '2024-05-30';
    const puzzleDate = '2024-05-25';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-05-27';
    expect(actual).toEqual(expected);
})

it('getNextUnsolvedDate: nothing forward', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: '2024-05-28'},
        '2024-05-29': {solvedDate: '2024-05-29'}
    }
    const today = '2024-05-29';
    const puzzleDate = '2024-05-28';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = null;
    expect(actual).toEqual(expected);
})

it('getNextUnsolvedDate: all solved', () => {
    const guessesDB = {
        '2019-06-19': {solvedDate: '2019-06-19'},
        '2019-06-20': {solvedDate: '2019-06-20'}
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
        '2024-05-28': {solvedDate: '2024-05-28'}
    }
    const puzzleDate = '2024-05-30';
    const actual = getPreviousUnsolvedDate(puzzleDate, guessesDB);
    const expected = '2024-05-29';
    expect(actual).toEqual(expected);
})

it('getPreviousUnsolvedDate: current day solved', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: '2024-05-28'}
    }
    const puzzleDate = '2024-05-28';
    const actual = getPreviousUnsolvedDate(puzzleDate, guessesDB);
    const expected = '2024-05-27';
    expect(actual).toEqual(expected);
})

it('getPreviousUnsolvedDate: two days ago', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: '2024-05-28'},
        '2024-05-29': {solvedDate: '2024-05-29'}
    }
    const puzzleDate = '2024-05-29';
    const actual = getPreviousUnsolvedDate(puzzleDate, guessesDB);
    const expected = '2024-05-27';
    expect(actual).toEqual(expected);
})

it('getPreviousUnsolvedDate: two days prior is earliest day', () => {
    const guessesDB = {
        '2021-06-20': {solvedDate: '2021-06-20'},
        '2021-06-21': {solvedDate: '2021-06-21'}
    }
    const puzzleDate = '2021-06-21';
    const actual = getPreviousUnsolvedDate(puzzleDate, guessesDB);
    const expected = '2021-06-19';
    expect(actual).toEqual(expected);
})

it('getPreviousUnsolvedDate: bridge gap', () => {
    const guessesDB = {
        '2024-05-25': {solvedDate: '2024-05-25'},
        '2024-05-26': {solvedDate: '2024-05-26'},
        // gap
        '2024-05-28': {solvedDate: '2024-05-28'},
        '2024-05-29': {solvedDate: '2024-05-29'}
    }
    const puzzleDate = '2024-05-29';
    const actual = getPreviousUnsolvedDate(puzzleDate, guessesDB);
    const expected = '2024-05-27';
    expect(actual).toEqual(expected);
})

it('getPreviousUnsolvedDate: all solved', () => {
    const guessesDB = {
        '2019-06-19': {solvedDate: '2019-06-19'},
        '2019-06-20': {solvedDate: '2019-06-20'}
    }
    const puzzleDate = '2019-06-20';
    const actual = getPreviousUnsolvedDate(puzzleDate, guessesDB);
    const expected = null;
    expect(actual).toEqual(expected);
})
