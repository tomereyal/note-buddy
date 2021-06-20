import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import {
  createPost,
  getPosts,
  deletePost,
} from "../../../_actions/post_actions";
import { addPostToFolder, getFolders,deletePostFromFolder } from "../../../_actions/folder_actions";
import { Button, Layout, Card, Avatar, Col, Typography, Row, Menu } from "antd";
import { createPostInServer } from "../../../api";
import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusSquareTwoTone,
  DeleteOutlined,
} from "@ant-design/icons";
import { useParams, Link } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;
const { Meta } = Card;

export default function PostsPage(props) {
  const folders = useSelector((state) => state.folders);
  const posts = useSelector((state) => state.posts);
  const { folderId } = useParams();

  const initFolder = folders.find((folder) => {
    return folder._id == folderId;
  });

  const [folder, setFolder] = useState(initFolder ? initFolder : null);

  const user = useSelector((state) => state.user);
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

  const addPost = async () => {
    const postVariables = {
      writer: folder.writer,
      name: `Post-${folder.name}-${folder.blogs.length + 1}`,
    };
    const folderId = folder._id;
    const { data } = await createPostInServer(postVariables);
    const newPost = data.postInfo;
    dispatch(createPost(null, newPost));
    const postId = newPost._id;
    dispatch(addPostToFolder({ postId, folderId }));
  };

  const removePost = (blogId) => {
    if (!blogId) {
      //also validate if the user is logged in..
      return;
    }
    const postVariables = { folderId: folderId, postId: blogId };
    dispatch(deletePostFromFolder(postVariables))
    dispatch(deletePost(blogId));

  };

  const renderCards = folder
    ? folder.blogs.map((blog, index) => {
        if (blog.writer) {
          return (
            <Col key={index} lg={8} md={12} xs={24}>
              <Card
                hoverable
                style={{ width: 270, marginTop: 16 }}
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
                  avatar={<Avatar src={user.userData.image} />}
                  title={blog.name}
                  description="This is the description"
                />
                <div style={{ height: 70, marginTop: 10 }}>
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>
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
                <PlusSquareTwoTone
                  style={{ fontSize: "60px" }}
                  onClick={() => {
                    addPost();
                  }}
                />
                Add
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    )
  );
}
