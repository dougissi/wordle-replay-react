import { getFreqOverall, getFreqsByIndex, getTopSuggestions, getWordRanks } from "../utils";


// getFreqsByIndex

it('getFreqsByIndex: basic', () => {
    const words = [
        'arose',
        'alive',
        'cheat'
    ]
    const expected = [
        {'a': 2, 'c': 1},
        {'r': 1, 'l': 1, 'h': 1},
        {'o': 1, 'i': 1, 'e': 1},
        {'s': 1, 'v': 1, 'a': 1},
        {'e': 2, 't': 1}
    ];
    const actual = getFreqsByIndex(words);
    expect(actual).toEqual(expected);
})


// getFreqOverall

it('getFreqOverall: basic', () => {
    const freqsByIndex = [
        {'a': 2, 'c': 1},
        {'r': 1, 'l': 1, 'h': 1},
        {'o': 1, 'i': 1, 'e': 1},
        {'s': 1, 'v': 1, 'a': 1},
        {'e': 2, 't': 1}
    ];
    const expected = {
        'a': 3, 
        'c': 1,
        'e': 3,
        'h': 1,
        'i': 1,
        'l': 1,
        'o': 1,
        'r': 1,
        's': 1,
        'v': 1,
        't': 1
    };
    const actual = getFreqOverall(freqsByIndex);
    expect(actual).toEqual(expected);
})


// getWordRanks

it('getWordRanks: basic', () => {
    const words = [
        'arose',
        'alive',
        'cheat'
    ]
    const freqsByIndex = [
        {'a': 2, 'c': 1},
        {'r': 1, 'l': 1, 'h': 1},
        {'o': 1, 'i': 1, 'e': 1},
        {'s': 1, 'v': 1, 'a': 1},
        {'e': 2, 't': 1}
    ];
    const expected = [
        [2+1+1+1+2, 'arose'],
        [2+1+1+1+2, 'alive'],
        [1+1+1+1+1, 'cheat']
    ];
    const actual = getWordRanks(words, freqsByIndex);
    expect(actual).toEqual(expected);
})


// getTopSuggestions

it('getTopSuggestions: top 2', () => {
    const words = [
        'cheat',
        'arose',
        'alive'
    ];
    const n = 2;
    const expected = ['alive', 'arose'];
    const actual = getTopSuggestions(words, n);
    expect(actual).toEqual(expected);
})

it('getTopSuggestions: top 1', () => {
    const words = [
        'cheat',
        'arose',
        'alive'
    ];
    const n = 1;
    const expected = ['alive'];
    const actual = getTopSuggestions(words, n);
    expect(actual).toEqual(expected);
})

it('getTopSuggestions: top 0', () => {
    const words = [
        'cheat',
        'arose',
        'alive'
    ];
    const n = 0;
    const expected = [];
    const actual = getTopSuggestions(words, n);
    expect(actual).toEqual(expected);
})

it('getTopSuggestions: top 4 (but only 3)', () => {
    const words = [
        'cheat',
        'arose',
        'alive'
    ];
    const n = 4;
    const expected = [
        'alive',
        'arose',
        'cheat'
    ];
    const actual = getTopSuggestions(words, n);
    expect(actual).toEqual(expected);
})