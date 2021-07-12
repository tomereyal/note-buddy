export const mathConfig = {
  operator: {
    division: {
      label: "Division",
      tex: String.raw`/`,
      keydownShortcut: "/", //ctrl "/"
      typingShortcuts: [".divide", "./"],
      regex: /^\//gm,
    },
    root: {
      label: "Root",
      tex: String.raw`\sqrt{\bigcirc}`,
      keydownShortcut: "s",
      typingShortcuts: [".root", ".square", ".s"],
    },
    multiplication: {
      label: "Multiplication",
      tex: String.raw`*`,
      keydownShortcut: "*",
      typingShortcuts: [".times", ".x"],
      regex: /^\*/gm,
    },
  },
  grouper: {
    parenthesis: {
      label: "Parenthesis",
      tex: String.raw`()`,
      keydownShortcut: "(", //ctrl
      typingShortcuts: [],
    },
    curlyBrackets: {
      label: "Curly Brackets",
      tex: String.raw`{}`,
      keydownShortcut: "{", //ctrl
      typingShortcuts: [],
      regex: /^\{.+/gm,
    },
    squareBrackets: {
      label: "Square Brackets",
      tex: String.raw`[]`,
      keydownShortcut: "[", //ctrl
      typingShortcuts: [],
      regex: /^\[.+/gm,
    },
    isClosedGroup,
  },
  greekLetter: [],
  expression: {
    fraction: {
      label: "Fraction",
      tex: String.raw`\frac{\bigcirc}{\bigcirc}`,
      regex: /^\\frac{.+}{.+}$/gm,
    },
  },
  functions: [],
};
const alpha = String.raw`\alpha`;
const sqrt = String.raw`\sqrt{\bigcirc}`;
const division = String.raw`\frac{\bigcirc}{\bigcirc}`;
//regex--

// export const regexCurlyBrackets = /\{(?:[^{}]|((?R)))+\}/gm;
// export const regexParenthesis = /\((?:[^()]|((?R)))+\)/gm;
// export const regexSquareBrackets = /\[(?:[^[\]]|((?R)))+\]/gm;

function isClosedGroup(openSym, closingSym, math) {
  if (typeof math !== "string") return;
  let openSymCounter = 0;
  let closingSymCounter = 0;

  for (let char of math) {
    if (char === openSym) {
      openSymCounter++;
    }
    if (char === closingSym) {
      closingSymCounter++;
    }
  }

  if (openSymCounter === closingSymCounter) {
    return true;
  }
  return false;
}

// function getNumerator(math){
//   let numerator =

// }
