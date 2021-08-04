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
  Node,
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
import { Leaf, MathBlock } from "../sections/EditorElements";
import EditorHoverToolbar from "../sections/EditorToolBar/EditorHoverToolbar";
import EditorTitleToolbar, { Toolbar } from "./EditorTitleToolbar";
import { EditorPlugins } from "../EditorPlugins";
const tinycolor = require("tinycolor2");
const defaultBgc = "white";

const { withMathBlock, serializeMathAndText, withSingleLinedEditor } =
  EditorPlugins;

/**
 *
 * @param { Object } style .
 * @param {String} name method.
 * @param {Function} setName method.
 * @param {SlateObject} title method.
 * @param {Function} setTitle method.
 * @param {String} placeHolder string.
 * @param {String} justify enum: "start", "center" , "end" | default :"start"
 * @param {Number} size number: 1 being the biggest 5 being the smallest.
 * @param {String} bgc string: hex number e.g. #ffffff default is none.
 * @param {Boolean} darkenBgc boolean: default false.
 * @param {Boolean} isBold boolean: default true.
 * @returns Slate based editor for editing titles + hovertoolbar for styling.
 */

export default function TitleEditor(props) {
  const editor = useMemo(
    () =>
      withSingleLinedEditor(
        withMathBlock(withHistory(withReact(createEditor())))
      ),
    []
  );
  const {
    name = "",
    setName,
    title,
    setTitle,
    placeHolder = "",
    justify = "start",
    size = 3,
    darkenBgc = false,
    bgc = "#ffffff",
    isReadOnly = false,
    isBold = false,
    style,
  } = props;

  const [value, setValue] = useState(
    title.length
      ? title
      : [
          {
            type: "card-title",
            backgroundColor: bgc,
            // placeHolder,
            justify,
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
        return <CardTitle {...props} element={{ ...props.element, style }} />;
      case "math-block":
        return (
          <MathBlock {...props} element={{ ...props.element, isReadOnly }} />
        );
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  /////////////EVENTS/////////////////

  const onKeyDown = useCallback((event) => {
    if (event.key === "`" || event.key === ";") {
      event.preventDefault();
      EditorPlugins.insertMathBlock(editor);
    }
  }, []);
  ////////////////////
  const fontSize = getFontSize(size);
  return (
    <div
      style={{
        position: "relative",
        fontSize,
        display: "inline-block",
        fontWeight: isBold ? "bold" : "normal",
        margin: 0,
        padding: 0,
        ...style,
      }}
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
      onDoubleClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          setTitle(newValue);
          const newName = serializeMathAndText(editor);
          console.log(`newName`, newName);
          setName(newName);
        }}
      >
        {!isReadOnly && <EditorTitleToolbar isTitleHovered={isTitleHovered} />}

        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          readOnly={props.isReadOnly}
          // placeholder={<span>title</span>}
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
    justify,
    backgroundColor = "",
    darkenBgc,
    fontStyle = "",
    style,
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
    <p
      style={{
        backgroundColor: titleBgc,
        display: "flex",
        alignItems: "center",
        justifyContent: justify,
        textAlign: justify,
        color: color,
        width: "100%",
        height: "100%",
        padding: 0,
        margin: 0,
        // boxShadow: selected && focused ? "0 0 0 1px #F4F1F0" : "none",
        fontFamily: fontStyle,
        // ...style,
      }}
      {...attributes}
    >
      {children}
    </p>
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
