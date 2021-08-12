import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
//===========REDUX=========================
import { useDispatch } from "react-redux";
//===========SLATE=========================
import { useSlate, useSelected, useFocused, ReactEditor } from "slate-react";
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
import { Select, Dropdown } from "antd";
const { Option } = Select;

//--------------------------------------------------------------------------------------

export default function EditorTitleToolbar({ fontStyle = "Poppins" }) {
  // const ref = useRef();
  const editor = useSlate();
  const { changeFontFamily } = EditorPlugins;
  const fonts = [
    { label: "Poppins", value: "Poppins" },
    { label: "Mummified", value: "Mummified" },
    { label: "Chocolate-Cookies", value: "Chocolate-Cookies" },
    { label: "Astral-Groove", value: "Astral-Groove" },
    { label: "Space-Rave", value: "Space-Rave" },
    { label: "Rough-Owl", value: "Rough-Owl" },
    { label: "Relate", value: "Relate" },
    { label: "Grand-Royal", value: "Grand-Royal" },
    { label: "Buco-Nero", value: "Buco-Nero" },
  ];

  const content = (
    <div
      // ref={ref}
      className={css`
        z-index: 1;
        opacity: 1;
        border-radius: 4px;
        transition: opacity 0.75s;
        & > * {
          display: inline-block;
        }
        & > * + * {
          margin-left: 15px;
        }
      `}
    >
      <PaintBlockButton icon={<BgColorsOutlined />} />
      <select
        style={{ minWidth: "100px" }}
        onClick={(e) => {
          console.log(`editor.selection`, editor.selection);
          changeFontFamily(editor, e.target.value);
        }}
      >
        {" "}
        {fonts.map(({ label, value }) => {
          return (
            <option key={label} value={value} style={{ fontFamily: value }}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );

  return (
    <div
      style={{
        zIndex: 10,
        height: "100%",
        width: "18px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Popover
        onClick={(e) => {
          e.preventDefault();
        }}
        content={content}
      >
        <Button
          style={{
            color: "black",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <EditOutlined
            style={{ fontSize: "smaller" }}
            onClick={(e) => {
              e.preventDefault();
            }}
          />
        </Button>
      </Popover>
    </div>
  );
}

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

export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      onClick={() => {
        console.log(`ref from button`, ref);
      }}
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
