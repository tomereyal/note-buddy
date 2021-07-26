// Import React dependencies.

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
// Import the Slate editor factory.
import {
  createEditor,
  Editor,
  Transforms,
  Element as SlateElement,
} from "slate";
// Import the Slate components and React plugin.
import { withHistory } from "slate-history";
import {
  Slate,
  Editable,
  withReact,
  useSelected,
  useFocused,
} from "slate-react";
import { Leaf } from "../sections/EditorElements";
import EditorHoverToolbar from "../sections/EditorToolBar/EditorHoverToolbar";
import EditorTitleToolbar, { Toolbar } from "./EditorTitleToolbar";
const tinycolor = require("tinycolor2");
const defaultBgc = "white";

/**
 *
 * @param { text, color, bgc = "#ffffff", fontStyle } title object {}.
 * @param {props} setTitle method.
 * @param {props} placeHolder string.
 * @param {props} size number: 1 being the biggest 5 being the smallest.
 * @param {} bgc string: hex number e.g. #ffffff default is none.
 *  @param {props} darkenBgc boolean: default false.
 * @returns Slate based editor for editing titles + hovertoolbar for styling.
 */

export default function TitleEditor(props) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const {
    name = "",
    setName,
    title,
    setTitle,
    placeHolder = "title..",
    size = "3",
    darkenBgc = false,
  } = props;

  const [value, setValue] = useState(
    title.length
      ? title
      : [
          {
            type: "card-title",
            backgroundColor: "#ffffff",
            placeHolder,
            fontStyle: "",
            size,
            darkenBgc,
            children: [{ text: name }],
          },
        ]
  );

  const [isTitleHovered, setIsTitleHovered] = useState(false);

  const renderElement = useCallback((props) => {
    const { children, attributes, element } = props;
    switch (element.type) {
      case "card-title":
        return <CardTitle {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => {
        const [match] = Editor.nodes(editor, {
          match: (n, path) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === "card-title",
        });

        setIsTitleHovered(true);
      }}
      onMouseLeave={() => {
        setIsTitleHovered(false);
      }}
    >
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          setTitle(newValue);
          setName(newValue[0].children[0].text);
        }}
      >
        <EditorTitleToolbar
          isTitleHovered={isTitleHovered}
          // fontStyle={fontStyle}
        />

        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          // readOnly={props.isReadOnly}
          placeholder="Enter some text..."
          spellCheck
        />
      </Slate>
    </div>
  );
}

const CardTitle = ({ attributes, children, element }) => {
  const {
    placeHolder,
    size,
    backgroundColor = "",
    darkenBgc,
    fontStyle = "",
  } = element;
  const selected = useSelected();
  const focused = useFocused();

  //======COLOR=====
  let titleBgc = backgroundColor;
  let color = "#000000"; //black in hex
  if (backgroundColor && darkenBgc) {
    titleBgc = tinycolor(backgroundColor).darken(3).toString();
    color = tinycolor
      .mostReadable(titleBgc, [titleBgc], { includeFallbackColors: true })
      .toHexString(); // "#ffffff"
  }
  //===FONT-STYLE====
  const fontSize = getFontSize(size);
  //=================
  return (
    <h3
      style={{
        backgroundColor: titleBgc,
        display: "flex",
        alignItems: "center",
        color: color,
        padding: " 6px 28px",
        borderRadius: "2px",
        fontSize: fontSize,
        boxShadow: selected && focused ? "0 0 0 1px #F4F1F0" : "none",
        fontFamily: fontStyle,
      }}
      {...attributes}
    >
      {children}
    </h3>
  );
};

const DefaultElement = ({ attributes, children, element }) => {
  const bcg = element.backgroundColor ? element.backgroundColor : defaultBgc;

  return (
    <p
      {...attributes}
      style={{
        backgroundColor: bcg,
        margin: 0,

        fontSize: "1rem",
      }}
    >
      {children}
    </p>
  );
};

const getFontSize = (size) => {
  switch (size) {
    case 1:
      return "32px";

    case 2:
      return "24px";

    case 3:
      return "18.72px";

    case 4:
      return "16px";

    case 5:
      return "13.28px";

    default:
      return size;
  }
};
