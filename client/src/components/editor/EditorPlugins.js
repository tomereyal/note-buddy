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
import imageExtensions from "image-extensions";
import isUrl from "is-url";

export const EditorPlugins = {
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
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.bold === true,
      universal: true,
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
        EditorPlugins.insertData(data);
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
