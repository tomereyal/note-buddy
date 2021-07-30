import React, { useState, useRef, useEffect, useCallback } from "react";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";
import { EditorPlugins } from "./EditorPlugins";
import { Tabs, Button, Tooltip } from "antd";

const { TabPane } = Tabs;
const { saveMathToElement, getNodes } = EditorPlugins;
addStyles();

//dont really need useRef it was just an experiment
export default function MathEditor({
  slateEditor,
  savedMath,
  bcg,
  mathFieldFocus,
}) {
  const [latex, setLatex] = useState(savedMath);
  const [mathField, setMathField] = useState();
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const [isToolbarHovered, setIsToolbarHovered] = useState(false);
  const [currentLatex, setCurrentLatex] = useState("");
  const [insertedLatex, setInsertedLatex] = useState("");

  useEffect(() => {
    if (mathFieldFocus) {
      console.log(`FOCUSSSS PLEASE`);
      mathField.focus();
      setIsBlurred(false);
    }
  }, [bcg, mathFieldFocus]);
  const onClick = useCallback(() => {
    if (mathField) {
      mathField.cmd("\\sqrt");
    }
  }, [mathField]);

  const onKeyDown = useCallback(
    (e) => {
      e.stopPropagation();

      if (!mathField) {
        return;
      }
      const key = e.key;
      const keyCode = e.keyCode;
      if (keyCode >= 65 && keyCode <= 120) {
        setCurrentLatex((prev) => {
          return `${prev + "" + key}`;
        });
      }
      if (e.keyCode === 8) {
        setCurrentLatex((prev) => {
          return prev.slice(0, -1);
        });
      }

      if (e.keyCode === 32) {
        //on space reset current latex
        setCurrentLatex("");
        return;
      }
      if (e.keyCode === 13 && insertedLatex) {
        e.preventDefault();

        for (let i = 0; i < currentLatex.length; i++) {
          mathField.keystroke("Backspace");
        }

        mathField.write(`${insertedLatex}`);

        setCurrentLatex("");
        setInsertedLatex("");
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
        setIsBlurred(false);
      }}
      onBlur={() => {
        console.log(`I changed`);
        setIsBlurred(true);
      }}
      onMouseEnter={() => {
        setIsMenuShown(true);
      }}
      onMouseLeave={() => {
        setIsMenuShown(false);
      }}
    >
      <EditableMathField
        style={{ border: "none" }}
        latex={latex}
        onChange={(mathField) => {
          setLatex(mathField.latex());
          setMathField(mathField);
          saveMathToElement(slateEditor, mathField.latex());
        }}
        onKeyDown={onKeyDown}
        config={{
          handlers: {
            enter: (mathField) => {
              // saveMathToElement(slateEditor, mathField.latex(), {
              //   exitOnSave: true,
              // });
            },
            moveOutOf: (direction, mathField) => {
              console.log(`mathField.latex()`, mathField.latex());
              saveMathToElement(slateEditor, mathField.latex(), {
                exitOnSave: true,
                direction,
              });
              setIsBlurred(true);
              console.log("at the end function");
            },
          },
        }}
        mathquillDidMount={(mathField) => {
          setMathField(mathField);
        }}
      />
      {((mathField && !isBlurred) || isToolbarHovered) && (
        <MathEditorToolbar
          mathField={mathField}
          currentLatex={currentLatex}
          // searchArr={searchArr}
          setInsertedLatex={setInsertedLatex}
          setIsToolbarHovered={setIsToolbarHovered}
        ></MathEditorToolbar>
      )}
    </span>
  );
}

