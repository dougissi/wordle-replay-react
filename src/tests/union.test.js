import { union } from "../utils";

it("union: two arr", () => {
    const a = [1, 2, 3];
    const b = [2, 3, 4];
    const expected = new Set([1, 2, 3, 4]);
    const actual = union(a, b);
    expect(actual).toEqual(expected);
})

it("union: set then arr", () => {
    const a = new Set([1, 2, 3]);
    const b = [2, 3, 4];
    const expected = new Set([1, 2, 3, 4]);
    const actual = union(a, b);
    expect(actual).toEqual(expected);
})

it("union: arr then set", () => {
    const a = [1, 2, 3];
    const b = new Set([2, 3, 4]);
    const expected = new Set([1, 2, 3, 4]);
    const actual = union(a, b);
    expect(actual).toEqual(expected);
})

it("union: two sets", () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([2, 3, 4]);
    const expected = new Set([1, 2, 3, 4]);
    const actual = union(a, b);
    expect(actual).toEqual(expected);
})

it("union: first empty", () => {
    const a = [];
    const b = [2, 3, 3, 4];
    const expected = new Set([2, 3, 4]);
    const actual = union(a, b);
    expect(actual).toEqual(expected);
})

it("union: second empty", () => {
    const a = [1, 2, 3, 3];
    const b = []
    const expected = new Set([1, 2, 3]);
    const actual = union(a, b);
    expect(actual).toEqual(expected);
})

it("union: both empty", () => {
    const a = [];
    const b = [];
    const expected = new Set();
    const actual = union(a, b);
    expect(actual).toEqual(expected);
})
