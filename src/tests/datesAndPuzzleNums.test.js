import { dateToPuzzleNum, puzzleNumToDate } from "../utils";

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
