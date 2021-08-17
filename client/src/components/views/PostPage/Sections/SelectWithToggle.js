import React, { useState } from "react";
import { Select, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function SelectWithToggle({ options, onSelect }) {
  const [toggleSelect, setToggleSelect] = useState(false);

  return toggleSelect ? (
    <Select
      style={{ width: "100px" }}
      showSearch
      onSelect={(option) => {
        console.log(`option`, option);
        onSelect(option);
        setToggleSelect(false);
      }}
      onDoubleClick={() => {
        setToggleSelect(false);
      }}
      optionFilterProp="children"
      filterOption={(input, option) => {
        if (!option.children) return;
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
      filterSort={(optionA, optionB) => {
        if (!optionA.children || !optionB.children) return;
        return optionA.children
          .toLowerCase()
          .localeCompare(optionB.children.toLowerCase());
      }}
    >
      {options.map(({ name, _id }) => {
        return (
          <Option key={_id} value={_id} title={name}>
            {name}
          </Option>
        );
      })}
    </Select>
  ) : (
    <Button
      onClick={() => {
        setToggleSelect(true);
      }}
      shape="circle"
      size="small"
      icon={
        <span>
          +<SearchOutlined></SearchOutlined>
        </span>
      }
    ></Button>
  );
}
