//---------REACT-AND-HOOKS-IMPORTS----------------------//
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useDispatch } from "react-redux";
//---------SLATE-EDITOR-IMPORTS----------------------//
import { createEditor, Editor, Transforms, Range } from "slate";
// Import the Slate components and React plugin.
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
//Import the actual editor and its methods..
import { withHistory } from "slate-history";
import { EditorPlugins } from "./EditorPlugins";
//---------MY-COMPONENTS-IMPORTS------------------------//
import EditorHoverToolbar from "./sections/EditorToolBar/EditorHoverToolbar";
import { mathConfig } from "./sections/math_Config";
//------MY-SLATE-ELEMENTS-------------------------//
import {
  DefaultElement,
  Leaf,
  Image,
  CodeElement,
  MathBlock,
  CardToolbar,
} from "./sections/EditorElements";

//-----------------------------------------------------//

/**
 *
 * @param {Object} style Recieves a style object | Default: none
 * @param {Array} content Recieves an array with a slate editor object | Default: [DefaultElement]
 * @param {SlateObject} initContent Recieves a setState hook to enable parent to access the slate editor value| Default: null
 * @param {Boolean} isReadOnly Recieves a boolean whether to allow editing | Default : false
 * @param {Number} fontSize text font size. | Default : 14px
 * @returns TextEditor React Component
 */
export default function TextEditor({
  content,
  setContent,
  style,
  isReadOnly = false,
  fontSize,
}) {
  const { withImages, withMathBlock, withTitledCardLayout } = EditorPlugins;

  const [value, setValue] = useState(
    content.length
      ? content
      : [
          {
            type: "paragraph",
            backgroundColor: "#FFFFFF",
            children: [{ text: "" }],
            style,
          },
        ]
  );

  const withCustomLayout = withTitledCardLayout; //make a switch case, switch(props.cardType)
  const editor = useMemo(
    () =>
      withMathBlock(
        // withCustomLayout(
        withImages(withHistory(withReact(createEditor())))
        // )
      ),
    []
  );

  //============RENDER-FUNCTIONS=================
  const renderElement = useCallback((props) => {
    const { children, attributes, element } = props;
    switch (element.type) {
      case "code":
        return <CodeElement {...props} />;
      case "math-block":
        return <MathBlock {...props} />;
      case "card-toolbar":
        return <CardToolbar {...props} />;
      case "span":
        return <span {...attributes}>{children}</span>;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  /////////////EVENTS/////////////////

  const onKeyDown = useCallback((event) => {
    if (event.key === "`") {
      event.preventDefault();
      EditorPlugins.insertMathBlock(editor);
    }
  }, []);
  ////////////////////

  const inputFontSize = getFontSize(fontSize);

  return (
    <div style={{ position: "relative", fontSize: inputFontSize }}>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          setValue(value);
          // setContent(value);
        }}
      >
        <EditorHoverToolbar />

        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          readOnly={isReadOnly}
          placeholder={<span>...add description</span>}
          spellCheck
          onDOMBeforeInput={(event) => {
            //Make sure you place the event.preventDefault() inside each case,
            //Else you will disable editing of the note.
            // switch (event.inputType) {
            //   case "formatBold":
            //     event.preventDefault();
            //     return EditorPlugins.toggleFormat(editor, "bold");
            //   case "formatItalic":
            //     event.preventDefault();
            //     return EditorPlugins.toggleFormat(editor, "italic");
            //   case "formatUnderline":
            //     event.preventDefault();
            //     return EditorPlugins.toggleFormat(editor, "underlined");
            // }
          }}
          onKeyDown={onKeyDown}
        />
      </Slate>
    </div>
  );
}

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
