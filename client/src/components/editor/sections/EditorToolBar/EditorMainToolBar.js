import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { ReactEditor, useSlate } from "slate-react";
import { Editor } from "slate";
import { css, cx } from "@emotion/css";
import { EditorPlugins } from "../../EditorPlugins";
import {
  BoldOutlined,
  BorderOutlined,
  BgColorsOutlined,
  CloseCircleOutlined,
  FontSizeOutlined,
  FontColorsOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
  FunctionOutlined,
} from "@ant-design/icons";
// import ColorPicker from "./Sections/ColorPicker";
import { Popover, Button as AntdButton } from "antd";

import { GithubPicker } from "react-color";

// import { Range } from "slate";
export default function EditorMainToolbar() {
  const ref = useRef();

  //   const editor = useSlate();

  return (
    <Menu
      ref={ref}
      className={css`
        padding: 8px 7px 6px;
        z-index: 1;
        margin-top: -6px;
        opacity: 1;
        /* background-color: #222; */
        border-radius: 4px;
        transition: opacity 0.75s;
      `}
    >
      <FormatButton format="bold" icon={<BoldOutlined />} />
      <FormatButton format="italic" icon={<ItalicOutlined />} />
      <FormatButton format="underlined" icon={<UnderlineOutlined />} />
      <BlockButton
        format="heading-one"
        icon={<FontSizeOutlined style={{ fontSize: "20px" }} />}
      />
      <BlockButton
        format="heading-two"
        icon={<FontSizeOutlined style={{ fontSize: "16px" }} />}
      />

      <BlockButton format="block-quote" icon='" "' />
      <BlockButton format="numbered-list" icon={<OrderedListOutlined />} />
      <BlockButton format="bulleted-list" icon={<UnorderedListOutlined />} />
      <InsertMathButton icon={<FunctionOutlined />} />
      <PaintBlockButton icon={<BgColorsOutlined />} />
    </Menu>
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
const InsertMathButton = ({ format, icon }) => {
  const editor = useSlate();
  const mathRawString = String.raw`e^{i \theta} = cos\theta + isin\theta`;
  const mathRawString2 = String.raw`\lim_{a \rightarrow b}  \frac{d}{dx}\ln(x)=\frac{1}{x} `;
  return (
    <Button
      reversed
      onMouseDown={(event) => {
        event.preventDefault();
        EditorPlugins.insertMathBlock(editor, mathRawString2);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
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
