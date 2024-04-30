const backspaceSymbol = "⬅";

function getDateToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function isSingleEnglishLetter(text) {
    // Regular expression to match a single English letter
    const regex = /^[a-zA-Z]$/;
  
    // Check if the text is exactly one character long and matches the regular expression
    return text.length === 1 && regex.test(text);

    // // Example usage:
    // console.log(isSingleEnglishLetter('A')); // true
    // console.log(isSingleEnglishLetter('a')); // true
    // console.log(isSingleEnglishLetter('Z')); // true
    // console.log(isSingleEnglishLetter('z')); // true
    // console.log(isSingleEnglishLetter('1')); // false
    // console.log(isSingleEnglishLetter('AB')); // false
    // console.log(isSingleEnglishLetter('@')); // false
}
  


export {
    backspaceSymbol,
    getDateToday,
    isSingleEnglishLetter
}