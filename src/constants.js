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
    dark: {},
    light: {},
    colorBlindDark: {},
    colorBlindLight: {}
}
colorMap.dark[GREEN] =  '#538D4E';
colorMap.dark[YELLOW] = '#B59F3B';
colorMap.dark[GRAY] =   '#3A3A3C';
colorMap.light[GREEN] =  '#6AAA64';
colorMap.light[YELLOW] = '#FFC107';
colorMap.light[GRAY] =   '#787C7E';
colorMap.colorBlindDark[GREEN] =  '#F5793A';
colorMap.colorBlindDark[YELLOW] = '#85C0F9';
colorMap.colorBlindDark[GRAY] =   '#3A3A3C';
colorMap.colorBlindLight[GREEN] =  '#F5793A';
colorMap.colorBlindLight[YELLOW] = '#85C0F9';
colorMap.colorBlindLight[GRAY] =   '#787C7E';

export const colorToIcon = {};
colorToIcon[GREEN] = "🟩";  // "&#129001;"
colorToIcon[YELLOW] = "🟨";  // "&#129000;"
colorToIcon[GRAY] = "⬜";  // "&#11036;"

export const backspaceSymbol = "⬅";
export const earliestDate = "2021-06-19";