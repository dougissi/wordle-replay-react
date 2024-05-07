import { generateDateArray } from "../utils";

it('generateDateArray: 5 days', () => {
    const startDate = '2024-05-01';
    const endDate = '2024-05-05';
    const actual = generateDateArray(startDate, endDate);
    const expected = [
        '2024-05-01',
        '2024-05-02',
        '2024-05-03',
        '2024-05-04',
        '2024-05-05'
    ];
    expect(actual).toEqual(expected);
})

it('generateDateArray: 1 day', () => {
    const startDate = '2024-05-01';
    const endDate = '2024-05-01';
    const actual = generateDateArray(startDate, endDate);
    const expected = [
        '2024-05-01'
    ];
    expect(actual).toEqual(expected);
})

it('generateDateArray: start > end', () => {
    const startDate = '2024-05-03';
    const endDate = '2024-05-01';
    expect(() => generateDateArray(startDate, endDate)).toThrow("start date greater than end date");
})