function MathEditorToolbar({
  mathField,
  currentLatex,
  setInsertedLatex,
  setIsToolbarHovered,
}) {
  // const [searchArr, setsearchArr] = useState([]);
  const searchArr =
    currentLatex === ""
      ? []
      : allMath
          .filter(({ label }) => label.includes(currentLatex))
          .splice(0, 10);

  setInsertedLatex(searchArr[0]?.value);
  return (
    <span
      style={{
        position: "absolute",
        top: "100%",
        backgroundColor: "#ffffff",
        zIndex: 4,
        display: "flex",
        flexDirection: "column",
        width: "250px",
      }}
      onMouseEnter={() => {
        setIsToolbarHovered(true);
      }}
      onMouseLeave={() => {
        setIsToolbarHovered(false);
      }}
    >
      <Tabs
        defaultActiveKey="1"
        onTabClick={() => {
          mathField.focus();
        }}
        style={{ padding: "10px 12px" }}
      >
        <TabPane tabKey="1" tab="quick-menu" key="search-math">
          <div>
            suggestion: (press enter to select)
            <div
              onClick={() => {
                mathField.write(`${searchArr[0]?.value}`);
              }}
              key={searchArr[0]?.label}
            >
              <StaticMathField>{searchArr[0]?.value}</StaticMathField>
            </div>{" "}
          </div>
          <div>
            other results:
            {searchArr.map(({ label, value, index }) => {
              return (
                <div
                  onClick={() => {
                    mathField.write(`${value}`);
                  }}
                  key={label + index}
                >
                  <StaticMathField>{value}</StaticMathField>
                </div>
              );
            })}
          </div>
        </TabPane>

        <TabPane tab="Greek Letters" key="Greek-Letters">
          <div
            style={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {greekLetters.map(({ label, value, keyboard }) => {
              return (
                <Tooltip title={label} key={label}>
                  <button
                    onClick={() => {
                      mathField.write(`${value}`);
                    }}
                    key={label}
                  >
                    <StaticMathField>{value}</StaticMathField>
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </TabPane>
        <TabPane tab="Operations" key="2">
          {operations.map(({ label, value, keyboard }) => {
            return (
              <Tooltip title={label} key={label}>
                <Button
                  onClick={() => {
                    mathField.write(`${value}`);
                  }}
                  style={{ zIndex: 6, position: "relative" }}
                >
                  <span
                    style={{
                      color: "red",
                      zIndex: -1,
                      position: "relative",
                    }}
                  >
                    <StaticMathField>{value}</StaticMathField>
                  </span>
                </Button>
              </Tooltip>
            );
          })}
        </TabPane>

        <TabPane tab="Relations" key="3">
          {relations.map(({ label, value, keyboard }) => {
            return (
              <Tooltip title={label} key={label}>
                <button
                  onClick={() => {
                    mathField.write(`${value}`);
                  }}
                  key={label}
                >
                  <StaticMathField>{value}</StaticMathField>
                </button>
              </Tooltip>
            );
          })}
        </TabPane>
        <TabPane tab="Functions" key="4">
          {functions.map(({ label, value, keyboard }) => {
            return (
              <Tooltip title={label} key={label}>
                <button
                  onClick={() => {
                    mathField.write(`${value}`);
                  }}
                  key={label}
                >
                  <StaticMathField>{value}</StaticMathField>
                </button>
              </Tooltip>
            );
          })}
        </TabPane>
      </Tabs>
    </span>
  );
}

const greekLetters = [
  { label: "alpha", value: "\\alpha", keyboard: "\\alpha" },
  { label: "beta", value: "\\beta ", keyboard: "\\beta " },
  { label: "gamma", value: "\\gamma", keyboard: "\\gamma" },
  { label: "delta", value: "\\delta", keyboard: "\\delta" },
  { label: "epsilon", value: "\\epsilon", keyboard: "\\epsilon" },
  { label: "varepsilon", value: "\\varepsilon", keyboard: "\\varepsilon" },
  { label: "zeta", value: "\\zeta", keyboard: "\\zeta" },
  { label: "eta", value: "\\eta", keyboard: "\\eta" },
  { label: "theta", value: "\\theta", keyboard: "\\theta" },
  { label: "vartheta", value: "\\vartheta", keyboard: "\\vartheta" },
  { label: "kappa", value: "\\kappa", keyboard: "\\kappa" },
  { label: "lambda", value: "\\lambda", keyboard: "\\lambda" },
  { label: "mu", value: "\\mu", keyboard: "\\mu" },
  { label: "nu", value: "\\nu", keyboard: "\\nu" },
  { label: "xi", value: "\\xi", keyboard: "\\xi" },
  { label: "o", value: "o", keyboard: "o" },
  { label: "pi", value: "\\pi", keyboard: "\\pi" },
  { label: "varpi", value: "\\varpi", keyboard: "\\varpi" },
  { label: "rho", value: "\\rho", keyboard: "\\rho" },
  { label: "varrho", value: "\\varrho", keyboard: "\\varrho" },
  { label: "sigma", value: "\\sigma", keyboard: "\\sigma" },
  { label: "varsigma", value: "\\varsigma", keyboard: "\\varsigma" },
  { label: "tau", value: "\\tau", keyboard: "\\tau" },
  { label: "upsilon", value: "\\upsilon", keyboard: "\\upsilon" },
  { label: "phi", value: "\\phi", keyboard: "\\phi" },
  { label: "varphi", value: "\\varphi", keyboard: "\\varphi" },
  { label: "chi", value: "\\chi", keyboard: "\\chi" },
  { label: "psi", value: "\\psi", keyboard: "\\psi" },
  { label: "omega", value: "\\omega", keyboard: "\\omega" },
];

const operations = [
  { label: "div", value: "\\div", keyboard: "\\div" },
  { label: "times", value: "\\times", keyboard: "\\times" },
  {
    label: "fraction",
    value: "\\frac{ a } { b }",
    keyboard: "\\frac{ a } { b }",
  },
  { label: "otimes", value: "\\otimes", keyboard: "\\otimes" },
  { label: "bullet", value: "\\bullet", keyboard: "\\bullet" },
  { label: "bigotimes", value: "\\bigotimes", keyboard: "\\bigotimes" },
  { label: "bigoplus", value: "\\bigoplus", keyboard: "\\bigoplus" },
  { label: "cap", value: "\\cap", keyboard: "\\cap" },
  { label: "cup", value: "\\cup", keyboard: "\\cup" },
  {
    label: "underline",
    value: "\\underline{ ab }",
    keyboard: "\\underline{ ab }",
  },
  {
    label: "underbrace ",
    value: "\\underbrace{ ab } ",
    keyboard: "\\underbrace{ ab } ",
  },
  { label: "vector", value: "\\vec{ x }", keyboard: "\\vec{ x }" },
  {
    label: "widetilde",
    value: "\\widetilde{ x }",
    keyboard: "\\widetilde{ x }",
  },
  { label: "overline", value: "\\overline{ x }", keyboard: "\\overline{ x }" },
  { label: "hat", value: "\\hat{ x }", keyboard: "\\hat{ x }" },
  { label: "acute", value: "\\acute{ x }", keyboard: "\\acute{ x }" },
];

const relations = [
  { label: " not equal ", value: "\\neq ", keyboard: "\\neq " },
  { label: "equiv", value: "\\equiv", keyboard: "\\equiv" },
  { label: "simeq", value: "\\simeq", keyboard: "\\simeq" },
  { label: "approx", value: "\\approx", keyboard: "\\approx" },
  {
    label: "Leftrightarrow",
    value: "\\Leftrightarrow",
    keyboard: "\\Leftrightarrow",
  },
  {
    label: "rightleftharpoons",
    value: "\\rightleftharpoons",
    keyboard: "\\rightleftharpoons",
  },
  { label: "perp", value: "\\perp", keyboard: "\\perp" },
  {
    label: "leftrightarrow",
    value: "\\leftrightarrow",
    keyboard: "\\leftrightarrow",
  },
  { label: "Leftarrow", value: "\\Leftarrow", keyboard: "\\Leftarrow" },
  { label: "leftarrow", value: "\\leftarrow", keyboard: "\\leftarrow" },
  {
    label: "longleftarrow",
    value: "\\longleftarrow",
    keyboard: "\\longleftarrow",
  },
  { label: "leq", value: "\\leq", keyboard: "\\leq" },
  { label: "prec", value: "\\prec", keyboard: "\\prec" },
  { label: "preceq", value: "\\preceq", keyboard: "\\preceq" },
  { label: "ll", value: "\\ll", keyboard: "\\ll" },
  { label: "subset", value: "\\subset", keyboard: "\\subset" },
  { label: "subseteq", value: "\\subseteq", keyboard: "\\subseteq" },
  { label: "sqsubset", value: "\\sqsubset", keyboard: "\\sqsubset" },
  { label: "in", value: "\\in", keyboard: "\\in" },
  { label: "vdash", value: "\\vdash", keyboard: "\\vdash" },
  { label: "Rightarrow", value: "\\Rightarrow", keyboard: "\\Rightarrow" },
  { label: "Rightarrow", value: "\\Rightarrow", keyboard: "\\Rightarrow" },
  { label: "mapsto", value: "\\mapsto", keyboard: "\\mapsto" },
  {
    label: "longrightarrow",
    value: "\\longrightarrow",
    keyboard: "\\longrightarrow",
  },
  { label: "geq", value: "\\geq", keyboard: "\\geq" },
  { label: "succ", value: "\\succ", keyboard: "\\succ" },
  { label: "succeq", value: "\\succeq", keyboard: "\\succeq" },
  { label: "gg", value: "\\gg", keyboard: "\\gg" },
  { label: "supset", value: "\\supset", keyboard: "\\supset" },
  { label: "supseteq", value: "\\supseteq", keyboard: "\\supseteq" },
  { label: "sqsupset", value: "\\sqsupset", keyboard: "\\sqsupset" },
  { label: "ni", value: "\\ni", keyboard: "\\ni" },
  { label: "dashv", value: "\\dashv", keyboard: "\\dashv" },
  { label: "cdots", value: "\\cdots", keyboard: "\\cdots" },
  { label: "forall", value: "\\forall", keyboard: "\\forall" },
  { label: "exists", value: "\\exists", keyboard: "\\exists" },
  { label: "nabla", value: "\\nabla", keyboard: "\\nabla" },
  { label: "triangle", value: "\\triangle", keyboard: "\\triangle" },
  { label: "neg", value: "\\neg", keyboard: "\\neg" },
  { label: "prime", value: "\\prime", keyboard: "\\prime" },
  { label: "emptyset", value: "\\emptyset", keyboard: "\\emptyset" },
  { label: "infty", value: "\\infty", keyboard: "\\infty" },
];

const functions = [
  { label: "power", value: "x^{ k }", keyboard: "x^{ k }" },
  { label: "sqrt{ ab }", value: "\\sqrt{ ab }", keyboard: "\\sqrt{ ab }" },
  {
    label: "sqrt[n]{ ab }",
    value: "\\sqrt[n]{ ab }",
    keyboard: "\\sqrt[n]{ ab }",
  },
  {
    label: "matrix",
    value: "\\begin{ bmatrix } a & b \\c & d end{ bmatrix }",
    keyboard: "\\begin{ bmatrix } a & b \\c & d end{ bmatrix }",
  },
  {
    label: "cases",
    value: "\\x =\\begin{ cases } a & x = 0\\b & x > 0end{ cases }",
    keyboard: "\\x =\\begin{ cases } a & x = 0\\b & x > 0end{ cases }",
  },
  { label: "sum", value: "\\sum_a ^ b x", keyboard: "\\sum_a ^ b x" },
  { label: "prod", value: "\\prod_a ^ b x", keyboard: "\\prod_a ^ b x" },
  { label: "bigcap", value: "\\bigcap_a ^ b x", keyboard: "\\bigcap_a ^ b x" },
  { label: "bigcup", value: "\\bigcup_a ^ b x", keyboard: "\\bigcup_a ^ b x" },
  { label: "exp", value: "\\exp", keyboard: "\\exp" },
  { label: "ln", value: "\\ln", keyboard: "\\ln" },
  { label: "log_{e}", value: "\\log_{e}", keyboard: "\\log_{e}" },
  { label: "log_{10}", value: "\\log_{10}", keyboard: "\\log_{10}" },
  {
    label: "lim of series at infinity",
    value: "\\lim_{n \\rightarrow \\infty}",
    keyboard: "\\lim_{n \\rightarrow \\infty}",
  },
  {
    label: "lim of function at point",
    value: "\\lim_{x \\rightarrow x_0} ",
    keyboard: "\\lim_{x \\rightarrow x_0} ",
  },
  {
    label: "lim of function at infinity",
    value: "\\lim_{x \\rightarrow \\infty}",
    keyboard: "\\lim_{x \\rightarrow \\infty}",
  },
  { label: "sin", value: "\\sin", keyboard: "\\sin" },
  { label: "cos", value: "\\cos", keyboard: "\\cos" },
  { label: "tan", value: "\\tan", keyboard: "\\tan" },
  { label: "coth", value: "\\coth", keyboard: "\\coth" },
  { label: "arcsin", value: "\\arcsin", keyboard: "\\arcsin" },
  { label: "arccos", value: "\\arccos", keyboard: "\\arccos" },
  { label: "arctan", value: "\\arctan", keyboard: "\\arctan" },
  { label: "sin^{-1}", value: "\\sin^{-1}", keyboard: "\\sin^{-1}" },
  { label: "cos^{-1}", value: "\\cos^{-1}", keyboard: "\\cos^{-1}" },
  { label: "tan^{-1}", value: "\\tan^{-1}", keyboard: "\\tan^{-1}" },
];

const allMath = greekLetters.concat(operations, relations, functions);
const allMathLabels = allMath.map(({ label }) => label);
