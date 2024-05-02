import { letterToNumber } from "../utils";

it('letterToNumber: A to 0', () => {
    expect(letterToNumber('A')).toEqual(0);
})

it('letterToNumber: Z to 25', () => {
    expect(letterToNumber('Z')).toEqual(25);
})

it('letterToNumber: E to 4', () => {
    expect(letterToNumber('E')).toEqual(4);
})

it('letterToNumber: "a" not capital', () => {
    expect(() => letterToNumber('a')).toThrow(Error);
})

it('letterToNumber: "3" invalid', () => {
    expect(() => letterToNumber('3')).toThrow(Error);
})
