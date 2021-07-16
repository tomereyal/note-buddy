import React from "react";
import { Menu } from "antd";

import { withRouter, Link } from "react-router-dom";



function LeftMenu(props) {

  return (
    <>
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <Link to="/">Home</Link>
        </Menu.Item>
        {/* <Menu.Item key="Blog">
          <Link to="/blog">Blog</Link>
        </Menu.Item> */}
        <Menu.Item key="Folders">
          <Link to="/folders">Folders</Link>
        </Menu.Item>
        <Menu.Item key="Create">
          <Link to="/blog/create">Create</Link>
        </Menu.Item>
        <Menu.Item key="search">
          <Link to="/search">Search</Link>
        </Menu.Item>
      </Menu>
    </>
  );
}

export default withRouter(LeftMenu);
