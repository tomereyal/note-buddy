import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import {
  createPost,
  getPosts,
  deletePost,
} from "../../../_actions/post_actions";
import {
  getFolders,
  deletePostFromFolder,
  createPostInFolder,
  addPostToFolder,
} from "../../../_actions/folder_actions";

import { Button, Layout, Card, Avatar, Col, Typography, Row, Menu } from "antd";
import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusSquareTwoTone,
  DeleteOutlined,
} from "@ant-design/icons";
import { useParams, Link } from "react-router-dom";
import CreatePostModule from "../CreatePostModule";
import TitleEditor from "../../editor/TitleEditor/TitleEditor";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;
const { Meta } = Card;

export default function PostsPage(props) {
  const folders = useSelector((state) => state.folders);
  const posts = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);

  const { folderId } = useParams();

  const initFolder = folders.find((folder) => {
    return folder._id == folderId;
  });

  const [folder, setFolder] = useState(initFolder ? initFolder : null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const history = useHistory();

  const dispatch = useDispatch();
  // const folderId = props.folder._id;

  useEffect(() => {
    if (!folders) {
      dispatch(getFolders());
    }
    if (folders.length >= 1 && !folder) {
      const folder_ = folders.find((folder) => {
        return folder._id == folderId;
      });
      setFolder(folder_);
    }
    if (folders.length >= 1 && folder) {
      const folder_ = folders.find((folder) => {
        return folder._id == folderId;
      });
      setFolder(folder_);
    }
  }, [folderId, folders, dispatch, folder, posts]);

  const removePost = (blogId) => {
    if (!blogId) {
      //also validate if the user is logged in..
      return;
    }
    const postVariables = { folderId: folderId, postId: blogId };
    dispatch(deletePostFromFolder(postVariables));
    dispatch(deletePost(blogId));
  };

  const addPost = async (variables) => {
    if (folder) {
      console.log(`variables`, variables);

      dispatch(createPostInFolder(variables));
      dispatch(getPosts());
      return;
    }

    if (!folder) {
      dispatch(createPost(variables.postVariables));
    }
  };

  const renderCards = folder
    ? folder.blogs.map((blog, index) => {
        if (blog) {
          return (
            <Col key={index} lg={8} md={12} xs={24}>
              <Card
                hoverable
                style={{ width: 270, marginTop: 16 }}
                onClick={() => {
                  console.log(`blog`, blog);
                }}
                onDoubleClick={() => {
                  history.push(`/post/${blog._id}`);
                }}
                actions={[
                  <DeleteOutlined
                    key="setting"
                    onClick={() => {
                      removePost(blog._id);
                    }}
                  />,
                  <EditOutlined key="edit" />,
                  <Link to={`/post/${blog._id}`}>
                    <EllipsisOutlined key="ellipsis" />
                  </Link>,
                ]}
              >
                <Meta
                  avatar={<Avatar src={blog.image} />}
                  title={
                    <TitleEditor
                      title={blog.title}
                      name={blog.name}
                      isReadOnly={true}
                    ></TitleEditor>
                  }
                  description={
                    <TitleEditor
                      title={blog.description}
                      isReadOnly={true}
                      size={5}
                    ></TitleEditor>
                  }
                />
              </Card>
            </Col>
          );
        }
      })
    : null;

  return (
    folder && (
      <Layout>
        <Content>
          <div style={{ width: "80%", margin: "1rem auto" }}>
            {/* <Title level={2}>Blog Lists</Title> */}
            <Row justify="space-around" gutter={[32, 16]}>
              {folder && renderCards}
              <Col
                lg={8}
                md={12}
                xs={24}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <CreatePostModule
                  folder={folder}
                  buttonElement={
                    <PlusSquareTwoTone style={{ fontSize: "60px" }} />
                  }
                  createPostFunction={addPost}
                />
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    )
  );
}
