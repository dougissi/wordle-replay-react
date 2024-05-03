import { blankRow, blankGuessesGrid } from "../utils";

it('blankRow: default', () => {
    const expected = ["", "", "", "", ""];
    const actual = blankRow()
    expect(actual).toEqual(expected);
})

it('blankRow: -1', () => {
    const expected = [-1, -1, -1, -1, -1];
    const actual = blankRow(-1)
    expect(actual).toEqual(expected);
})

it('blankGuessesGrid', () => {
    const expected = [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""]
    ];
    const actual = blankGuessesGrid();
    expect(actual).toEqual(expected);
})
