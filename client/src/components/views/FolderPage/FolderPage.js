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
import TitleEditor from "../../editor/TitleEditor/TitleEditor";
import {
  PlusSquareTwoTone,
  TeamOutlined,
  DeleteOutlined,
  LoadingOutlined,
  EditOutlined,
  DownOutlined,
} from "@ant-design/icons";
import PostsPage from "../PostsPage/PostsPage";
import AllPostsPage from "../AllPostsPage/AllPostsPage";
import BlogSubmenu from "./sections/BlogSubmenu";
import { Tree } from "antd";

const { DirectoryTree } = Tree;

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function FolderPage(props) {
  const folders = useSelector((state) => state.folders);
  const posts = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);
  console.log(`folders`, folders);
  const [content, setContent] = useState(null);

  const [showFolderInput, setShowFolderInput] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const dispatch = useDispatch();
  let { path, url } = useRouteMatch();

  useEffect(() => {
    if (!folders.length) {
      dispatch(getFolders());
    }
  }, [dispatch, posts, folders]);

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

  // const onOpenChange = (keys) => {
  //   const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

  //   if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
  //     setOpenKeys(keys);
  //   } else {
  //     setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  //   }
  // };

  let treeData = folders.length
    ? folders.map((folder, index) => {
        return {
          title: (
            <span
              onClick={(e) => {
                props.history.push(`${url}/${folder._id}`);
              }}
              style={{ width: "100%", zIndex: 5 }}
            >
              {folder.name}
            </span>
          ),
          key: folder._id,
          icon: (
            <span>
              <DeleteOutlined
                style={{ zindex: "5", color: "red" }}
                onClick={() => {
                  props.history.push(`${url}`);
                  removeFolder(folder);
                }}
              />
            </span>
          ),
          children: folder.blogs.map((blog) => {
            return {
              title: (
                <BlogSubmenu
                  key={blog._id + "1"}
                  index={index}
                  blog={blog}
                  folderId={folder._id}
                  history={props.history}
                />
              ),
              key: blog._id,
            };
          }),
        };
      })
    : [];

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
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={() => {
            setCollapsed(!collapsed);
          }}
        >
          <div>
            <Tree
              showIcon
              defaultExpandAll
              defaultSelectedKeys={["0-0-0"]}
              switcherIcon={<DownOutlined />}
              treeData={treeData}
            />
            <div
              key={`sub0`}
              onClick={() => {
                props.history.push(`${path}/allPosts`);
              }}
            >
              All Posts
            </div>
          </div>
        </Sider>
      )}
      <Layout>
        <Switch>
          {/* the order matters.. error finding path of allPosts page when it is last */}
          <Route
            exact
            path={`${path}/allPosts`}
            children={<AllPostsPage />}
          ></Route>
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
