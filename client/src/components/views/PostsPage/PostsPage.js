import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { createPost, getPosts } from "../../../_actions/post_actions";
import { addPostToFolder } from "../../../_actions/folder_actions";
import { Button, Layout, Card, Avatar, Col, Typography, Row, Menu } from "antd";
import { createPostInServer } from "../../../api";
import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusSquareTwoTone,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;
const { Meta } = Card;

export default function PostsPage(props) {
  const [blogs, setBlogs] = useState([]);
  const [folder, setFolder] = useState(null);
  const [removedBlogs, setRemovedBlogs] = useState([]);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // useEffect(() => {
  //     axios.get("api/blog/getBlogs").then((response) => {
  //       if (response.data.success) {
  //         console.log(response.data.blogs);
  //         setBlogs(response.data.blogs);
  //       } else {
  //         alert("couldn't get blogs' list ");
  //       }
  //     });
  //   }, [removedBlogs]);
  useEffect(() => {
    setFolder(props.folder);
    setBlogs(props.folder.blogs);
  }, [props]);

  const addPost = async () => {
    const postVariables = {
      writer: folder.writer,
      name: `Post-${folder.name}-${folder.blogs.length}`,
    };

    const folderId = folder._id;
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

  const removePost = (blogId) => {
    if (!blogId) {
      //also validate if the user is logged in..
      return;
    }
    axios.delete(`/api/blog/deletePost/${blogId}`).then((response) => {
      //delete method does not return a response.. How to fix?
      if (response.data.success) {
        console.log(response.data);
      } else {
        alert("problem deleting post");
      }
    });
    //I made a removed state and subscribed the useEffect to its changes, to update on remove
    setRemovedBlogs(() => {
      if (!removedBlogs) return;
      removedBlogs.push(blogId);
    });
  };

  const renderCards = blogs.map((blog, index) => {
    if (blog.writer) {
      return (
        <Col key={index} lg={8} md={12} xs={24}>
          <Card
            hoverable
            style={{ width: 300, marginTop: 16 }}
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  removePost(blog._id);
                }}
              />,
              <EditOutlined key="edit" />,
              <a href={`/post/${blog._id}`}>
                <EllipsisOutlined key="ellipsis" />
              </a>,
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
  });

  return (
    folder && (
      <Layout>
        <Content>
          {/* <Title level={2}>Blog Lists</Title> */}
          <Row justify="space-around" gutter={[32, 16]}>
            {renderCards}
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
        </Content>
      </Layout>
    )
  );
}
