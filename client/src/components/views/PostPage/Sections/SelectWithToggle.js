import React, { useState } from "react";
import { Select, Button } from "antd";

const { Option } = Select;
export default function SelectWithToggle({options}) {
  const [toggleSelect, setToggleSelect] = useState(false);

  return toggleSelect ? (
    <Select
      showSearch
      onSelect={() => {
        setToggleSelect(false);
      }}
    >
      <Option>hi</Option>
    </Select>
  ) : (
    <Button
      onClick={() => {
        setToggleSelect(true);
      }}
    >
      +
    </Button>
  );
}
