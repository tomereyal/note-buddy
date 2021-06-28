//---------REACT-AND-HOOKS-IMPORTS----------------------//
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
//---------SLATE-EDITOR-IMPORTS----------------------//

import { createEditor, Editor, Transforms, Range, Descendant } from "slate";
// Import the Slate components and React plugin.
import {
  Slate,
  Editable,
  useSlateStatic,
  useSelected,
  useFocused,
  withReact,
  ReactEditor,
} from "slate-react";
//Import the actual editor and its methods..
import { withHistory } from "slate-history";
import { EditorPlugins } from "./EditorPlugins";
//----------STYLE-IMPORTS-------------------------------//
import { css } from "@emotion/css";

//---------ANTD-COMPONENTS-IMPORTS----------------------//
import { DownCircleOutlined } from "@ant-design/icons";
//---------MY-COMPONENTS-IMPORTS------------------------//
import EditorToolbar, { Portal } from "./sections/EditorToolbar";
import NoteMentions from "./sections/NoteMentions";
import EditorSelector from "./sections/EditorSelector";
import EditorTag from "./sections/EditorTag";
//--------SERVER-RELATED-IMPORTS-----------------------//
import axios from "axios";
import { editNote, saveNoteTags } from "../../_actions/card_actions";
import { getCards } from "../../api/index";
//------THIRD-PARTY-COMPONENTS-------------------------//

import { Modal } from "antd";
//-----------------------------------------------------//

export default function SlateEditor(props) {
  const { card, listId, sectionId, postId, order } = props;
  console.log(`card from slate props`, card);
  let initContent =
    card.content && card.content.length > 0
      ? card.content
      : [
          {
            type: "paragraph",
            children: [{ text: "A line of text in a paragraph." }],
          },
        ];

  const { withMentions, withImages, withSteps, withEditableVoids, getNodes } =
    EditorPlugins;
  const ref = useRef();
  const [value, setValue] = useState(initContent);
  const writersTags = useSelector((state) => card.tags);
  const [userTags, setUserTags] = useState();
  const [target, setTarget] = useState();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const editor = useMemo(
    () =>
      withEditableVoids(
        withMentions(
          withSteps(withImages(withHistory(withReact(createEditor()))))
        )
      ),
    []
  );

  const chars =
    userTags && userTags.length > 0
      ? userTags
          .filter((tag) => tag.toLowerCase().startsWith(search.toLowerCase()))
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
  }, [chars.length, editor, index, search, target, props]);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "image":
        return <Image {...props} />;
      case "code":
        return <CodeElement {...props} />;
      case "steps":
        return <StepsList {...props} />;
      case "step":
        return <StepNode {...props} />;
      case "editable-void":
        return <EditableVoid {...props} />;
      case "selector":
        return <SelectorVoid {...props} />;
      case "mention":
        return <Mention {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // Define a leaf rendering function that is memoized with `useCallback`.
  // For every format you add, Slate will break up the text content into "leaves",
  // and you need to tell Slate how to read it, just like for elements.
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const onKeyDown = useCallback(
    (event) => {
      console.log(`search`, search);
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
              EditorPlugins.insertMention(editor, search);

              //saveNonExisitingTagToNote()
              setTimeout(function () {
                saveTags();
              }, 2000);
            } else {
              const mentionArr = getNodes(editor, "mention");
              const cardHasTag =
                mentionArr.findIndex(
                  (mention) => mention.character == chars[index]
                ) == -1
                  ? false
                  : true;
              console.log(`cardHasTag`, cardHasTag);
              if (chars[index] && !cardHasTag) {
                EditorPlugins.insertMention(editor, chars[index]);

                //saveExisitingTagToNote()
                //for example if a card in another blog has this tag
                //find the tag and copy the tag info to this card
              } else if (chars[index] && cardHasTag) {
                EditorPlugins.insertMention(editor, chars[index]);
              }
            }

            setTarget(null);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(null);
            break;
        }
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
          case "s": {
            event.preventDefault();
            EditorPlugins.insertSteps(editor);
          }
          case "1": {
            event.preventDefault();
            EditorPlugins.insertEditableVoid(editor);
          }
          case "2": {
            event.preventDefault();
            EditorPlugins.insertSelector(editor);
          }
        }
      }
    },
    [index, search, target]
  );

  const saveTags = () => {
    const currentTags = getNodes(editor, "mention").map((tag) => tag.character);

    const filteredTags = currentTags.reduce((prev, tag) => {
      if (!prev.includes(tag)) {
        return prev.concat(tag);
      }
      return;
    }, []);

    const variables = {
      cardId: card._id,
      tags: filteredTags,
    };

    dispatch(saveNoteTags(variables));
  };

  const saveNote = () => {
    if (!value) return;
    console.log(`card`, card);
    console.log(`value`, value);
    const variables = {
      postId: postId,
      sectionId: sectionId,
      listId: listId,
      cardId: card._id,
      editArr: [{ editType: "content", editValue: value }],
    };
    dispatch(editNote(variables));
  };

  async function getCardTagNamesFromServer() {
    const { data } = await getCards();
    const cards = data.cards;

    const allTags = cards.reduce((prev, card) => {
      const tagNames = card.tags
        .map((tag) => tag.name)
        .filter((tagname) => !prev.includes(tagname));
      return prev.concat(tagNames);
    }, []);

    setUserTags(allTags);
    return;
  }

  return (
    <Slate
      editor={editor}
      value={value}
      // tags={tags}
      // onTagChange={setTags}
      onChange={async (value) => {
        setValue(value);
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const wordBefore = Editor.before(editor, start, { unit: "word" });
          const before = wordBefore && Editor.before(editor, wordBefore);
          const beforeRange = before && Editor.range(editor, before, start);
          const beforeText = beforeRange && Editor.string(editor, beforeRange);
          const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);

          if (beforeMatch && afterMatch) {
            setTarget(beforeRange);
            setSearch(beforeMatch[1]);
            setIndex(0);
            getCardTagNamesFromServer();
            return;
          }
        }

        setTarget(null);
      }}
    >
      <EditorToolbar></EditorToolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some text..."
        onBlur={(e) => saveNote()}
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
              chars.map((char, i) => (
                <div
                  key={char}
                  style={{
                    padding: "1px 3px",
                    borderRadius: "3px",
                    background: i === index ? "#B4D5FF" : "transparent",
                  }}
                >
                  {char}
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

// Define a React component to render leaves with bold text.
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underlined) {
    children = <u>{children}</u>;
  }
  return <span {...attributes}>{children}</span>;
};

