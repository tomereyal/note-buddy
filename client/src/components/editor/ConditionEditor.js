//---------REACT-AND-HOOKS-IMPORTS----------------------//
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";

//---------SLATE-EDITOR-IMPORTS----------------------//
import { createEditor, Editor, Transforms, Range } from "slate";
// Import the Slate components and React plugin.
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
//Import the actual editor and its methods..
import { withHistory } from "slate-history";
import { EditorPlugins } from "./EditorPlugins";
//---------MY-COMPONENTS-IMPORTS------------------------//
import EditorHoverToolbar, {
  Portal,
} from "./sections/EditorToolBar/EditorHoverToolbar";

//------MY-SLATE-ELEMENTS-------------------------//
import {
  DefaultElement,
  Leaf,
  Mention,
  MathBlock,
} from "./sections/EditorElements";
//-----------------------------------------------------//

export default function ConditionEditor(props) {
  const { condition, order, bgc } = props;

  const defaultBgc = "#FFF295";
  let initContent =
    condition && condition.content && condition.content.length > 0
      ? condition.content
      : [
          {
            type: "paragraph",
            backgroundColor: defaultBgc,
            children: [{ text: "" }],
          },
        ];

  const { withMentions, withMathBlock } = EditorPlugins;
  const ref = useRef();

  const [value, setValue] = useState(initContent);
  const [userTags, setUserTags] = useState();
  const [fetchedIcons, setFetchedIcons] = useState([]);
  const [target, setTarget] = useState();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");

  const editor = useMemo(
    () => withMathBlock(withMentions(withHistory(withReact(createEditor())))),
    []
  );

  const chars =
    userTags && userTags.length > 0
      ? userTags
          .filter((tag) =>
            tag.name.toLowerCase().startsWith(search.toLowerCase())
          )
          .slice(0, 10)
      : [];

  useEffect(() => {
    if (target && chars.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el.style.left = `${rect.left + window.pageXOffset}px`;
    }

    //removing props dependency made component NOT rerender 6 time on every saveNote
    //removing previous math dependency made component Not rerender on every delete
  }, [chars.length, editor, index, search, target]);

  const renderElement = useCallback((props) => {
    const { children, attributes, element } = props;
    switch (element.type) {
      case "mention":
        return <Mention {...props} />;
      case "math-block":
        return <MathBlock {...props} />;
      default:
        return <DefaultConditionElement {...props} />;
    }
  }, []);
  const DefaultConditionElement = ({ attributes, children, element }) => {
    const bcg = element.backgroundColor ? element.backgroundColor : defaultBgc;

    return (
      <span
        {...attributes}
        style={{
          backgroundColor: bcg,
          margin: 0,
          padding: "0 16px",
          fontSize: "1rem",
        }}
      >
        {children}
      </span>
    );
  };
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  /////////////EVENTS/////////////////

  const onKeyDown = useCallback(
    (event) => {
      if (target) {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case "ArrowUp":
            event.preventDefault();
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case "Tab":
          case "Enter":
            event.preventDefault();
            Transforms.select(editor, target);

            if (!chars[index]) {
              //if the tag doesnt exist..

              const randomIcon =
                fetchedIcons.length > 0
                  ? fetchedIcons[
                      Math.floor(Math.random() * fetchedIcons.length)
                    ].svg
                  : "";
              EditorPlugins.insertMention(editor, search, randomIcon);
              //saveNonExisitingTagToNote()
              // saveNewTags(randomIcon);
            } else {
              EditorPlugins.insertMention(
                editor,
                chars[index].name,
                chars[index].image
              );
            }

            setTarget(null);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(null);
            break;
        }
      }
      if (event.key === "`") {
        event.preventDefault();
        EditorPlugins.insertMathBlock(editor);
      }

      if (event.ctrlKey) {
        switch (event.key) {
          case "`": {
            event.preventDefault();
            EditorPlugins.toggleCodeBlock(editor);
            break;
          }

          case "b": {
            event.preventDefault();
            EditorPlugins.toggleFormat(editor, "bold");
            break;
          }
          case "i": {
            event.preventDefault();
            EditorPlugins.toggleFormat(editor, "italic");
            break;
          }
          case "u": {
            event.preventDefault();
            EditorPlugins.toggleFormat(editor, "underlined");
            break;
          }
        }
      }
    },
    [index, search, target]
  );

  ///////////////////////

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={async (value) => {
        setValue(value);
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const wordBefore = Editor.before(editor, start, { unit: "word" });
          const before = wordBefore && Editor.before(editor, wordBefore);
          const beforeRange = before && Editor.range(editor, before, start);
          const beforeText = beforeRange && Editor.string(editor, beforeRange);
          const beforeMatch =
            beforeText &&
            beforeText.match(/^@([a-zA-Z0-9_*\u0590-\u05fe\u200f\u200e]+)$/);
          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);
          if (beforeMatch && afterMatch) {
            setTarget(beforeRange);
            setSearch(beforeMatch[1]);
            setIndex(0);

            return;
          }
        }

        setTarget(null);
      }}
    >
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        readOnly={props.isReadOnly}
        placeholder="Note..."
        spellCheck
        onDOMBeforeInput={(event) => {
          //Make sure you place the event.preventDefault() inside each case,
          //Else you will disable editing of the note.
          switch (event.inputType) {
            case "formatBold":
              event.preventDefault();
              return EditorPlugins.toggleFormat(editor, "bold");
            case "formatItalic":
              event.preventDefault();
              return EditorPlugins.toggleFormat(editor, "italic");
            case "formatUnderline":
              event.preventDefault();
              return EditorPlugins.toggleFormat(editor, "underlined");
          }
        }}
        onKeyDown={onKeyDown}
      />{" "}
      {target && (
        <Portal>
          <div
            ref={ref}
            style={{
              top: "-9999px",
              left: "-9999px",
              position: "absolute",
              zIndex: 1,
              padding: "3px",
              background: "white",
              borderRadius: "4px",
              boxShadow: "0 1px 5px rgba(0,0,0,.2)",
            }}
          >
            {chars.length > 0 ? (
              chars.map((tag, i) => (
                <div
                  key={tag.name}
                  onClick={() => {
                    console.log(`tag.name`, tag.name);
                  }}
                  style={{
                    padding: "1px 3px",
                    borderRadius: "3px",
                    background: i === index ? "#B4D5FF" : "transparent",
                  }}
                >
                  {tag.name}
                  {/* <Button>{tag.name}</Button> */}
                </div>
              ))
            ) : (
              <div
                key={search}
                style={{
                  padding: "1px 3px",
                  borderRadius: "3px",
                  background: 0 === index ? "#B4D5FF" : "transparent",
                }}
              >
                {search}
              </div>
            )}
          </div>
        </Portal>
      )}
    </Slate>
  );
}
