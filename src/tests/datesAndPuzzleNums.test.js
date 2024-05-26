import { dateToPuzzleNum, puzzleNumToDate, dateIsBetween, numIsBetween } from "../utils";

// dateToPuzzleNum

it('dateToPuzzleNum: earliestDate', () => {
    const date = '2021-06-19';
    const expected = 0;
    const actual = dateToPuzzleNum(date);
    expect(actual).toEqual(expected);
})

it('dateToPuzzleNum: earliestDate + 1', () => {
    const date = '2021-06-20';
    const expected = 1;
    const actual = dateToPuzzleNum(date);
    expect(actual).toEqual(expected);
})

it('dateToPuzzleNum: earliestDate + 10', () => {
    const date = '2021-06-29';
    const expected = 10;
    const actual = dateToPuzzleNum(date);
    expect(actual).toEqual(expected);
})

it('dateToPuzzleNum: earliestDate + 1 year', () => {
    const date = '2022-06-19';
    const expected = 365;
    const actual = dateToPuzzleNum(date);
    expect(actual).toEqual(expected);
})


// puzzleNumToDate

it('puzzleNumToDate: 0', () => {
    const puzzleNum = 0;
    const expected = '2021-06-19';
    const actual = puzzleNumToDate(puzzleNum);
    expect(actual).toEqual(expected);
})

it('puzzleNumToDate: 1', () => {
    const puzzleNum = 1;
    const expected = '2021-06-20';
    const actual = puzzleNumToDate(puzzleNum);
    expect(actual).toEqual(expected);
})

it('puzzleNumToDate: 10', () => {
    const puzzleNum = 10;
    const expected = '2021-06-29';
    const actual = puzzleNumToDate(puzzleNum);
    expect(actual).toEqual(expected);
})

it('puzzleNumToDate: 365', () => {
    const puzzleNum = 365;
    const expected = '2022-06-19';
    const actual = puzzleNumToDate(puzzleNum);
    expect(actual).toEqual(expected);
})


// dateIsBetween

it('dateIsBetween: basic', () => {
    const date = '2021-06-20';
    const start = '2021-06-19';
    const end = '2021-06-21';
    const expected = true;
    const actual = dateIsBetween(date, start, end);
    expect(actual).toEqual(expected);
})

it('dateIsBetween: between, different 6/20/21', () => {
    const date = '6/20/21';
    const start = '2021-06-19';
    const end = '2021-06-21';
    const expected = true;
    const actual = dateIsBetween(date, start, end);
    expect(actual).toEqual(expected);
})

it('dateIsBetween: basic start', () => {
    const date = '2021-06-19';
    const start = '2021-06-19';
    const end = '2021-06-21';
    const expected = true;
    const actual = dateIsBetween(date, start, end);
    expect(actual).toEqual(expected);
})

it('dateIsBetween: basic end', () => {
    const date = '2021-06-21';
    const start = '2021-06-19';
    const end = '2021-06-21';
    const expected = true;
    const actual = dateIsBetween(date, start, end);
    expect(actual).toEqual(expected);
})

it('dateIsBetween: not between after end', () => {
    const date = '2021-06-22';
    const start = '2021-06-19';
    const end = '2021-06-21';
    const expected = false;
    const actual = dateIsBetween(date, start, end);
    expect(actual).toEqual(expected);
})

it('dateIsBetween: not between before start', () => {
    const date = '2021-06-18';
    const start = '2021-06-19';
    const end = '2021-06-21';
    const expected = false;
    const actual = dateIsBetween(date, start, end);
    expect(actual).toEqual(expected);
})

it('dateIsBetween: not between diff years', () => {
    const date = '2022-06-20';
    const start = '2021-06-19';
    const end = '2021-06-21';
    const expected = false;
    const actual = dateIsBetween(date, start, end);
    expect(actual).toEqual(expected);
})

it('dateIsBetween: not between, null', () => {
    const date = null;
    const start = '2021-06-19';
    const end = '2021-06-21';
    const expected = false;
    const actual = dateIsBetween(date, start, end);
    expect(actual).toEqual(expected);
})

it('dateIsBetween: not between, bad date 7', () => {
    const date = 7;
    const start = '2021-06-19';
    const end = '2021-06-21';
    const expected = false;
    const actual = dateIsBetween(date, start, end);
    expect(actual).toEqual(expected);
})

it('dateIsBetween: not between, bad date doug', () => {
    const date = 'doug';
    const start = '2021-06-19';
    const end = '2021-06-21';
    const expected = false;
    const actual = dateIsBetween(date, start, end);
    expect(actual).toEqual(expected);
})


// numIsBetween

it('numIsBetween: basic', () => {
    const num = 5;
    const start = 0;
    const end = 10;
    const actual = numIsBetween(num, start, end);
    const expected = true;
    expect(actual).toEqual(expected);
})

it('numIsBetween: basic, string', () => {
    const num = '5';
    const start = 0;
    const end = 10;
    const actual = numIsBetween(num, start, end);
    const expected = true;
    expect(actual).toEqual(expected);
})

it('numIsBetween: basic start', () => {
    const num = 0;
    const start = 0;
    const end = 10;
    const actual = numIsBetween(num, start, end);
    const expected = true;
    expect(actual).toEqual(expected);
})

it('numIsBetween: basic end', () => {
    const num = 10;
    const start = 0;
    const end = 10;
    const actual = numIsBetween(num, start, end);
    const expected = true;
    expect(actual).toEqual(expected);
})

it('numIsBetween: not between, before start', () => {
    const num = -1;
    const start = 0;
    const end = 10;
    const actual = numIsBetween(num, start, end);
    const expected = false;
    expect(actual).toEqual(expected);
})

it('numIsBetween: not between, after end', () => {
    const num = 11;
    const start = 0;
    const end = 10;
    const actual = numIsBetween(num, start, end);
    const expected = false;
    expect(actual).toEqual(expected);
})

it('numIsBetween: not between, null', () => {
    const num = null;
    const start = 0;
    const end = 10;
    const actual = numIsBetween(num, start, end);
    const expected = false;
    expect(actual).toEqual(expected);
})

it('numIsBetween: not between, bad num doug', () => {
    const num = 'doug';
    const start = 0;
    const end = 10;
    const actual = numIsBetween(num, start, end);
    const expected = false;
    expect(actual).toEqual(expected);
})
