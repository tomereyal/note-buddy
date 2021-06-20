import React, { useState } from "react";
import { Menu, Button, Drawer } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import QuickSettings from "../../QuickSettings/QuickSettings";
import { withRouter, Link } from "react-router-dom";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  const [settingsVisibility, setSettingsVisibility] = useState(false);

  const showDrawer = () => {
    setSettingsVisibility(true);
  };

  const onClose = () => {
    setSettingsVisibility(false);
  };

  return (
    <>
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="Blog">
          <Link to="/blog">Blog</Link>
        </Menu.Item>
        <Menu.Item key="Folders">
          <Link to="/folders">Folders</Link>
        </Menu.Item>
        <Menu.Item key="Create">
          <Link to="/blog/create">Create</Link>
        </Menu.Item>
        <Menu.Item
          key="Settings"
          onClick={showDrawer}
          itemIcon={<SettingOutlined />}
        ></Menu.Item>
      </Menu>

      <Drawer
        title="Quick Settings"
        placement={"right"}
        closable={false}
        onClose={onClose}
        visible={settingsVisibility}
        key={"right"}
        width="35%"
      >
        <QuickSettings></QuickSettings>
      </Drawer>
    </>
  );
}

export default withRouter(LeftMenu);
