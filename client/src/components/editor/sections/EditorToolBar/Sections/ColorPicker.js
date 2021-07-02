import React, { useState } from "react";
import { Popover, Button } from "antd";
import Icon from "@ant-design/icons";
import { TwitterPicker } from "react-color";
export default function ColorPicker(props) {
  const { setColor } = props;
  const text = <span>Choose Background-Color:</span>;

  const renderColorPicker = () => {
    return (
      <div>
        <TwitterPicker
          //   width="230px"
          triangle={"hide"}
          colors={colors}
          //   color={background}
          onChangeComplete={(color) => {
            setColor(color.hex);
          }}
        ></TwitterPicker>{" "}
      </div>
    );
  };

  return (
    <span>
      {" "}
      <Popover content={renderColorPicker()} trigger="click">
        <Button shape="circle"></Button>
      </Popover>{" "}
    </span>
  );
}
const colors = [
  "#FFFFFF",
  "#D9E3F0",
  "#F47373",
  "#697689",
  "#37D67A",
  "#2CCCE4",
  "#555555",
  "#dce775",
  "#ff8a65",
  "#ba68c8",
];
