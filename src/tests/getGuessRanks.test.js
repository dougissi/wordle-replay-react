import { getGuessRanks } from '../utils';

it('getGuessRanks: lens of guess and answer do not match', () => {
    const guess = "foo"
    const answer = "crane"
    expect(() => getGuessRanks(guess, answer)).toThrow("'foo' and 'crane' not same length");
})

it('getGuessRanks: correct', () => {
    const guess = "ready";
    const answer = "ready";
    const expected = "22222";
    expect(getGuessRanks(guess, answer)).toEqual(expected);
});

it('getGuessRanks: completely wrong', () => {
    const guess = "stool";
    const answer = "ready";
    const expected = "00000";
    expect(getGuessRanks(guess, answer)).toEqual(expected);
});

it("getGuessRanks: two E's both yellow", () => {
    const guess = "beige";
    const answer = "green";
    const expected = "01011";
    expect(getGuessRanks(guess, answer)).toEqual(expected);
});

it("getGuessRanks: two E's first green, second gray", () => {
    const guess = "xxxee";
    const answer = "yyyey";
    const expected = "00020";
    expect(getGuessRanks(guess, answer)).toEqual(expected);
});

it("getGuessRanks: two E's first gray, second green", () => {
    const guess = "xxxee";
    const answer = "yyyye";
    const expected = "00002";
    expect(getGuessRanks(guess, answer)).toEqual(expected);
});

it("getGuessRanks: two E's first yellow, second gray", () => {
    const guess = "exxxe";
    const answer = "yeyyy";
    const expected = "10000";
    expect(getGuessRanks(guess, answer)).toEqual(expected);
});

it("getGuessRanks: two E's first yellow, second green", () => {
    const guess = "exxxe";
    const answer = "yeyye";
    const expected = "10002";
    expect(getGuessRanks(guess, answer)).toEqual(expected);
});

it('getGuessRanks: ready vs arose', () => {
    const guess = "ready";
    const answer = "arose";
    const expected = "11100";
    expect(getGuessRanks(guess, answer)).toEqual(expected);
});

