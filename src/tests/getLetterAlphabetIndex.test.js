import { getLetterAlphabetIndex } from "../utils";

it('getLetterAlphabetIndex: A to 0', () => {
    expect(getLetterAlphabetIndex('A')).toEqual(0);
})

it('getLetterAlphabetIndex: Z to 25', () => {
    expect(getLetterAlphabetIndex('Z')).toEqual(25);
})

it('getLetterAlphabetIndex: E to 4', () => {
    expect(getLetterAlphabetIndex('E')).toEqual(4);
})

it('getLetterAlphabetIndex: "a" not capital', () => {
    expect(() => getLetterAlphabetIndex('a')).toThrow(Error);
})

it('getLetterAlphabetIndex: "3" invalid', () => {
    expect(() => getLetterAlphabetIndex('3')).toThrow(Error);
})
