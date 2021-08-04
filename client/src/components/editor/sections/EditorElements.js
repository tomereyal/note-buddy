import React, { useState, useEffect, useRef } from "react";
//---------SLATE-EDITOR-IMPORTS----------------------//
import {
  useSelected,
  useFocused,
  useSlateStatic,
  ReactEditor,
} from "slate-react";

import { EditorPlugins } from "../EditorPlugins";
import TitleEditor from "../TitleEditor/TitleEditor";

//----------STYLE-IMPORTS-------------------------------//

import { css } from "@emotion/css";
//------THIRD-PARTY-COMPONENTS-------------------------//
// import Latex from "react-latex";
// import MathJax from "react-mathjax-preview";
import Math from "../../views/TestPage/Math";
import MathEditor from "../MathEditor";
import { Button, Modal } from "antd";

import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";
import ConditionEditor from "../ConditionEditor";
import { Portal } from "./EditorToolBar/EditorHoverToolbar";
import { Editor } from "slate";

addStyles();

//----------------------------------------------------//
const defaultBgc = "white";
export const DefaultElement = ({ attributes, children, element }) => {
  const bcg = element.backgroundColor ? element.backgroundColor : "";
  const style = element.style;
  const justify = "start";
  return (
    <p
      style={{
        backgroundColor: bcg,
        margin: 0,
        padding: "0 16px",
        fontSize: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: justify,
        textAlign: justify,

        ...style,
      }}
      {...attributes}
    >
      {children}
    </p>
  );
};

export const Leaf = ({ attributes, children, leaf }) => {
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

export const CodeElement = ({ attributes, children, element }) => {
  const bcg = element.backgroundColor ? element.backgroundColor : defaultBgc;

  return (
    <pre style={{ backgroundColor: bcg }} {...attributes}>
      <code>{children}</code>
    </pre>
  );
};

export const ConditionBlock = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  const editor = useSlateStatic();
  const bcg = element.backgroundColor ? element.backgroundColor : defaultBgc;
  const [isPopupShown, setIsPopupShown] = useState(false);
  const conditionBlock = useRef(null);
  const popup = useRef(null);
  // const domRange = ReactEditor.toDOMRange(editor, editor.selection);

  useEffect(() => {
    if (popup.current && conditionBlock.current) {
      const rect = conditionBlock.current.getBoundingClientRect();
      console.log(`rect`, rect);
      popup.current.style.top = `${rect.top + window.pageYOffset + 24}px`;
      popup.current.style.left = `${rect.left + window.pageXOffset}px`;
      console.log(`isPopupShown`, isPopupShown);
    }
  }, [isPopupShown, popup.current, conditionBlock]);
  return (
    <span
      {...attributes}
      ref={conditionBlock}
      style={{
        margin: "0 1px",
        padding: "0",
        display: "inline-block",
        fontWeight: "bold",
        color: "black",
        backgroundColor: bcg,
        boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
      }}
      onClick={() => {
        console.log("hi");
      }}
      onMouseEnter={() => {
        console.log("on mouse enter create portal?");
        setIsPopupShown(true);
      }}
    >
      {isPopupShown && (
        <Portal>
          <div
            ref={popup}
            style={{
              width: "200px",
              height: "100px",
              position: "absolute",
              zIndex: 1,
              padding: "3px",
              background: "white",
              top: "-9999px",
              left: "-9999px",
              borderRadius: "4px",
              boxShadow: "0 1px 5px rgba(0,0,0,.2)",
            }}
            onMouseLeave={() => {
              setIsPopupShown(false);
            }}
          >
            {" "}
            <ConditionEditor></ConditionEditor>
          </div>
        </Portal>
      )}

      {children}
    </span>
  );
};
export const MathBlock = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  const editor = useSlateStatic();
  const { math, backgroundColor = defaultBgc, isReadOnly } = element;
  const bcg = backgroundColor;
  const [mathFieldFocus, setMathFieldFocus] = useState(false);
  const [mathFieldSelected, setMathFieldSelected] = useState(false);
  console.log(`isReadOnly`, isReadOnly);
  useEffect(() => {
    if (selected && focused) {
      setMathFieldSelected(true);

      console.log(`editor.selection`, editor.selection);
      const { anchor, focus } = editor.selection;
      const [node] = Editor.nodes(editor, {
        match: (n, path) => n.type === "math-block",
      });
      console.log(`math`, node[0].math);
      console.log(`mathBlock path`, node[1]);
      console.log(`anchor.path`, anchor.path);
      console.log(`focus.path`, focus.path);

      if (anchor.path[0] === focus.path[0] && anchor.path[1] === focus.path[1])
        setMathFieldFocus(true);
    } else {
      setMathFieldFocus(false);
      setMathFieldSelected(false);
    }
  }, [selected]);

  return (
    <span
      {...attributes}
      contentEditable={false}
      style={{
        direction: "ltr",
        margin: "0 1px",
        verticalAlign: "baseline",
        // display: "inline-block",
        borderRadius: "4px",
        fontWeight: "bold",
        color: "black",
        backgroundColor: bcg,
        position: "relative",
        // boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
      }}
    >
      {isReadOnly ? (
        <span>
          <StaticMathField>{math}</StaticMathField>{" "}
        </span>
      ) : (
        <MathEditor
          slateEditor={editor}
          savedMath={math}
          bcg={bcg}
          mathFieldFocus={mathFieldFocus}
          mathFieldSelected={mathFieldSelected}
        ></MathEditor>
      )}
      {children}
    </span>
  );
};
export const CardHeader = ({ attributes, children, element }) => {
  console.log(`1`, 1);

  return (
    <div {...attributes} contentEditable={false}>
      <div style={{ padding: "10px" }}>
        <input></input>
      </div>
      {children}
    </div>
  );
};

