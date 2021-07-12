//A plugin is simply a function that takes an Editor object and
//returns it after it has augmented it in some way.

import {
  Editor,
  Text,
  Transforms,
  Range,
  Node,
  Path,
  Point,
  Element as SlateElement,
} from "slate";
import { ReactEditor } from "slate-react";
import imageExtensions from "image-extensions";
import isUrl from "is-url";
import { mathConfig } from "./sections/math_Config";
const { stringify } = require("flatted/cjs");

const LIST_TYPES = ["numbered-list", "bulleted-list"];

export const EditorPlugins = {
  withCardData(editor, cardData) {
    if (!cardData) return editor;
    editor.cardData = cardData;
    return editor;
  },

  withTitledCardLayout(editor) {
    const { normalizeNode, cardData } = editor;

    editor.normalizeNode = ([node, path]) => {
      if (path.length === 0) {
        if (editor.children.length < 1) {
          const title = {
            type: "card-header",
            children: [{ text: "" }],
          };
          Transforms.insertNodes(editor, title, { at: path.concat(0) });
        }

        if (editor.children.length < 2) {
          const paragraph = {
            type: "paragraph",
            children: [{ text: "" }],
          };
          Transforms.insertNodes(editor, paragraph, { at: path.concat(1) });
        }

        for (const [child, childPath] of Node.children(editor, path)) {
          const type = childPath[0] === 0 ? "card-header" : "paragraph";
          if (SlateElement.isElement(child) && child.type !== type) {
            const newProperties = { type };
            Transforms.setNodes(editor, newProperties, { at: childPath });
          }
        }
      }
      return normalizeNode([node, path]);
    };

    return editor;
  },
  withCardHeader(editor) {
    const { isInline, isVoid } = editor;
    editor.isVoid = (element) => {
      return element.type === "card-header" ? true : isVoid(element);
    };

    return editor;
  },

  toggleFormat(editor, format) {
    const isActive = EditorPlugins.isFormatActive(editor, format);
    Transforms.setNodes(
      editor,
      { [format]: isActive ? null : true },
      { match: Text.isText, split: true }
    );
  },
  isFormatActive(editor, format) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n[format] === true,
      mode: "all",
    });
    return !!match;
  },
  paintBlock(editor, backgroundColor) {
    console.log(`paintBlock`, backgroundColor);
    const newProperties = {
      backgroundColor: EditorPlugins.isBlockPainted(editor, backgroundColor)
        ? "white"
        : backgroundColor,
    };
    // const newProperties = { backgroundColor: backgroundColor };
    console.log(`editor`, editor);
    console.log(`newProperties`, newProperties);
    Transforms.setNodes(editor, newProperties);
  },
  isBlockPainted(editor, backgroundColor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => {
        return (
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.backgroundColor === backgroundColor
        );
      },
    });

    return !!match;
  },

  saveMathToElement(editor, math, options) {
    const { selection } = editor;
    console.log(`Saving this mathBlock :`, math);
    if (selection && Range.isCollapsed(selection)) {
      console.log(`I found  match her ein editorPLugins!`);
      Transforms.setNodes(
        editor,
        { math: math },
        {
          match: (n, path) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === "math-block",
        }
      );
      if (options && options.exitOnSave) {
        ReactEditor.focus(editor);
        Transforms.move(editor);
      }
    }
  },

  toggleBlock(editor, format) {
    const isActive = EditorPlugins.isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        LIST_TYPES.includes(
          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
        ),
      split: true,
    });
    const newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  },
  isBlockActive(editor, format) {
    const [match] = Editor.nodes(editor, {
      match: (n) => {
        return (
          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
        );
      },
    });

    return !!match;
  },
  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === "code",
    });

    return !!match;
  },

  // Comment below: #Schema-specific instance methods to override
  withImages(editor) {
    const { insertData, isVoid } = editor;

    editor.isVoid = (element) => {
      return element.type === "image" ? true : isVoid(element);
    };

    editor.insertData = (data) => {
      const text = data.getData("text/plain");
      const { files } = data;

      if (files && files.length > 0) {
        for (const file of files) {
          const reader = new FileReader();
          const [mime] = file.type.split("/");

          if (mime === "image") {
            reader.addEventListener("load", () => {
              const url = reader.result;
              EditorPlugins.insertImage(editor, url);
            });

            reader.readAsDataURL(file);
          }
        }
      } else if (EditorPlugins.isImageUrl(text)) {
        EditorPlugins.insertImage(editor, text);
      } else {
        insertData(data);
      }
    };

    return editor;
  },
  isImageUrl(url) {
    if (!url) return false;
    if (!isUrl(url)) return false;
    const ext = new URL(url).pathname.split(".").pop();
    return imageExtensions.includes(ext);
  },
  insertImage(editor, url) {
    const text = { text: "" };
    const image = { type: "image", url, children: [text] };
    Transforms.insertNodes(editor, image);
    Transforms.move(editor);
  },
  getPreviousMathElement(editor) {
    const { selection } = editor;
    if (!(selection && Range.isCollapsed(selection))) {
      return;
    }
    const nodeBefore = Editor.previous(editor, selection.anchor.path);

    const previousElement = nodeBefore ? nodeBefore[0] : null;
    return previousElement && previousElement.math
      ? { ...previousElement, path: nodeBefore[1] }
      : null;
  },

  insertMathOperator(editor, previousMath, math, operatorType) {
    //saves mathParent before it and inserts operator tex
    console.log(`math`, math);
    const { selection } = editor;
    const { root } = mathConfig.operator;
    if (!(selection && Range.isCollapsed(selection))) {
      return;
    }

    let mathParent = previousMath;
    let mathOutput = String.raw`${math}`;
    if (math === root.tex && mathParent) {
      Editor.deleteBackward(editor);
      mathOutput = String.raw`\sqrt[${mathParent}]{\bigcirc}`;
    }

    const text = { text: "" };
    const mathBlock = {
      type: "math-block",
      math: mathOutput,
      operator: operatorType,
      mathParent, //by defualt will be itself
      children: [text],
    };

    Transforms.insertNodes(editor, mathBlock);
    Transforms.move(editor);
  },

  insertMathExpression(editor, deleteIndex, math, mathType) {
    const { selection } = editor;
    const text = { text: "" };
    console.log(`math insertMathexpression wants to inject`, math);
    const mathBlock = {
      type: "math-block",
      math: math,
      mathType,
      children: [text],
    };
    while (deleteIndex > 0) {
      Editor.deleteBackward(editor);
      deleteIndex--;
    }

    Editor.insertNode(editor, mathBlock);
    Transforms.move(editor);
  },
  editMathBlock(editor, deleteCount, operatorElement, math) {
    if (!operatorElement) {
      alert("no operator element found");
    }

    const { division } = mathConfig.operator;
    const { fraction } = mathConfig.expression;
    const { operator, mathParent } = operatorElement;

    if (operator) {
      console.log(`mathParent of operator`, mathParent);
      switch (operator) {
        case division.label:
          const numerator = mathParent;
          const denominator = math;
          const mathExpression = String.raw`\frac{${numerator}}{${denominator}}`;
          console.log(`mathExpression from editMathBlock`, mathExpression);
          EditorPlugins.insertMathExpression(
            editor,
            deleteCount,
            mathExpression,
            fraction.label
          );
          break;

        default:
          break;
      }
    }
  },
  insertMathChar(editor, previousMath, math) {
    const { selection } = editor;
    if (!(selection && Range.isCollapsed(selection))) {
      return;
    }
    let mathOutput = math;
    let currentOperator, mathParent, numerator, denominator;
    const { operator } = mathConfig;

    //check if user current string starts with an operator"/","+","sqrt" or an "{" save previous

    if (previousMath) {
      mathOutput = previousMath + ` ` + math;
      Editor.deleteBackward(editor);
    }

    const text = { text: "" };

    const mathBlock = {
      type: "math-block",
      math: mathOutput,
      mathParent, //by defualt will be itself
      numerator,
      denominator,
      children: [text],
    };

    Transforms.insertNodes(editor, mathBlock);
    Transforms.move(editor);
  },
  insertFractionMathBlock(editor, previousMath, math, numerator, denominator) {
    const { selection } = editor;
    if (!(selection && Range.isCollapsed(selection))) {
      return;
    }
    const text = { text: "" };

    const mathBlock = {
      type: "fraction-math-block",
      math: math,
      numerator,
      denominator,
      children: [text],
    };
    Editor.deleteBackward(editor);
    Transforms.insertNodes(editor, mathBlock);
    Transforms.move(editor);
  },

  insertMathBlock(editor) {
    const text = { text: "" };

    const mathBlock = {
      type: "math-block",
      math: "",
      children: [text],
    };

    Transforms.insertNodes(editor, mathBlock);
  },

  withMentions(editor) {
    const { isInline, isVoid } = editor;

    editor.isInline = (element) => {
      return element.type === "mention" ? true : isInline(element);
    };

    editor.isVoid = (element) => {
      return element.type === "mention" ? true : isVoid(element);
    };

    return editor;
  },
  withMathBlock(editor) {
    const { isInline, isVoid } = editor;

    editor.isInline = (element) => {
      return element.type === "math-block" ? true : isInline(element);
    };

    editor.isVoid = (element) => {
      return element.type === "math-block" ? true : isVoid(element);
    };

    return editor;
  },

  withFractionMathBlock(editor) {
    const { isInline, isVoid } = editor;

    editor.isInline = (element) => {
      return element.type === "fraction-math-block" ? true : isInline(element);
    };

    editor.isVoid = (element) => {
      return element.type === "fraction-math-block" ? true : isVoid(element);
    };

    return editor;
  },
  getNodes(editor, nodeType) {
    if (!editor || !nodeType || !(typeof nodeType == "string")) {
      return;
    }
    let root = editor.children;
    let nodeArr = [];
    findNodes(root, nodeType);

    function findNodes(root, nodeType) {
      root.forEach((child) => {
        if (child.type) {
          if (child.type == nodeType) {
            nodeArr.push(child);
          }
        }
        if (child.children) {
          return findNodes(child.children, nodeType);
        }
      });
    }
    return nodeArr;
  },
  insertMention(editor, character, image) {
    const mention = {
      type: "mention",
      character,
      image,
      children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
  },
  insertSteps(editor) {
    const text = { text: "" };
    const steps = {
      type: "steps",
      children: [{ type: "step", children: [{ text: "Step _" }] }],
    };
    Transforms.insertNodes(editor, steps);
  },
  toggleCodeBlock(editor) {
    const isActive = EditorPlugins.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : "code" },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },
  withSteps(editor) {
    const { deleteBackward } = editor;

    editor.deleteBackward = (...args) => {
      const { selection } = editor;

      if (selection && Range.isCollapsed(selection)) {
        const [match] = Editor.nodes(editor, {
          match: (n, path) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === "step",
        });

        if (match) {
          const [node, path] = match;
          const start = Editor.start(editor, path);
          const after = Editor.after(editor, path);

          if (Point.equals(selection.anchor, start)) {
            const newProperties = {
              type: "paragraph",
              children: [{ text: "" }],
            };

            //We will change the node to a paragraph and the lift it up out of the steps div
            Transforms.setNodes(editor, newProperties, {
              at: path,
              match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === "step",
            });
            // we might try Transforms.unwrapNodes(editor: Editor, options?) method...?
            Transforms.liftNodes(editor, {
              at: path,
              match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === "paragraph",
            });
            return;
          }
        }
      }

      deleteBackward(...args);
    };

    return editor;
  },

  // Comment below: #Schema-specific instance methods to override
  withEditableVoids(editor) {
    const { isVoid } = editor;

    editor.isVoid = (element) => {
      return element.type === "editable-void" ? true : isVoid(element);
    };

    return editor;
  },
  insertEditableVoid(editor) {
    const text = { text: "" };
    const voidNode = {
      type: "editable-void",
      children: [text],
    };
    const newProperties = {
      type: "paragraph",
      children: [{ text: "space" }],
    };

    Transforms.insertNodes(editor, [voidNode, newProperties]);
  },

  withSelector(editor) {
    const { isVoid } = editor;

    editor.isVoid = (element) => {
      return element.type === "selector" ? true : isVoid(element);
    };

    return editor;
  },
  insertSelector(editor, tags) {
    const text = { text: "" };
    const voidNode = {
      type: "selector",
      tags: tags,
      children: [text],
    };
    const newProperties = {
      type: "paragraph",
      children: [{ text: "space" }],
    };

    Transforms.insertNodes(editor, [voidNode, newProperties]);
  },
};

//___Comment #Schema-specific instance methods to override
// Schema-specific instance methods to override
// Replace these methods to modify the original behavior of the editor when building Plugins.
// When modifying behavior, call the original method when appropriate. For example, a plugin
// that marks image nodes as "void":
