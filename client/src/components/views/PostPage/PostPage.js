import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Section from "./Sections/Section";
import PostHeader from "./Sections/PostHeader";
import { Card, Avatar, Col, Typography, Row, Button, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Title } = Typography;

function PostPage(props) {
  // PostPage is called in app.js in its own route component like this:
  //<Route exact path={./this files location} component ={PostPage}></Route>
  //https://reactrouter.com/web/api/Route/component
  // Now this component has access to all the route props (match, location and history).

  const posts = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);
  // const post = posts.find((post) => post._id == postId);
  const [post, setPost] = useState(null);
  const [sections, setSections] = useState([]);
  const container = useRef(null);

  useEffect(() => {
    console.log(`I the child also rerendered`);
    if (props.match) {
      const postId = props.match.params.postId;

      if (!post && posts) {
        setPost(
          posts.find((post) => {
            return post._id == postId;
          })
        );
      }
    } else setPost({ ...props.post });

    console.log(`myPost`);
  }, [props]);
  //to make child rerender on change in parent, we will pass parent props to child
  //and put [props] as the childs eseEffect dependency

  console.log(`post`, post);
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
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <br />
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
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
        {post.sections.map((section, index) => {
          return (
            <Section
              key={index}
              section={section}
              post={post}
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
