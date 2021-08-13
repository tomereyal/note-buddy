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
import ContainerWithMenu from "../../views/BasicComponents/ContainerWithMenu";
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
 * @param { Boolean } isReadOnly .
 * @param {String} name method.
 * @param {Function} setName? method.
 * @param {SlateObject} title method.
 * @param {Function} setTitle? method.
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
    bgc,
    color = "",
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
            backgroundColor: bgc || "",
            color: color || "",
            // placeHolder,
            justify,
            fontStyle: "",
            size,
            darkenBgc,
            children: [{ text: name }],
          },
        ]
  );

  const renderElement = useCallback((props) => {
    const { children, attributes, element } = props;
    switch (element.type) {
      case "card-title":
        return (
          <CardTitle
            {...props}
            element={{
              ...props.element,
              color: color || "",
              darkenBgc,
              size,
              style,
            }}
          />
        );
      case "math-block":
        return (
          <MathBlock
            {...props}
            element={{
              ...props.element,
              isReadOnly,
              color: color || "",
              bgc: bgc || "",
            }}
          />
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
        fontWeight: isBold ? "bold" : "normal",
        margin: "0px 10px",
        padding: 0,
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
          if (setName) {
            const newName = serializeMathAndText(editor);
            setName(newName);
          }
        }}
      >
        <ContainerWithMenu
          leftMenu={!isReadOnly ? <EditorTitleToolbar /> : null}
          style={{ padding: "0px 20px" }}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={onKeyDown}
            readOnly={props.isReadOnly}
            placeholder={<span>{placeHolder}</span>}
            spellCheck
          />
        </ContainerWithMenu>
      </Slate>
    </div>
  );
}

const CardTitle = ({ attributes, children, element }) => {
  const {
    placeHolder,
    size,
    justify,
    backgroundColor,
    darkenBgc,
    fontStyle = "",
    color,
    style,
  } = element;
  const selected = useSelected();
  const focused = useFocused();

  //======COLOR=====
  let titleBgc = backgroundColor;
  let enhancedColor; //black in hex
  if (backgroundColor && darkenBgc) {
    titleBgc = tinycolor(backgroundColor).darken(3).toString();
    enhancedColor = tinycolor
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
        color: enhancedColor || color,
        width: "100%",
        height: "100%",
        padding: 0,
        margin: 0,
        // boxShadow: selected && focused ? "0 0 0 1px #F4F1F0" : "none",
        fontFamily: fontStyle,

        fontSize: fontSize,
        ...style,
      }}
      {...attributes}
    >
      {children}
    </p>
  );
};

const DefaultElement = ({ attributes, children, element }) => {
  const bcg = element.backgroundColor ? element.backgroundColor : "";

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
