/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Avatar, Button, Drawer, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { SettingOutlined } from "@ant-design/icons";
import QuickSettings from "../../QuickSettings/QuickSettings";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function RightMenu(props) {
  const user = useSelector((state) => state.user);
  console.log(`user`, user);
  const isUserLoggedIn = user.userData && user.userData.isAuth;
  const [settingsVisibility, setSettingsVisibility] = useState(false);

  const showDrawer = () => {
    setSettingsVisibility(true);
  };

  const onClose = () => {
    setSettingsVisibility(false);
  };

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  const anonymousMenu = (
    <Menu mode={props.mode}>
      <Menu.Item key="mail">
        <Link to="/login">Login</Link>
      </Menu.Item>
      <Menu.Item key="app">
        <Link to="/register">Signup</Link>
      </Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu mode={props.mode}>
      <Menu.Item key="logout">
        <a onClick={logoutHandler}>Logout</a>
      </Menu.Item>
      <Menu.Item key="test">
        <Link to="/test">Test</Link>
      </Menu.Item>
      <Menu.Item key="Settings" onClick={showDrawer} title={"Settings"}>
        <SettingOutlined /> Settings
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={isUserLoggedIn ? userMenu : anonymousMenu}>
        {isUserLoggedIn ? (
          <Link to="/profile">
            {user.userData ? (
              <Avatar src={user.userData.image} />
            ) : (
              <Avatar icon={<UserOutlined />} />
            )}
          </Link>
        ) : (
          <Link to="/login">
            <Avatar icon={<UserOutlined />}></Avatar>
          </Link>
        )}
      </Dropdown>

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

export default withRouter(RightMenu);
