export const mathConfig = {
  operators: [
    {
      label: "Fraction",
      tex: String.raw`\frac{\bigcirc}{\bigcirc}`,
      keydownShortcut: "/", //ctrl "/"
      typingShortcuts: [".divide", "./"],
    },
    {
      label: "Root",
      tex: String.raw`\sqrt{\bigcirc}`,
      keydownShortcut: "s",
      typingShortcuts: [".root", ".square", ".s"],
    },
  ],
  greekLetters: [],
  expressions: [],
  functions: [],
};
const alpha = String.raw`\alpha`;
const sqrt = String.raw`\sqrt{\bigcirc}`;
