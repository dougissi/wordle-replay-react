import { calculateDistribution } from "../utils";

it('calculateDistribution: typical', () => {
    const dbData = [
        {numGuesses: 7},
        {numGuesses: 3},
        {numGuesses: 3},
        {numGuesses: 10},
        {numGuesses: 2}
    ];
    const expected = {
        1: 0,
        2: 1,
        3: 2,
        4: 0,
        5: 0,
        6: 0,
        '7+': 2
    };
    const actual = calculateDistribution(dbData);
    expect(actual).toEqual(expected);
})

it('calculateDistribution: empty', () => {
    const dbData = [];
    const expected = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        '7+': 0
    };
    const actual = calculateDistribution(dbData);
    expect(actual).toEqual(expected);
})