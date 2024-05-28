import { getNextUnsolvedDate } from "../utils";

it('getNextUnsolvedDate: next day', () => {
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

it('getNextUnsolvedDate: yesterday', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: '2024-05-28'},
        '2024-05-29': {solvedDate: '2024-05-29'}
    }
    const today = '2024-05-29';
    const puzzleDate = '2024-05-28';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-05-27';
    expect(actual).toEqual(expected);
})

it('getNextUnsolvedDate: two days ago', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: '2024-05-28'},
        '2024-05-29': {solvedDate: '2024-05-29'}
    }
    const today = '2024-05-29';
    const puzzleDate = '2024-05-29';
    const actual = getNextUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-05-27';
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