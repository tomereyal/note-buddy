import React, { useEffect, useState } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  createFolder,
  deleteFolder,
  deletePostFromFolder,
  addPostToFolder,
} from "../../../_actions/folder_actions";

import {
  createPostInFolderApi,
  createPostInServer,
} from "../../../api/index.js";
import { FOLDER_SERVER } from "../../Config.js";
import { deletePost, createPost } from "../../../_actions/post_actions";
import FolderSubmenu from "./sections/FolderSubmenu";
import PostPage from "../PostPage/PostPage";
import Auth from "../../../hoc/auth";
import { Layout, Row, Menu, Button, Dropdown, Input, Spin } from "antd";

import {
  PlusSquareTwoTone,
  TeamOutlined,
  DeleteOutlined,
  LoadingOutlined,
  EditOutlined,
} from "@ant-design/icons";
import PostsPage from "../PostsPage/PostsPage";

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function FolderPage(props) {
  const [blog, setBlog] = useState({});
  const folders = useSelector((state) => state.folders);
  const posts = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);
  const [selectedFolder, setSelectedFolder] = useState(
    folders ? folders[0] : null
  );

  const [content, setContent] = useState(folders ? folders[0] : null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(`I rerendered`);
  }, [selectedFolder, selectedPost, content]);

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

  const removeFolder = (folder) => {
    if (!folder._id) {
      //also validate if the user is logged in..
      return;
    }
    dispatch(deleteFolder(folder._id));
  };

  const addPost = async () => {
    const postVariables = {
      writer: selectedFolder.writer,
      name: `Post-${selectedFolder.name}-${selectedFolder.blogs.length}`,
    };

    const folderId = selectedFolder._id;
    const { data } = await createPostInServer(postVariables);
    console.log(`data`, data);
    const newPost = data.postInfo;
    dispatch(createPost(null, newPost));

    dispatch(addPostToFolder({ post: newPost, folderId }));
    const postId = newPost._id;

    // setTimeout(() => {
    //   props.history.push(`/post/${postId}`);

    // }, 1000);
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
            //or should i use react router and reroute
            setSelectedFolder(folder);
            setContent(<PostsPage folder={folder} />);
          }}
          onTitleMouseEnter={() => {
            console.log("show edit buttons");
          }}
        >
          {folder.blogs &&
            folder.blogs.map((blog, blogIndex) => {
              return (
                <Menu.Item
                  key={`folder${index}sub${blogIndex}`}
                  title={blog.name}
                  onClick={() => {
                    console.log(`show blog:`, blog);
                    setSelectedPost(blog);

                    setContent(<PostPage post={blog} />);
                  }}
                  icon={
                    <EditOutlined
                      onClick={() => {
                        props.history.push(`/post/${blog._id}`);
                      }}
                    />
                  }
                >
                  <DeleteOutlined
                    onClick={() => {
                      const variables = {
                        postId: blog._id,
                        folderId: folder._id,
                      };
                      dispatch(deletePost(blog._id));
                      dispatch(deletePostFromFolder(variables));
                    }}
                  />
                  {blog.name}
                  {/* <a href={`/post/${blog._id}`}> {blog.name}</a> */}
                </Menu.Item>
              );
            })}
        </SubMenu>
      );
    }
  });

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
            theme="light"
            collapsible
            collapsed={collapsed}
            onCollapse={() => {
              setCollapsed(!collapsed);
            }}
          >
            <div className="logo" />
            <Menu
              theme="light"
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
      <Layout>{content}</Layout>
    </Layout>
  );
}
