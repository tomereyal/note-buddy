import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
//===========REDUX=========================
import { useDispatch } from "react-redux";
//===========SLATE=========================
import { useSlate } from "slate-react";
//===========EMOTION-CSS=========================
import { css, cx } from "@emotion/css";
//===========ANTD=========================

import {
  BorderOutlined,
  BgColorsOutlined,
  CloseCircleOutlined,
  FontColorsOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  DownOutlined,
  DeleteFilled,
  EditOutlined,
} from "@ant-design/icons";
import { Popover, Tooltip, Button as AntdButton } from "antd";
import Math from "../../views/TestPage/Math";
//===========REACT-COLOR=========================
import { GithubPicker } from "react-color";
//===========LOCAL-FILES=========================
import { mathConfig } from "../sections/math_Config";
import { EditorPlugins } from "../EditorPlugins";

//--------------------------------------------------------------------------------------

export default function EditorTitleToolbar(props) {
  const ref = useRef();

  const content = (
    <Menu
      ref={ref}
      className={css`
        padding: 8px 7px 6px;
        z-index: 1;
        opacity: 1;
        background-color: #222;
        border-radius: 4px;
        transition: opacity 0.75s;
      `}
    >
      <BlockButton format="block-quote" icon='" "' />
      <BlockButton format="numbered-list" icon={<OrderedListOutlined />} />
      <BlockButton format="bulleted-list" icon={<UnorderedListOutlined />} />

      <PaintBlockButton icon={<BgColorsOutlined />} />
    </Menu>
  );

  return (
    <Popover content={content} title="Title" trigger="hover">
      <Button icon={<DownOutlined />}>
        <EditOutlined />
      </Button>
    </Popover>
  );
}

const FormatButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      reversed
      active={EditorPlugins.isFormatActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        EditorPlugins.toggleFormat(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};
const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      reversed
      active={EditorPlugins.isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        EditorPlugins.toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};
const InsertMathButton = ({ format, icon, previousMath }) => {
  const { division, root } = mathConfig.operator;
  const editor = useSlate();
  const { insertMathChar, insertMathOperator, insertFractionMathBlock } =
    EditorPlugins;
  const mathRawString = String.raw`e^{i \theta} = cos\theta + isin\theta`;
  const mathRawString2 = String.raw`\sqrt{ab}`;
  const mathRawString3 = String.raw`{(a+x)}`;
  const fraction = String.raw`/`;
  const fractionExample = String.raw`\frac{ \sqrt[n]{ab}}{\sin{\alpha}+3^e}`;
  const alpha = String.raw`\alpha`;
  const openCurly = String.raw`\{`;
  const closedCurly = String.raw`\}`;
  const sqrt = String.raw`\sqrt{\bigcirc}`;
  // const fraction = String.raw`{\frac{a}{\<span>ds</span>}}`;
  const mathArr = [
    { math: alpha, insertMethod: insertMathChar },
    {
      math: mathRawString,
      insertMethod: insertMathChar,
    },
    {
      math: mathRawString2,
      insertMethod: insertMathChar,
    },
    {
      math: mathRawString3,
      insertMethod: insertMathChar,
    },
    { math: sqrt, insertMethod: insertMathOperator },
    { math: openCurly, insertMethod: insertMathOperator },
    { math: closedCurly, insertMethod: insertMathChar },
  ];
  return (
    <>
      {mathArr.map(({ math, insertMethod }) => {
        return (
          <Button
            key={math}
            reversed
            onMouseDown={(event) => {
              event.preventDefault();
              insertMethod(editor, previousMath, math);
            }}
          >
            <Icon>
              <Math tex={math}></Math>
            </Icon>
          </Button>
        );
      })}{" "}
      <Button
        key={fraction}
        reversed
        onMouseDown={(event) => {
          event.preventDefault();
          insertMathOperator(editor, previousMath, fraction, "division");
        }}
      >
        <Icon>
          <Math tex={fraction}></Math>
        </Icon>
      </Button>
      <Button
        key={String.raw`\frac{a}{b}`}
        reversed
        onMouseDown={(event) => {
          event.preventDefault();
          let numerator = mathRawString2;
          let denominator = mathRawString3;
          let math = String.raw`\frac{${numerator}}{${denominator}}`;
          insertFractionMathBlock(
            editor,
            previousMath,
            math,
            numerator,
            denominator
          );
        }}
      >
        <Icon>
          <Math tex={String.raw`\frac{a}{b}`}></Math>
        </Icon>
      </Button>
    </>
  );
};
const PaintBlockButton = ({ backgroundColor, icon }) => {
  const editor = useSlate();
  const [color, setColor] = useState("");
  const colors = [
    "#B80000",
    "#DB3E00",
    "#FCCB00",
    "#008B02",
    "#006B76",
    "#1273DE",
    "#004DCF",
    "#5300EB",
    "#EB9694",
    "#FAD0C3",
    "#FEF3BD",
    "#C1E1C5",
    "#BEDADC",
    "#C4DEF6",
    "#BED3F3",
    "#D4C4FB",
  ];
  const renderColorPicker = () => {
    return (
      <div style={{ display: "flex" }}>
        <div>
          <GithubPicker
            width="216px"
            triangle={"hide"}
            colors={colors}
            //   color={background}
            onChangeComplete={(color) => {
              EditorPlugins.paintBlock(editor, color.hex);
              setColor(color.hex);
            }}
          ></GithubPicker>{" "}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <AntdButton icon={<BorderOutlined />}> </AntdButton>
          <AntdButton icon={<FontColorsOutlined />}> </AntdButton>
          <AntdButton
            icon={<CloseCircleOutlined />}
            onClick={() => {
              EditorPlugins.paintBlock(editor, "#FFFFFF");
              setColor("#FFFFFF");
            }}
          >
            {" "}
          </AntdButton>
        </div>
      </div>
    );
  };
  return (
    <Button
      reversed
      active={EditorPlugins.isBlockPainted(editor, color)}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
    >
      <Popover
        style={{ padding: 0 }}
        content={renderColorPicker()}
        trigger="hover"
      >
        <Icon>{icon}</Icon>
      </Popover>{" "}
    </Button>
  );
};

export const Icon = React.forwardRef(({ className, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={cx(
      "material-icons",
      className,
      css`
        font-size: 18px;
        vertical-align: text-bottom;
      `
    )}
  />
));

export const Menu = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        & > * {
          display: inline-block;
        }
        & > * + * {
          margin-left: 15px;
        }
      `
    )}
  />
));

export const Portal = ({ children }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? "white"
              : "#aaa"
            : active
            ? "black"
            : "#ccc"};
        `
      )}
    />
  )
);
