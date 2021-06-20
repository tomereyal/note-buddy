//---------REACT-AND-HOOKS-IMPORTS----------------------//
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
//---------SLATE-EDITOR-IMPORTS----------------------//
import { createEditor } from "slate";
// Import the Slate components and React plugin.
import {
  Slate,
  Editable,
  useSlateStatic,
  useSelected,
  useFocused,
  withReact,
} from "slate-react";
//Import the actual editor and its methods..
import { withHistory } from "slate-history";
import { EditorPlugins } from "./EditorPlugins";
//----------STYLE-IMPORTS-------------------------------//
import { css } from "@emotion/css";

//---------ANTD-COMPONENTS-IMPORTS----------------------//
import { DownCircleOutlined } from "@ant-design/icons";
//---------MY-COMPONENTS-IMPORTS------------------------//
import EditorToolbar from "./sections/EditorToolbar";
import NoteMentions from "./sections/NoteMentions";
import EditorSelector from "./sections/EditorSelector";
import EditorTag from "./sections/EditorTag";
//--------SERVER-RELATED-IMPORTS-----------------------//
import axios from "axios";
import { editNote } from "../../_actions/post_actions";

//------THIRD-PARTY-COMPONENTS-------------------------//

import { Modal } from "antd";
//-----------------------------------------------------//

export default function SlateEditor(props) {
  const { withImages, withSteps, withEditableVoids } = EditorPlugins;
  const editor = useMemo(
    () =>
      withEditableVoids(
        withSteps(withImages(withHistory(withReact(createEditor()))))
      ),
    []
  );
  const { card, listId, sectionId, postId, order } = props;

  let initContent =
    card.content.length > 0
      ? card.content
      : [
          {
            type: "paragraph",
            children: [{ text: "A line of text in a paragraph." }],
          },
        ];
  const [value, setValue] = useState(initContent);
  const [tags, setTags] = useState(card.tags);

  const dispatch = useDispatch();

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

  const saveNote = () => {
    console.log(`value to be saved`, value);
    console.log(`tags to be saved`, tags);

    const variables = {
      postId: postId,
      sectionId: sectionId,
      listId: listId,
      cardId: card._id,
      editArr: [
        { editType: "content", editValue: value },
        { editType: "tags", editValue: tags },
      ],
      // content: value,
      // tags: tags,
    };
    dispatch(editNote(variables));
    axios.post("/api/blog/editNote", variables).then((result) => {
      if (result.status === 200) {
        console.log("edit request was successful");
      }
    });
  };

  return (
    <Slate
      editor={editor}
      value={value}
      tags={tags}
      onTagChange={setTags}
      onChange={(value) => {
        setValue(value);
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
        onKeyDown={(event) => {
          if (!event.ctrlKey) {
            return;
          }

          // Replace the `onKeyDown` logic with our new commands.
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
        }}
      />
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
