import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Section from "./Sections/Section";
import PostHeader from "./Sections/PostHeader";
import { Card, Avatar, Col, Typography, Row, Button, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function PostPage(props) {
  // PostPage is called in app.js in its own route component like this:
  //<Route exact path={./this files location} component ={PostPage}></Route>
  //https://reactrouter.com/web/api/Route/component
  // Now this component has access to all the route props (match, location and history).
  const [post, setPost] = useState({});
  const [sections, setSections] = useState([]);
  // const parentRef = useRef(null);
  // console.log(`parentRef`, parentRef);
  const container = useRef(null);
  const postId = props.match.params.postId;

  useEffect(() => {
    /*Axios will post a request to the path "/api/blog/getPost"
    The express middleware will catch this request and find the "/api/blog/" usecase I wrote,
    then it will enter the blog.js module I wrote and try to find the "/getPost" usecase
    and its middleware function.
    */
    const variables = { postId: postId };

    axios.post("/api/blog/getPost", variables).then((response) => {
      if (response.data.post) {
        if (response.data.post) {
          setPost(response.data.post);
          setSections(response.data.post.sections);
        }
      } else {
        alert("Error Retrieving Post");
      }
    });
  }, []);

  const createSection = () => {
    const variables = {
      inPost: post._id,
      title: "",
      order: sections.length,
    };
    axios.post("/api/blog/createSection", variables).then((response) => {
      console.log(response);
      console.log(response.data.sections);
      if (response.status == 200) {
        let newArr = response.data.sections;
        setSections((prevArr) => {
          return [...prevArr, newArr[newArr.length - 1]];
        });
      }
    });
  };

  const testRef = () => {
    console.log(`container.current:`, container.current);
  };

  if (post && post.writer) {
    return (
      <div
        className="postPage"
        style={{ width: "80%", margin: "1rem auto" }}
        ref={container}
      >
        <PostHeader post={post} container={container.current}></PostHeader>

        {/* <Title level={2}>{post.writer.name}'s Post</Title>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Title level={4}>{post.createdAt}</Title>
          <br />
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div> */}
        <Tooltip title="Add Section">
          <Button
            type="primary"
            shape="circle"
            icon={<PlusCircleOutlined />}
            onClick={() => {
              createSection();
            }}
          />
        </Tooltip>
        {sections.map((section, index) => {
          return <Section key={index} section={section}></Section>;
        })}
      </div>
    );
  } else {
    return <div style={{ width: "80%", margin: "3rem auto" }}>loading..</div>;
  }
}
