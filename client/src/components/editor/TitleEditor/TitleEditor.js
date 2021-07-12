// Import React dependencies.
import { LeftCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useState, useCallback } from "react";
// Import the Slate editor factory.
import { createEditor } from "slate";
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
import EditorTitleToolbar from "./EditorTitleToolbar";
const tinycolor = require("tinycolor2");
const defaultBgc = "white";

/**
 *
 * @param {props} title string.
 * @param {props} setTitle method.
 * @param {props} placeHolder string.
 * @param {props} size number: 1 being the biggest 5 being the smallest.
 * @param {} bgc string: hex number e.g. #ffffff default is none.
 *  @param {props} darkenBgc boolean: default false.
 * @returns Slate based editor for editing titles + hovertoolbar for styling.
 */
export default function TitleEditor(props) {
  const {
    title,
    setTitle,
    placeHolder = "title..",
    size = "3",
    bgc,
    darkenBgc = false,
  } = props;
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const initTitle = title ? title : "";
  let initContent = [
    {
      type: "card-title",
      backgroundColor: defaultBgc,
      placeHolder,
      size,
      bgc,
      darkenBgc,
      children: [{ text: initTitle }],
    },
  ];
  const [value, setValue] = useState(initContent);
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
      onMouseEnter={() => {
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
          setTitle(newValue[0].children[0].text);
        }}
      >
        {isTitleHovered && (
          <div style={{ position: "absolute", zIndex: 2
           }}>
            {" "}
            <EditorTitleToolbar />
          </div>
        )}

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
  const { placeHolder, size, bgc, darkenBgc } = element;
  const selected = useSelected();
  const focused = useFocused();
  let titleBgc = element.bgc ? element.bgc : "";
  let color = "#000000"; //black in hex

  if (bgc && darkenBgc) {
    titleBgc = tinycolor(bgc).darken(3).toString();
    color = tinycolor
      .mostReadable(titleBgc, [titleBgc], { includeFallbackColors: true })
      .toHexString(); // "#ffffff"
  }
  const fontSize = getFontSize(size);

  return (
    <h3
      style={{
        backgroundColor: titleBgc,
        color: color,
        margin: 0,
        padding: " 2px 16px",
        paddingBottom: "3px",
        borderRadius: "2px",
        fontSize: fontSize,
        boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
      }}
      className={"font-poppins"}
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
