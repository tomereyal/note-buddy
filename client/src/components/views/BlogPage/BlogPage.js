import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { getPosts } from "../../../_actions/post_actions";
import { Layout, Card, Avatar, Col, Typography, Row, Menu } from "antd";

import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

import SideNavBar from "./Sections/SideNavbar";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;
const { Meta } = Card;

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [removedBlogs, setRemovedBlogs] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const state = useSelector((state) => state);
  console.log(`state`, state);
  // onCollapse = (collapsed) => {
  //   console.log(collapsed);
  //   setCollapsed(!!collapsed);
  // };

  useEffect(() => {
    axios.get("api/blog/getBlogs").then((response) => {
      if (response.data.success) {
        console.log(response.data.blogs);
        setBlogs(response.data.blogs);
      } else {
        alert("couldn't get blogs' list ");
      }
    });
  }, [removedBlogs]);

  const removePost = (blogId) => {
    if (!blogId) {
      //also validate if the user is logged in..
      return;
    }
    console.log("hii");
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
            style={{ width: 370, marginTop: 16 }}
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  removePost(blog._id);
                }}
              />,
              <EditOutlined key="edit" />,
              <a href={`/blog/post/${blog._id}`}>
                <EllipsisOutlined key="ellipsis" />
              </a>,
            ]}
          >
            <Meta
              avatar={<Avatar src={blog.writer.image} />}
              title={blog.writer.name}
              description="This is the description"
            />
            <div style={{ height: 150, overflowY: "scroll", marginTop: 10 }}>
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
        {/* <Title level={2}>Blog Lists</Title> */}
        <Row justify="space-around" gutter={[32, 16]}>
          {renderCards}
        </Row>
      </Content>
    </Layout>
  );
}
