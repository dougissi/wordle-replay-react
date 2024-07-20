import { alreadySolved, getNextUnsolvedDate, getPreviousUnsolvedDate, getEarliestUnsolvedDate, getLatestUnsolvedDate, getClosestUnsolvedDate } from "../utils";

const solvedDate = '2024-05-28';  // doesn't matter what solved date is, just needs to exist


// alreadySolved

it('alreadySolved: true', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: solvedDate}
    }
    const dateStr = '2024-05-28';
    const actual = alreadySolved(guessesDB, dateStr);
    const expected = true;
    expect(actual).toEqual(expected);
})

it('alreadySolved: false', () => {
    const guessesDB = {
        '2024-05-28': {solvedDate: solvedDate}
    }
    const dateStr = '2024-05-29';
    const actual = alreadySolved(guessesDB, dateStr);
    const expected = false;
    expect(actual).toEqual(expected);
})


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


// getClosestUnsolvedDate

it('getClosestUnsolvedDate: closest is current puzzle date', () => {
    const guessesDB = {
        '2024-07-18': {solvedDate: solvedDate},
        '2024-07-19': {solvedDate: solvedDate},
        '2024-07-20': {solvedDate: solvedDate},
    }
    const today = '2024-07-20';
    const puzzleDate = '2024-01-01';
    const actual = getClosestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-01-01';
    expect(actual).toEqual(expected);
})

it('getClosestUnsolvedDate: closest is one forward', () => {
    const guessesDB = {
        '2024-06-18': {solvedDate: solvedDate},
        '2024-06-19': {solvedDate: solvedDate},
        '2024-06-20': {solvedDate: solvedDate},
    }
    const today = '2024-07-20';
    const puzzleDate = '2024-06-20';
    const actual = getClosestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-06-21';
    expect(actual).toEqual(expected);
})

it('getClosestUnsolvedDate: closest is one back', () => {
    const guessesDB = {
        '2024-06-18': {solvedDate: solvedDate},
        '2024-06-19': {solvedDate: solvedDate},
        '2024-06-20': {solvedDate: solvedDate},
    }
    const today = '2024-07-20';
    const puzzleDate = '2024-06-18';
    const actual = getClosestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-06-17';
    expect(actual).toEqual(expected);
})

it('getClosestUnsolvedDate: closest is two forward', () => {
    const guessesDB = {
        '2024-06-18': {solvedDate: solvedDate},
        '2024-06-19': {solvedDate: solvedDate},
        '2024-06-20': {solvedDate: solvedDate},
        '2024-06-21': {solvedDate: solvedDate},
    }
    const today = '2024-07-20';
    const puzzleDate = '2024-06-20';
    const actual = getClosestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-06-22';
    expect(actual).toEqual(expected);
})

it('getClosestUnsolvedDate: closest is two back', () => {
    const guessesDB = {
        '2024-06-18': {solvedDate: solvedDate},
        '2024-06-19': {solvedDate: solvedDate},
        '2024-06-20': {solvedDate: solvedDate},
        '2024-06-21': {solvedDate: solvedDate},
    }
    const today = '2024-07-20';
    const puzzleDate = '2024-06-19';
    const actual = getClosestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-06-17';
    expect(actual).toEqual(expected);
})

it('getClosestUnsolvedDate: tied, default forward', () => {
    const guessesDB = {
        '2024-06-18': {solvedDate: solvedDate},
        '2024-06-19': {solvedDate: solvedDate},
        '2024-06-20': {solvedDate: solvedDate},
    }
    const today = '2024-07-20';
    const puzzleDate = '2024-06-19';
    const actual = getClosestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-06-21';
    expect(actual).toEqual(expected);
})

it('getClosestUnsolvedDate: run out of backwards', () => {
    const guessesDB = {
        '2021-06-19': {solvedDate: solvedDate},
        '2021-06-20': {solvedDate: solvedDate},
        '2021-06-21': {solvedDate: solvedDate},
        '2021-06-22': {solvedDate: solvedDate},
    }
    const today = '2024-07-20';
    const puzzleDate = '2021-06-20';
    const actual = getClosestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2021-06-23';
    expect(actual).toEqual(expected);
})

it('getClosestUnsolvedDate: run out of forwards', () => {
    const guessesDB = {
        '2024-07-17': {solvedDate: solvedDate},
        '2024-07-18': {solvedDate: solvedDate},
        '2024-07-19': {solvedDate: solvedDate},
        '2024-07-20': {solvedDate: solvedDate},
    }
    const today = '2024-07-20';
    const puzzleDate = '2024-07-19';
    const actual = getClosestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-07-16';
    expect(actual).toEqual(expected);
})

it('getClosestUnsolvedDate: at earliest date', () => {
    const guessesDB = {
        '2021-06-19': {solvedDate: solvedDate},
        '2021-06-20': {solvedDate: solvedDate},
        '2021-06-21': {solvedDate: solvedDate},
    }
    const today = '2024-07-20';
    const puzzleDate = '2021-06-19';
    const actual = getClosestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2021-06-22';
    expect(actual).toEqual(expected);
})

it('getClosestUnsolvedDate: at today', () => {
    const guessesDB = {
        '2024-07-18': {solvedDate: solvedDate},
        '2024-07-19': {solvedDate: solvedDate},
        '2024-07-20': {solvedDate: solvedDate},
    }
    const today = '2024-07-20';
    const puzzleDate = '2024-07-20';
    const actual = getClosestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = '2024-07-17';
    expect(actual).toEqual(expected);
})

it('getClosestUnsolvedDate: all solved', () => {
    const guessesDB = {
        '2021-06-19': {solvedDate: solvedDate},
        '2021-06-20': {solvedDate: solvedDate},
        '2021-06-21': {solvedDate: solvedDate},
    }
    const today = '2021-06-21';
    const puzzleDate = '2021-06-20';
    const actual = getClosestUnsolvedDate(puzzleDate, today, guessesDB);
    const expected = null;
    expect(actual).toEqual(expected);
})