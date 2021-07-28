import React, { useEffect, useState, useRef, Component } from "react";
import axios from "axios";
import Section from "./Sections/Section";
import PostHeader from "./Sections/PostHeader";
import PostComponent from "./Sections/PostComponent.js";
import { Col, Typography, Row, Tooltip, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSectionInPost } from "../../../_actions/post_actions";

const { Text } = Typography;

function PostPage(props) {
  // PostPage is called in app.js in its own route component like this:
  //<Route exact path={./this files location} component ={PostPage}></Route>
  //https://reactrouter.com/web/api/Route/component
  // Now this component has access to all the route props (match, location and history).

  const { postId } = useParams();
  console.log(`postId`, postId);
  const posts = useSelector((state) => state.posts);
  const initPost = posts.find((post) => {
    return post._id === postId;
  });

  console.log(`posts`, posts);
  const [post, setPost] = useState(initPost);
  const [sections, setSections] = useState([]);
  const container = useRef(initPost);
  const dispatch = useDispatch();
  useEffect(() => {
    if (posts.length) {
      setPost(() => {
        return posts.find((post) => {
          return post._id == postId;
        });
      });
    }
    console.log(`post`, post);

    //posts intially is an empty array, and it seems there is not immediate access to it on refresh
  }, [props, posts, post]);
  //to make child rerender on change in parent, we will pass parent props to child
  //and put [props] as the childs useEffect dependency

  // const createSection = () => {
  //   const variables = {
  //     inPost: post._id,
  //     title: "",
  //     order: sections.length,
  //   };
  //   axios.post("/api/blog/createSection", variables).then((response) => {
  //     console.log(response);
  //     console.log(response.data.sections);
  //     if (response.status == 200) {
  //       let newArr = response.data.sections;
  //       setSections((prevArr) => {
  //         return [...prevArr, newArr[newArr.length - 1]];
  //       });
  //     }
  //   });
  // };

  const createSection = () => {
    const variables = {
      name: `subject `,
      // backgroundColor,
      // backgroundPattern: pattern,
      order: sections.length + 1, //We will insert the new section beneath this one..
      postId,
    };
    console.log(`variables`, variables);
    dispatch(createSectionInPost(variables));
  };

  //IMPORTANT LESSON: WHEN USING REACT_ROUTER_DOM YOU MUST GIVE EACH CHILD A UNIQUE KEY FOR REACT TO WORK OPTIMALLY WITH NO BUGS

  if (post && post.writer) {
    return (
      <div
        className="postPage"
        style={{ width: "80%", margin: "1rem auto" }}
        ref={container}
      >
        <PostHeader
          key={post._id}
          post={post}
          container={container.current}
        ></PostHeader>

        {post.components?.length > 0 && (
          <>
            <Row justify="center">
              <Col>
                <h3 style={{ fontFamily: "monospace" }}>Components</h3>
              </Col>
            </Row>
            <Row>
              {post.components.map((component, index) => {
                return (
                  <Col key={component.name + index}>
                    <PostComponent
                      component={component}
                      parentPost={post}
                    ></PostComponent>
                  </Col>
                );
              })}
            </Row>
          </>
        )}

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

        <Row justify="center">
          <Col>
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
          </Col>
        </Row>
      </div>
    );
  } else {
    return <div style={{ width: "80%", margin: "3rem auto" }}>loading..</div>;
  }
}

export default PostPage;
