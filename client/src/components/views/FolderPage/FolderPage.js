import React, { useEffect, useState } from "react";
import {
  Route,
  Switch,
  withRouter,
  Link,
  useRouteMatch,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  createFolder,
  deleteFolder,
  deletePostFromFolder,
  getFolders,
} from "../../../_actions/folder_actions";

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
  const folders = useSelector((state) => state.folders);
  const posts = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);

  const [content, setContent] = useState(null);

  const [showFolderInput, setShowFolderInput] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const dispatch = useDispatch();
  let { path, url } = useRouteMatch();

  useEffect(() => {
    dispatch(getFolders());
  }, [dispatch, posts]);

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

  const rootSubmenuKeys = [];

  const renderFolders = folders.map((folder, index) => {
    if (folder.writer) {
      rootSubmenuKeys.push(`sub${index + 1}`);
      return (
        <SubMenu
          key={`sub${index + 1}`}
          title={
            <>
              <span style={{ zindex: "5", color: "red" }}>
                {" "}
                <DeleteOutlined
                  style={{ zindex: "5", color: "red" }}
                  onClick={() => {
                    console.log(`hi`);
                    props.history.push(`${url}`);
                    removeFolder(folder);
                  }}
                />
              </span>
              <span
                onClick={(e) => {
                  e.preventDefault();

                  e.stopPropagation();
                  console.log(`bye`);
                  props.history.push(`${url}/${folder._id}`);
                }}
              >
                {" "}
                {folder.name}{" "}
              </span>{" "}
            </>
          }
          onTitleMouseEnter={() => {}}
        >
          {folder.blogs &&
            folder.blogs.map((blog, blogIndex) => {
              return (
                <Menu.Item
                  key={`folder${index}sub${blogIndex}`}
                  title={blog.name}
                  onClick={() => {
                    props.history.push(`${url}/post/${blog._id}`);
                    // props.history.push(`/folders/post/${blog._id}`);
                    // setContent(<PostPage postId={blog._id} />);
                  }}
                  icon={<EditOutlined onClick={() => {}} />}
                >
                  <DeleteOutlined
                    style={{ zindex: "5", color: "red" }}
                    onClick={(e) => {
                      // e.preventDefault();

                      const variables = {
                        postId: blog._id,
                        folderId: folder._id,
                      };
                      dispatch(deletePostFromFolder(variables));
                      dispatch(deletePost(blog._id));
                      setContent(<PostsPage folder={folder} />);
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
              {/* <Button>
                <Link to="/folders/apple">apple</Link>
              </Button> */}
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
        {/* <Apple></Apple> */}
        <Switch>
          <Route
            exact
            path={`${path}/post/:postId`}
            children={<PostPage />}
          ></Route>
          <Route
            exact
            path={`${path}/:folderId`}
            children={<PostsPage />}
          ></Route>
        </Switch>
      </Layout>
    </Layout>
  );
}
