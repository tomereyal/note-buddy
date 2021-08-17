import React, { useEffect, useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
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
import {
  Layout,
  Row,
  Typography,
  Menu,
  Button,
  Dropdown,
  Input,
  Spin,
  Collapse,
  Popconfirm,
  Popover,
} from "antd";
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
import CardsPage from "../CardsPage/CardsPage";

import { editFolder } from "../../../_actions/folder_actions";
const { DirectoryTree } = Tree;
const { Panel } = Collapse;
const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Paragraph } = Typography;

export default function FolderPage(props) {
  const folders = useSelector((state) => state.folders);
  const posts = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);
  console.log(`folders`, folders);
  const [content, setContent] = useState(null);
  const [collapsedKey, setCollapsedKey] = useState("1");
  const [newFolderName, setNewFolderName] = useState("");
  const [editableStr, setEditableStr] = useState(null);
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

  const newFolderHandler = (e) => {
    // if (user.userData && !user.userData.isAuth) {
    //   return alert("Please Log in first !");
    // }

    const variables = {
      name: newFolderName,
      blogs: [],
      card: [],
      writer: user.userData._id,
    };
    console.log("attemping to post from this route /api/blog/createFolder");
    dispatch(createFolder(variables));
    setNewFolderName("");
    setCollapsedKey("1");
  };

  const removeFolder = (folder) => {
    if (!folder._id) {
      //also validate if the user is logged in..
      return;
    }
    dispatch(deleteFolder(folder._id));
  };

  const changeFolderName = (folderId) => {
    return function (name) {
      const variables = { id: folderId, updates: { name } };

      dispatch(editFolder(variables));
    };
  };

  let treeData = folders.length
    ? folders.map((folder, index) => {
        return {
          key: folder._id,
          title: (
            <Paragraph
              style={{ display: "inline-block" }}
              editable={{
                icon: <EditOutlined style={{ fontSize: "12px" }} />,
                onChange: changeFolderName(folder._id),
                tooltip: false,
              }}
              onClick={(e) => {
                props.history.push(`${url}/${folder._id}`);
              }}
            >
              {folder.name}
            </Paragraph>
          ),
          icon: (
            <span>
              <Popconfirm
                placement="rightTop"
                title={"Delete Folder?"}
                onConfirm={() => {
                  props.history.push(`${url}`);
                  removeFolder(folder);
                }}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined
                  style={{ zindex: "5", color: "grey", fontSize: "12px" }}
                />
              </Popconfirm>
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
          style={{ width: "300px" }}
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

            <Collapse defaultActiveKey={[collapsedKey]}>
              <Panel showArrow={false} header={"Create New Folder"}>
                <Input
                  placeholder="press enter to add"
                  value={newFolderName}
                  onChange={(e) => {
                    setNewFolderName(e.target.value);
                  }}
                  allowClear
                  onPressEnter={newFolderHandler}
                />
              </Panel>
            </Collapse>
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
          <Route
            exact
            path={`${path}/cards/:folderId`}
            children={<CardsPage />}
          ></Route>
        </Switch>
      </Layout>
    </Layout>
  );
}
