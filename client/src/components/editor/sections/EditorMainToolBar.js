import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { ReactEditor, useSlate } from "slate-react";
import { Editor } from "slate";
import { css, cx } from "@emotion/css";
import { EditorPlugins } from "../EditorPlugins";
import {
  BoldOutlined,
  BorderOutlined,
  FontSizeOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

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
      <PaintBlockButton backgroundColor="gold" icon={<BorderOutlined />} />
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
const PaintBlockButton = ({ backgroundColor, icon }) => {
  const editor = useSlate();
  return (
    <Button
      reversed
      //   active={EditorPlugins.isBlockPainted(editor, backgroundColor)}
      onMouseDown={(event) => {
        event.preventDefault();
        console.log(`backgroundColor`, backgroundColor);
        EditorPlugins.paintBlock(editor, backgroundColor);
      }}
    >
      <Icon>{icon}</Icon>
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
