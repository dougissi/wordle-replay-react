import { countDuplicateLetters, getFreqs, getTopSuggestions, getWordRanks } from "../utils";

// countDuplicateLetters

it('countDuplicateLetters: arose 0', () => {
    const word = 'arose';
    const expected = 0;
    const actual = countDuplicateLetters(word);
    expect(actual).toEqual(expected);
})

it('countDuplicateLetters: greed 1', () => {
    const word = 'greed';
    const expected = 1;
    const actual = countDuplicateLetters(word);
    expect(actual).toEqual(expected);
})

it('countDuplicateLetters: sassy 2', () => {
    const word = 'sassy';
    const expected = 2;
    const actual = countDuplicateLetters(word);
    expect(actual).toEqual(expected);
})

it('countDuplicateLetters: poop 2', () => {
    const word = 'poop';
    const expected = 2;
    const actual = countDuplicateLetters(word);
    expect(actual).toEqual(expected);
})


// getFreqsByIndex

it('getFreqsByIndex: basic', () => {
    const words = [
        'arose',
        'alive',
        'cheep'
    ]
    const expected = [
        // freqsByIndex
        [
            {'a': 2, 'c': 1},
            {'r': 1, 'l': 1, 'h': 1},
            {'o': 1, 'i': 1, 'e': 1},
            {'s': 1, 'v': 1, 'e': 1},
            {'e': 2, 'p': 1}
        ],
        // freqOverall
        {
            'a': 2,
            'c': 1,
            'e': 4,
            'h': 1,
            'i': 1,
            'l': 1,
            'o': 1,
            'r': 1,
            's': 1,
            'v': 1,
            'p': 1
        }
    ];
    const actual = getFreqs(words);
    expect(actual).toEqual(expected);
})


// getWordRanks

it('getWordRanks: basic', () => {
    const words = [
        'arose',
        'alive',
        'cheep'
    ]
    const freqs = [
        // freqsByIndex
        [
            {'a': 2, 'c': 1},
            {'r': 1, 'l': 1, 'h': 1},
            {'o': 1, 'i': 1, 'e': 1},
            {'s': 1, 'v': 1, 'e': 1},
            {'e': 2, 'p': 1}
        ],
        // freqOverall
        {
            'a': 2,
            'c': 1,
            'e': 4,
            'h': 1,
            'i': 1,
            'l': 1,
            'o': 1,
            'r': 1,
            's': 1,
            'v': 1,
            'p': 1
        }
    ];
    const expected = [
        {
            word: 'arose',
            dups: 0,
            rankByIndex: 2+1+1+1+2,
            rankByOverall: 2+1+1+1+4
        },
        {
            word: 'alive',
            dups: 0,
            rankByIndex: 2+1+1+1+2,
            rankByOverall: 2+1+1+1+4
        },
        {
            word: 'cheep',
            dups: 1,
            rankByIndex: 1+1+1+1+1,
            rankByOverall: 1+1+4+4+1  // TODO: double count 'e'?
        }
    ];
    const actual = getWordRanks(words, freqs);
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

it('getTopSuggestions: fewer dups first, more Rs so arose wins', () => {
    const words = [
        "eeree",
        "eeere",
        "arose",
        "alive",
    ]
    const n = 4;
    const expected = [
        "arose",
        "alive",
        "eeere",
        "eeree",
    ]
    const actual = getTopSuggestions(words, n);
    expect(actual).toEqual(expected);
})

it('getTopSuggestions: fewer dups first, more Ls so alive wins', () => {
    const words = [
        "eelee",
        "eeele",
        "arose",
        "alive",
    ]
    const n = 4;
    const expected = [
        "alive",
        "arose",
        "eeele",
        "eelee",
    ]
    const actual = getTopSuggestions(words, n);
    expect(actual).toEqual(expected);
})

it('getTopSuggestions: fewer dups first, tie so alive < arose and eecee < eeece', () => {
    const words = [
        "eecee",
        "eeece",
        "arose",
        "alive",
    ]
    const n = 4;
    const expected = [
        "alive",
        "arose",
        "eecee",
        "eeece",
    ]
    const actual = getTopSuggestions(words, n);
    expect(actual).toEqual(expected);
})
