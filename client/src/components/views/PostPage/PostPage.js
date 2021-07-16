import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Section from "./Sections/NoteSection/Section.js";
import PostHeader from "./Sections/PostHeader";
import { Card, Avatar, Col, Typography, Row, Button, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const { Text } = Typography;

function PostPage(props) {
  // PostPage is called in app.js in its own route component like this:
  //<Route exact path={./this files location} component ={PostPage}></Route>
  //https://reactrouter.com/web/api/Route/component
  // Now this component has access to all the route props (match, location and history).

  const { postId } = useParams();
  const posts = useSelector((state) => state.posts);
  const initPost = posts.find((post) => {
    return post._id == postId;
  });
  const [post, setPost] = useState(initPost);
  const [sections, setSections] = useState([]);

  const container = useRef(initPost);
  
  useEffect(() => {
    if (props) {
      setPost(() => {
        return posts.find((post) => {
          return post._id == postId;
        });
      });
    }
  }, [props, posts]);
  //to make child rerender on change in parent, we will pass parent props to child
  //and put [props] as the childs useEffect dependency

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

        {post.sections.map((section, index, sections) => {
          return (
            <Section
              key={section._id}
              section={section}
              sectionsLength={sections.length}
              postId={post._id}
              index={index}
            ></Section>
          );
        })}
      </div>
    );
  } else {
    return <div style={{ width: "80%", margin: "3rem auto" }}>loading..</div>;
  }
}

export default PostPage;
