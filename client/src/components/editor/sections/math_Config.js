export const mathConfig = {
  operator: {
    division: {
      label: "Division",
      tex: String.raw`\frac{\bigcirc}{\bigcirc}`,
      keydownShortcut: "/", //ctrl "/"
      typingShortcuts: [".divide", "./"],
    },
    root: {
      label: "Root",
      tex: String.raw`\sqrt{\bigcirc}`,
      keydownShortcut: "s",
      typingShortcuts: [".root", ".square", ".s"],
    },
  },
  greekLetters: [],
  expressions: [],
  functions: [],
};
const alpha = String.raw`\alpha`;
const sqrt = String.raw`\sqrt{\bigcirc}`;
