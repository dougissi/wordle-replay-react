import { isSingleEnglishLetter } from "../utils";

// // Example usage:
    // console.log(isSingleEnglishLetter('A')); // true
    // console.log(isSingleEnglishLetter('a')); // true
    // console.log(isSingleEnglishLetter('Z')); // true
    // console.log(isSingleEnglishLetter('z')); // true
    // console.log(isSingleEnglishLetter('1')); // false
    // console.log(isSingleEnglishLetter('AB')); // false
    // console.log(isSingleEnglishLetter('@')); // false

it('isSingleEnglishLetter: A', () => {
    expect(isSingleEnglishLetter('A')).toEqual(true);
})

it('isSingleEnglishLetter: a', () => {
    expect(isSingleEnglishLetter('a')).toEqual(true);
})

it('isSingleEnglishLetter: Z', () => {
    expect(isSingleEnglishLetter('Z')).toEqual(true);
})

it('isSingleEnglishLetter: z', () => {
    expect(isSingleEnglishLetter('z')).toEqual(true);
})

it('isSingleEnglishLetter: 1', () => {
    expect(isSingleEnglishLetter('1')).toEqual(false);
})

it('isSingleEnglishLetter: AB', () => {
    expect(isSingleEnglishLetter('AB')).toEqual(false);
})

it('isSingleEnglishLetter: @', () => {
    expect(isSingleEnglishLetter('@')).toEqual(false);
})
