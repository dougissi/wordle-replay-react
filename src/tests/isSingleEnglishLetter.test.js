import { isSingleEnglishLetter } from "../utils";

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
