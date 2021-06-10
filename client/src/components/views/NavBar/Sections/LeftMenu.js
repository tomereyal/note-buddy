import React from "react";
import { Menu } from "antd";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="mail">
        <a href="/">Home</a>
      </Menu.Item>
      <Menu.Item key="Blog">
        <a href="/blog">Blog</a>
      </Menu.Item>
      <Menu.Item key="Folders">
        <a href="/folders">Folders</a>
      </Menu.Item>
      <Menu.Item key="Create">
        <a href="/blog/create">Create</a>
      </Menu.Item>
    </Menu>
  );
}

export default LeftMenu;
