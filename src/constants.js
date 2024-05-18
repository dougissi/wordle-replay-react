export const numLetters = 5;
export const initialNumGuessesToShow = 6;
export const emptyDistributionData = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    '7+': 0
}

export const GREEN = 'green';
export const YELLOW = 'yellow';
export const GRAY = 'gray';
export const NONE = 'none';

export const rankToColor = {
    '2': GREEN,
    '1': YELLOW,
    '0': GRAY,
    '-1': NONE
};

export const colorMap = {
    light: {
        standard: {},
        colorBlind: {}
    },
    dark: {
        standard: {},
        colorBlind: {}
    },
}
colorMap.light.standard[GREEN] =  '#6AAA64';
colorMap.light.standard[YELLOW] = '#FFC107';
colorMap.light.standard[GRAY] =   '#787C7E';
colorMap.dark.standard[GREEN] =  '#538D4E';
colorMap.dark.standard[YELLOW] = '#B59F3B';
colorMap.dark.standard[GRAY] =   '#3A3A3C';
colorMap.light.colorBlind[GREEN] =  '#F5793A';
colorMap.light.colorBlind[YELLOW] = '#85C0F9';
colorMap.light.colorBlind[GRAY] =   '#787C7E';
colorMap.dark.colorBlind[GREEN] =  '#F5793A';
colorMap.dark.colorBlind[YELLOW] = '#85C0F9';
colorMap.dark.colorBlind[GRAY] =   '#3A3A3C';

export const colorToIcon = {
    standard: {},
    colorBlind: {}
};
colorToIcon.standard[GREEN] =  "🟩";
colorToIcon.standard[YELLOW] = "🟨";
colorToIcon.standard[GRAY] =   "⬜";
colorToIcon.colorBlind[GREEN] =  "🟧";
colorToIcon.colorBlind[YELLOW] = "🟦";
colorToIcon.colorBlind[GRAY] =   "⬜";

export const backspaceSymbol = "⬅";
export const earliestDate = "2021-06-19";