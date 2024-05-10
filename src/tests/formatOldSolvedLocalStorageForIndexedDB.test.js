import { formatOldSolvedLocalStorageForIndexedDB } from "../utils";

it('form', () => {
    const localStorageData = '{"698":{"solvedDate":"2023-05-18","guesses":["shorn"]},"751":{"solvedDate":"2023-07-10","guesses":["arose","toyon","goldy","folky","folly"]},"774":{"solvedDate":"2023-08-02","guesses":["arose","lined","cutey","tweet","beget"]},"788":{"solvedDate":"2023-09-18","guesses":["arose","risus","shrug","strut","scrum","scrub"]},"945":{"solvedDate":"2024-01-22","guesses":["laser","large"]},"1024":{"solvedDate":"2024-04-08","guesses":["arose","tried","greed","breed"]},"1042":{"solvedDate":"2024-04-26","guesses":["alive","arose","livid","vivid","video","value","vapid"]}}'
    const expected = [
        {puzzleNum: '?', date: '?', solvedDate: '?', numGuesses: 0, guesses: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
        ]},
        {puzzleNum: '?', date: '?', solvedDate: '?', numGuesses: 0, guesses: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
        ]},
        {puzzleNum: '?', date: '?', solvedDate: '?', numGuesses: 0, guesses: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
        ]},
        {puzzleNum: '?', date: '?', solvedDate: '?', numGuesses: 0, guesses: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
        ]},
        {puzzleNum: '?', date: '?', solvedDate: '?', numGuesses: 0, guesses: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
        ]},
        {puzzleNum: '?', date: '?', solvedDate: '?', numGuesses: 0, guesses: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
        ]},
    ];
    expect(true).toBe(true); // TODO
})