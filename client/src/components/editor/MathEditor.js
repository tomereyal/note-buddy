import React, { useState, useRef, useEffect, useCallback } from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import { EditorPlugins } from "./EditorPlugins";
const { saveMathToElement } = EditorPlugins;
addStyles();

//dont really need useRef it was just an experiment
export default function EditableMathExample({
  slateEditor,
  savedMath,
  bcg,
  mathFieldFocus,
}) {
  const [latex, setLatex] = useState(savedMath);
  const [mathField, setMathField] = useState();
  const [isMenuShown, setIsMenuShown] = useState(false);

  useEffect(() => {
    if (mathFieldFocus) {
      console.log(`FOCUSSSS PLEASE`);
      mathField.focus();
    }
  }, [bcg, mathFieldFocus]);
  const onClick = useCallback(() => {
    if (mathField) {
      mathField.cmd("\\sqrt");
      // mathField.write("1");
    }
  }, [mathField]);
  // const onNodeClick = useCallback(() => {
  //   if (mathField) {
  //     mathField.focus();
  //   }
  // }, [mathField]);

  const onKeyDown = useCallback(
    (e) => {
      e.stopPropagation();
      if (!mathField) {
        return;
      }
      if (e.ctrlKey) {
        switch (e.key) {
          case "s": {
            e.preventDefault();
            mathField.cmd("\\sqrt");
            break;
          }
          case "1": {
            e.preventDefault();
            // mathField.cmd("\\sqrt");
            mathField.write(`
            \\sqrt[n]{1+x+x^2+x^3+\\dots+x^n}`);
            break;
          }
          case "2": {
            e.preventDefault();

            mathField.typedText(`\int_{0}^{\pi} \sin x \, dx = 2 `);

            break;
          }
        }
      }

      // mathField.write("1");
    },
    [mathField]
  );

  return (
    <span
      onClick={() => {
        console.log(`focus me in `);
        if (mathField) {
          mathField.focus();
        }
      }}
      onChange={() => {
        console.log(`I changed`);
      }}
      onMouseEnter={() => {
        setIsMenuShown(true);
      }}
      onMouseLeave={() => {
        setIsMenuShown(false);
      }}
    >
      {/* {isMenuShown && (
        <button style={{ position: "absolute" }} onClick={onClick}>
          sq
        </button>
      )} */}
      {/* <button
        onClick={() => {
          console.log("element is trying to save..");
          console.log(`slateEditor`, slateEditor);
          console.log(`latex`, latex);
          saveMathToElement(slateEditor, latex);
        }}
      >
        {" "}
        save
      </button> */}
      <EditableMathField
        style={{ border: "none" }}
        latex={latex}
        onChange={(mathField) => {
          setLatex(mathField.latex());
          setMathField(mathField);
          saveMathToElement(slateEditor, mathField.latex());
        }}
        // onKeyDown={onKeyDown}
        config={{
          handlers: {
            enter: (mathField) => {
              saveMathToElement(slateEditor, mathField.latex(), {
                exitOnSave: true,
              });
            },
            moveOutOf: (direction, mathField) => {
              saveMathToElement(slateEditor, mathField.latex(), {
                exitOnSave: true,
              });
              console.log("at the end function");
            },
          },
        }}
        mathquillDidMount={(mathField) => {
          setMathField(mathField);
        }}
      />
      {/* {mathField && <span style={{ color: "red" }}>{mathField.latex()}</span>} */}
    </span>
  );
}
