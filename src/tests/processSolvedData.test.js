import { processSolvedData } from "../utils";

it('processSolvedData: typical', () => {
    const dbData = [
        {date: '2024-05-01', guesses: [
            ['A', 'R', 'O', 'S', 'E '],
            ['T', 'R', 'I', 'E', 'D'],
            ['G', 'R', 'E', 'E', 'D'],
            ['B', 'R', 'E', 'E', 'D'],
            ['A', 'R', 'O', 'S', 'E '],
            ['T', 'R', 'I', 'E', 'D'],
            ['G', 'R', 'E', 'E', 'D']
        ]},
        {date: '2024-05-02', guesses: [
            ['A', 'R', 'O', 'S', 'E '],
            ['T', 'R', 'I', 'E', 'D'],
            ['G', 'R', 'E', 'E', 'D']
        ]},
        {date: '2024-05-03', guesses: [
            ['A', 'R', 'O', 'S', 'E '],
            ['T', 'R', 'I', 'E', 'D'],
            ['G', 'R', 'E', 'E', 'D']
        ]},
        {date: '2024-05-04', guesses: [
            ['A', 'R', 'O', 'S', 'E '],
            ['T', 'R', 'I', 'E', 'D'],
            ['G', 'R', 'E', 'E', 'D'],
            ['B', 'R', 'E', 'E', 'D'],
            ['A', 'R', 'O', 'S', 'E '],
            ['T', 'R', 'I', 'E', 'D'],
            ['G', 'R', 'E', 'E', 'D'],
            ['B', 'R', 'E', 'E', 'D'],
            ['A', 'R', 'O', 'S', 'E '],
            ['T', 'R', 'I', 'E', 'D']
        ]},
        {date: '2024-05-04', guesses: [  // shouldn't be repeats dates, but worth testing
            ['A', 'R', 'O', 'S', 'E '],
            ['T', 'R', 'I', 'E', 'D']
        ]}
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
    const expectedSolvedDates = new Set([
        '2024-05-01',
        '2024-05-02',
        '2024-05-03',
        '2024-05-04'
    ]);
    const actual = processSolvedData(dbData);
    expect(actual).toEqual([expectedDistribution, expectedSolvedDates]);
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
    const expectedSolvedDates = new Set();
    const actual = processSolvedData(dbData);
    expect(actual).toEqual([expectedDistribution, expectedSolvedDates]);
})