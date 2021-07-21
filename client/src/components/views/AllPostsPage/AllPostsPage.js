import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { getPosts, deletePost } from "../../../_actions/post_actions";
import {
  getFolders,
  deletePostFromFolder,
  createPostInFolder,
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

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;
const { Meta } = Card;

export default function AllPostsPage() {
  const posts = useSelector((state) => state.posts);

  const user = useSelector((state) => state.user);
  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  //   const addPost = async () => {
  //     const postVariables = {
  //       writer: folder.writer,
  //       name: `Post-${folder.name}-${folder.blogs.length + 1}`,
  //     };
  //     dispatch(createPostInFolder({ postVariables, folderId }));
  //     dispatch(getPosts());
  //   };

  const removePost = (blogId) => {
    if (!blogId) {
      //also validate if the user is logged in..
      return;
    }
    //   const postVariables = { folderId: folderId, postId: blogId };
    //   dispatch(deletePostFromFolder(postVariables));
    dispatch(deletePost(blogId));
  };

  const renderCards = posts.map((blog, index) => {
    if (blog.name) {
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
    <Layout>
      <Content>
        <div style={{ width: "80%", margin: "1rem auto" }}>
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
                  //   addPost();
                }}
              />
              Add
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}
