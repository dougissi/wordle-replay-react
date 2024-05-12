import { formatOldDataForIndexedDB } from "../utils";

it('formatOldDataForIndexedDB: typical', () => {
    const localStorageData = '{"698":{"solvedDate":"2023-05-18","guesses":["shorn"]},"751":{"solvedDate":"2023-07-10","guesses":["arose","toyon","goldy","folky","folly"]},"774":{"solvedDate":"2023-08-02","guesses":["arose","lined","cutey","tweet","beget"]},"788":{"solvedDate":"2023-09-18","guesses":["arose","risus","shrug","strut","scrum","scrub"]},"945":{"solvedDate":"2024-01-22","guesses":["laser","large"]},"1024":{"solvedDate":"2024-04-08","guesses":["arose","tried","greed","breed"]},"1042":{"solvedDate":"2024-04-26","guesses":["alive","arose","livid","vivid","video","value","vapid"]}}'
    const expected = [
        {puzzleNum: 698, date: '2023-05-18', solvedDate: '2023-05-18', guesses: [
            ['S', 'H', 'O', 'R', 'N']
        ]},
        {puzzleNum: 751, date: '2023-07-10', solvedDate: '2023-07-10', guesses: [
            ['A', 'R', 'O', 'S', 'E'],
            ['T', 'O', 'Y', 'O', 'N'],
            ['G', 'O', 'L', 'D', 'Y'],
            ['F', 'O', 'L', 'K', 'Y'],
            ['F', 'O', 'L', 'L', 'Y'],
        ]},
        {puzzleNum: 774, date: '2023-08-02', solvedDate: '2023-08-02', guesses: [
            ['A', 'R', 'O', 'S', 'E'],
            ['L', 'I', 'N', 'E', 'D'],
            ['C', 'U', 'T', 'E', 'Y'],
            ['T', 'W', 'E', 'E', 'T'],
            ['B', 'E', 'G', 'E', 'T'],
        ]},
        {puzzleNum: 788, date: '2023-08-16', solvedDate: '2023-09-18', guesses: [
            ['A', 'R', 'O', 'S', 'E'],
            ['R', 'I', 'S', 'U', 'S'],
            ['S', 'H', 'R', 'U', 'G'],
            ['S', 'T', 'R', 'U', 'T'],
            ['S', 'C', 'R', 'U', 'M'],
            ['S', 'C', 'R', 'U', 'B'],
        ]},
        {puzzleNum: 945, date: '2024-01-20', solvedDate: '2024-01-22', guesses: [
            ['L', 'A', 'S', 'E', 'R'],
            ['L', 'A', 'R', 'G', 'E']
        ]},
        {puzzleNum: 1024, date: '2024-04-08', solvedDate: '2024-04-08', guesses: [
            ['A', 'R', 'O', 'S', 'E'],
            ['T', 'R', 'I', 'E', 'D'],
            ['G', 'R', 'E', 'E', 'D'],
            ['B', 'R', 'E', 'E', 'D']
        ]},
        {puzzleNum: 1042, date: '2024-04-26', solvedDate: '2024-04-26', guesses: [
            ['A', 'L', 'I', 'V', 'E'],
            ['A', 'R', 'O', 'S', 'E'],
            ['L', 'I', 'V', 'I', 'D'],
            ['V', 'I', 'V', 'I', 'D'],
            ['V', 'I', 'D', 'E', 'O'],
            ['V', 'A', 'L', 'U', 'E'],
            ['V', 'A', 'P', 'I', 'D'],
        ]}
    ];
    const actual = formatOldDataForIndexedDB(localStorageData);
    expect(actual).toEqual(expected);
})

it('formatOldDataForIndexedDB: empty', () => {
    const localStorageData = null;
    const expected = [];
    const actual = formatOldDataForIndexedDB(localStorageData);
    expect(actual).toEqual(expected);
})