export const CardToolbar = ({ attributes, children, element }) => {
  console.log(`5`, 5);
  return (
    <div {...attributes} contentEditable={false}>
      <button>+dddd</button>
      {children}
    </div>
  );
};

export const QuoteBlock = ({ attributes, children, element }) => {
  const bcg = element.backgroundColor ? element.backgroundColor : defaultBgc;
  return (
    <blockquote {...attributes} style={{ backgroundColor: bcg }}>
      {children}
    </blockquote>
  );
};
export const H1Block = ({ attributes, children, element }) => {
  const bcg = element.backgroundColor ? element.backgroundColor : defaultBgc;
  return (
    <h1
      style={{ backgroundColor: bcg, margin: 0, paddingBottom: "3px" }}
      {...attributes}
    >
      {children}
    </h1>
  );
};
export const H2Block = ({ attributes, children, element }) => {
  const bcg = element.backgroundColor ? element.backgroundColor : defaultBgc;
  return (
    <h2
      style={{ backgroundColor: bcg, margin: 0, paddingBottom: "3px" }}
      {...attributes}
    >
      {children}
    </h2>
  );
};
export const BulletList = ({ attributes, children, element }) => {
  const bcg = element.backgroundColor ? element.backgroundColor : defaultBgc;
  return (
    <ul style={{ backgroundColor: bcg }} {...attributes}>
      {children}
    </ul>
  );
};
export const NumberList = ({ attributes, children, element }) => {
  const bcg = element.backgroundColor ? element.backgroundColor : defaultBgc;
  return (
    <ol style={{ backgroundColor: bcg }} {...attributes}>
      {children}
    </ol>
  );
};
export const ListItem = ({ attributes, children, element }) => {
  const bcg = element.backgroundColor ? element.backgroundColor : defaultBgc;
  return (
    <li style={{ backgroundColor: bcg }} {...attributes}>
      {children}
    </li>
  );
};

export const Image = ({ attributes, children, element }) => {
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

export const Mention = ({ attributes, children, element }) => {
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
    <span
      {...attributes}
      contentEditable={false}
      style={{
        // padding: "1px 1px 2px",
        margin: "0 1px",
        verticalAlign: "baseline",
        display: "inline-block",
        borderRadius: "4px",
        // backgroundColor: "#eee",
        fontSize: "0.9em",
        // boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
      }}
    >
      <Button
        default
        style={{ padding: "3px 3px 2px" }}
        type="dashed"
        onClick={() => {
          console.log("Button works");
          showModal();
        }}
      >
        {element.character}
      </Button>

      <Modal
        title={element.character}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <img src={element.image} width={"100px"} height={"100px"}></img>
      </Modal>
      {children}
    </span>
  );
};

export const StepsList = ({ attributes, children, element }) => {
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

export const StepNode = ({ attributes, children, element }) => {
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

export const EditableVoid = ({ attributes, children, element }) => {
  return (
    // Need contentEditable=false or Firefox has issues with certain input types.
    <div {...attributes} contentEditable={false}>
      <div>
        {/* <NoteMentions />
        <DownCircleOutlined /> */}
      </div>
      {children}
    </div>
  );
};

// const SelectorVoid = ({ attributes, children, element }) => {
//   const editor = useSlateStatic();

//   console.log(`editor.tags`, editor.tags);
//   const [tagValue, setTagValue] = useState(editor.tags);

//   async function fetchUserList(username) {
//     console.log("fetching user", username);
//     return fetch("https://randomuser.me/api/?results=5")
//       .then((response) => response.json())
//       .then((body) =>
//         body.results.map((user) => ({
//           label: `${user.name.first} ${user.name.last}`,
//           value: user.login.username,
//         }))
//       );
//   }
//   return (
//     <div {...attributes} contentEditable={false}>
//       <div
//         className={css`
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         `}
//       >
//         <EditorSelector
//           mode="multiple"
//           tagvalue={tagValue}
//           tagRender={EditorTag}
//           placeholder="Select buddies"
//           fetchOptions={fetchUserList}
//           onChange={(newTagValue) => {
//             console.log(`newTagValue`, newTagValue);
//             setTagValue(newTagValue);
//             editor.onTagChange((prev) => {
//               return newTagValue;
//             });
//           }}
//           className={css`
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             min-width: 200px;
//           `}
//         />
//       </div>
//       {children}
//     </div>
//   );
// };
