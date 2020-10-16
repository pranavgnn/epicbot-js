const chars = {
    "a": "", "A": "",
    "b": "", "B": "",
    "c": "", "C": "",
    "d": "", "D": "",
    "e": "", "E": "",
    "f": "", "F": "",
    "g": "", "G": "",
    "h": "", "H": "",
    "i": "", "I": "",
    "j": "", "J": "",
    "k": "", "K": "",
    "l": "", "L": "",
    "m": "", "M": "",
    "n": "", "N": "",
    "o": "", "O": "",
    "p": "", "P": "",
    "q": "", "Q": "",
    "r": "", "R": "",
    "s": "", "S": "",
    "t": "", "T": "",
    "u": "", "U": "",
    "v": "", "V": "",
    "w": "", "W": "",
    "x": "", "X": "",
    "y": "", "Y": "",
    "z": "", "Z": "",

    "0": "",
    "1": "",
    "2": "",
    "3": "",
    "4": "",
    "5": "",
    "6": "",
    "7": "",
    "8": "",
    "9": "",
};

module.exports.test = character => {
    if (character.length === 0) return;
    else if (character.length === 1) {
        if (chars[character]) return chars[character];
    } else {
        var sentence = ``;
        var letters = character.split(``);
        for (let letter of letters) {
            sentence = sentence + (chars[letter] || `_`);
        };
        return sentence;
    };
};

console.log(this.test(`OwO`));