import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { createFolder } from "../../../_actions/folder_actions";
import { deleteFolder } from "../../../_actions/folder_actions";
import FolderSubmenu from "./sections/FolderSubmenu";
import {
  Layout,
  Card,
  Avatar,
  Col,
  Typography,
  Row,
  Menu,
  message,
  Button,
  Dropdown,
  Input,
  Spin,
} from "antd";

import {
  PlusSquareTwoTone,
  TeamOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;
const { Meta } = Card;

export default function FolderPage(props) {
  const [blog, setBlog] = useState({});
  const folders = useSelector((state) => state.folders);
  const user = useSelector((state) => state.user);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const dispatch = useDispatch();
  const initFolders = [
    "Recent",
    "FunctionLimits",
    "Cauchy-Heiny",
    "Tips-Unit3",
  ];

  useEffect(() => {}, [selectedFolder]);

  const newFolderHandler = (folderName) => {
    // if (user.userData && !user.userData.isAuth) {
    //   return alert("Please Log in first !");
    // }

    const variables = {
      name: folderName,
      blogs: [],
      writer: user.userData._id,
    };
    console.log("attemping to post from this route /api/blog/createFolder");
    dispatch(createFolder(variables));
  };

  //   //MAKE DELETE REQUEST FOR DELETING A CERTAIN FOLDER OR SUB FOLDER DIRECTLY FROM SIDER.
  const removeFolder = (folder) => {
    if (!folder._id) {
      //also validate if the user is logged in..
      return;
    }
    dispatch(deleteFolder(folder._id));
    // axios.delete(`/api/folder/deleteFolder/${folder._id}`).then((response) => {
    //   //delete method does not return a response.. How to fix?
    //   if (response.data.success) {
    //     console.log(response.data);
    //     message.success("Folder was deleted");
    //   } else {
    //     alert("problem deleting folder");
    //   }
    // });
    //I made a removed state and subscribed the useEffect to its changes, to update on remove
    // setRemovedFolders((prev) => {
    //   console.log(`prev`, prev);
    //   if (!prev) return;
    //   prev.push(folder);
    // });
  };
  const rootSubmenuKeys = [];

  const renderFolders = folders.map((folder, index) => {
    if (folder.writer) {
      rootSubmenuKeys.push(`sub${index + 1}`);
      return (
        <SubMenu
          key={`sub${index + 1}`}
          icon={
            collapsed ? (
              <TeamOutlined />
            ) : (
              <>
                {" "}
                <DeleteOutlined
                  onClick={() => {
                    //SETSTATE BELOW DOESNT WORK :(  !!!!
                    setSelectedFolder((prevSelected) => {
                      console.log(
                        `trying to change prev selected Folder :`,
                        prevSelected
                      );
                      return folders ? { ...folders[0] } : "No Folder";
                    });

                    removeFolder(folder);
                  }}
                />
                <DeleteOutlined />
              </>
            )
          }
          title={folder.name}
          onTitleClick={() => {
            console.log(`folder`, folder);
            setSelectedFolder(folder);
          }}
          onTitleMouseEnter={() => {
            console.log("show edit buttons");
          }}
        >
          {folder.blogs && renderSubMenu}
        </SubMenu>
      );
    }
  });

  function renderSubMenu(blogs) {
    if (!blogs) return;
    return blogs.map((blog, index) => {
      return (
        <Menu.Item
          key={index + 1}
          onClick={() => {
            console.log("load this blog.. setBlog(" + blog + ")");
            setBlog(blog);
          }}
        >
          {blog.name}
        </Menu.Item>
      );
    });
  }

  const rightClickMenu = (
    <Menu>
      <Menu.Item
        key="1"
        icon={<PlusSquareTwoTone />}
        onClick={() => {
          setShowFolderInput((prev) => {
            return !prev;
          });
        }}
      >
        Add New Folder
      </Menu.Item>
    </Menu>
  );

  // submenu keys of first level

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!folders.length ? (
        <Spin
          style={{
            margin: "auto",
            position: "absolute",
            left: "50%",
            top: "50%",
          }}
          indicator={
            <LoadingOutlined style={{ fontSize: 40 }} spin></LoadingOutlined>
          }
        />
      ) : (
        <Dropdown overlay={rightClickMenu} trigger={["contextMenu"]}>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={() => {
              setCollapsed(!collapsed);
            }}
          >
            <div className="logo" />
            <Menu
              theme="dark"
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              mode="inline"
            >
              {renderFolders}
              {showFolderInput && (
                <Input
                  onPressEnter={(e) => {
                    if (typeof e.target.value !== "string") {
                      return;
                    }
                    newFolderHandler(e.target.value);
                    setShowFolderInput((prev) => {
                      return !prev;
                    });
                  }}
                  placeholder="New folder.."
                />
              )}
            </Menu>
          </Sider>
        </Dropdown>
      )}
      <Layout>
        {selectedFolder && (
          <Content>
            {/* <Title level={2}>Blog Lists</Title> */}
            <Row justify="space-around" gutter={[32, 16]}>
              {/* {renderCards} */}

              <Button danger icon={<PlusSquareTwoTone />}>
                Add Blog to {selectedFolder.name}
              </Button>
              {selectedFolder.name}
              {selectedFolder.blogs}
              {selectedFolder.createdAt}
            </Row>
          </Content>
        )}
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}