//MY ELEMENTS --------------
const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const Image = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div {...attributes}>
      <div contentEditable={false} style={{ width: "200px" }}>
        <img
          src={element.url}
          className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? "0 0 0 3px #B4D5FF" : "none"};
          `}
          onClick={showModal}
        />
        <Modal
          title="Basic Modal"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Some contents...</p>
          <img
            src={element.url}
            className={css`
              display: block;
              max-width: 100%;
              max-height: 20em;
              box-shadow: ${selected && focused ? "0 0 0 3px #B4D5FF" : "none"};
            `}
          />
        </Modal>
      </div>
      {children}
    </div>
  );
};

const StepsList = ({ attributes, children, element }) => {
  const editor = useSlateStatic();
  return (
    <div
      {...attributes}
      onClick={console.log(element)}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
};

const StepNode = ({ attributes, children, element }) => {
  return (
    <div
      {...attributes}
      className={css`
        background-color: "whitesmoke";
        min-width: 30px;
        min-height: 30px;
        margin: auto 5px;
        border: solid 1px lightblue;

        &:hover {
          background-color: lawngreen;
        }
      `}
    >
      {children}
    </div>
  );
};

const EditableVoid = ({ attributes, children, element }) => {
  return (
    // Need contentEditable=false or Firefox has issues with certain input types.
    <div {...attributes} contentEditable={false}>
      <div>
        <NoteMentions />
        <DownCircleOutlined />
      </div>
      {children}
    </div>
  );
};

const SelectorVoid = ({ attributes, children, element }) => {
  const editor = useSlateStatic();

  console.log(`editor.tags`, editor.tags);
  const [tagValue, setTagValue] = useState(editor.tags);

  async function fetchUserList(username) {
    console.log("fetching user", username);
    return fetch("https://randomuser.me/api/?results=5")
      .then((response) => response.json())
      .then((body) =>
        body.results.map((user) => ({
          label: `${user.name.first} ${user.name.last}`,
          value: user.login.username,
        }))
      );
  }
  return (
    <div {...attributes} contentEditable={false}>
      <div
        className={css`
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        <EditorSelector
          mode="multiple"
          tagvalue={tagValue}
          tagRender={EditorTag}
          placeholder="Select buddies"
          fetchOptions={fetchUserList}
          onChange={(newTagValue) => {
            console.log(`newTagValue`, newTagValue);
            setTagValue(newTagValue);
            editor.onTagChange((prev) => {
              return newTagValue;
            });
          }}
          className={css`
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 200px;
          `}
        />
      </div>
      {children}
    </div>
  );
};

const Mention = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <span
      {...attributes}
      contentEditable={false}
      style={{
        padding: "3px 3px 2px",
        margin: "0 1px",
        verticalAlign: "baseline",
        display: "inline-block",
        borderRadius: "4px",
        backgroundColor: "#eee",
        fontSize: "0.9em",
        boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
      }}
    >
      {element.character}
      {children}
    </span>
  );
};
