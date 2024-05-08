import { processSolvedData } from "../utils";

it('processSolvedData: typical', () => {
    const dbData = [
        {puzzleNum: 1, numGuesses: 7},
        {puzzleNum: 3, numGuesses: 3},
        {puzzleNum: 4, numGuesses: 3},
        {puzzleNum: 5, numGuesses: 10},
        {puzzleNum: 5, numGuesses: 2}  // shouldn't be repeats puzzleNums, but worth testing
    ];
    const expectedDistribution = {
        1: 0,
        2: 1,
        3: 2,
        4: 0,
        5: 0,
        6: 0,
        '7+': 2
    };
    const expectedSolvedNums = new Set([1, 3, 4, 5]);
    const actual = processSolvedData(dbData);
    expect(actual).toEqual([expectedDistribution, expectedSolvedNums]);
})

it('processSolvedData: empty', () => {
    const dbData = [];
    const expectedDistribution = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        '7+': 0
    };
    const expectedSolvedNums = new Set();
    const actual = processSolvedData(dbData);
    expect(actual).toEqual([expectedDistribution, expectedSolvedNums]);
})