import React, { useEffect, useState, useRef, Component } from "react";
import axios from "axios";
import Section from "./Sections/Section";
import PostHeader from "./Sections/PostHeader";
import { Col, Typography, Row, Tooltip, Button, Tabs } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSectionInPost } from "../../../_actions/post_actions";
import { fetchPost } from "../../../api";
import PartsSection from "./PartsSection";
import DerivativesSection from "./ChainsSection";
import ChainsSection from "./ChainsSection";
const { TabPane } = Tabs;
const { Text } = Typography;

function PostPage(props) {
  // PostPage is called in app.js in its own route component like this:
  //<Route exact path={./this files location} component ={PostPage}></Route>
  //https://reactrouter.com/web/api/Route/component
  // Now this component has access to all the route props (match, location and history).

  const { postId } = useParams();
  console.log(`postId`, postId);
  const posts = useSelector((state) => state.posts);
  const [post, setPost] = useState(null);
  const [sections, setSections] = useState([]);
  const dispatch = useDispatch();
  const getPostFromServer = async () => {
    const { data } = await fetchPost(postId);
    const { post: fetchedPost } = data;
    setPost(fetchedPost);
  };
  useEffect(() => {
    if (!post || post._id !== postId) {
      getPostFromServer();
      // console.log(`initialPanes from useEffect`, initialPanes);
      // setTabState({ ...tabState, panes: initialPanes });
    }
    //posts intially is an empty array, and it seems there is not immediate access to it on refresh
  }, [props, post]);
  //to make child rerender on change in parent, we will pass parent props to child
  //and put [props] as the childs useEffect dependency

  console.log(`post`, post);
  const newTabIndex = 0;
  const [activeKey, setActiveKey] = useState("1");

  const onChange = (activeKey) => {
    setActiveKey(activeKey);
  };

  // const onEdit = (targetKey, action) => {
  //   console.log(`action`, action);
  //   switch (action) {
  //     case "add":
  //       add();
  //       break;
  //     case "remove":
  //       remove(targetKey);
  //       break;

  //     default:
  //       break;
  //   }
  //   // this[action](targetKey);
  // };

  // const add = () => {
  //   const { panes } = tabState;
  //   const newActiveKey = `newTab${newTabIndex + 1}`;
  //   const newPanes = [...panes];
  //   newPanes.push({
  //     title: "New",
  //     content: "Content of new Tab",
  //     key: newActiveKey,
  //   });
  //   setTabState({
  //     panes: newPanes,
  //     activeKey: newActiveKey,
  //   });
  // };

  // const remove = (targetKey) => {
  //   const { panes, activeKey } = tabState;
  //   let newActiveKey = activeKey;
  //   let lastIndex;
  //   panes.forEach((pane, i) => {
  //     if (pane.key === targetKey) {
  //       lastIndex = i - 1;
  //     }
  //   });
  //   const newPanes = panes.filter((pane) => pane.key !== targetKey);
  //   if (newPanes.length && newActiveKey === targetKey) {
  //     if (lastIndex >= 0) {
  //       newActiveKey = newPanes[lastIndex].key;
  //     } else {
  //       newActiveKey = newPanes[0].key;
  //     }
  //   }
  //   setTabState({
  //     panes: newPanes,
  //     activeKey: newActiveKey,
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
        key={post._id + "postPage"}
        style={{ width: "80%", margin: "1rem auto" }}
      >
        <PostHeader key={post._id} post={post}></PostHeader>
        <Tabs
          key={"tabs" + post._id}
          type="editable-card"
          onChange={onChange}
          activeKey={activeKey}
          // onEdit={onEdit}
        >
          <TabPane tab={<span>Chains</span>} key={"1"}>
            <ChainsSection post={post} getPostFromServer={getPostFromServer} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <img
                  height="20px"
                  width="20px"
                  src={
                    "https://img-premium.flaticon.com/svg/3534/3534076.svg?token=exp=1627468788~hmac=3908e9ef7a96c1961b81758402c60cfc"
                  }
                />
                E.g
              </span>
            }
            key={"2"}
          >
            "Examples Section ... reasons why each is considered a type of this
            object"
          </TabPane>
          <TabPane
            tab={
              <span>
                <img
                  height="20px"
                  width="20px"
                  src={
                    "https://img-premium.flaticon.com/svg/2784/2784530.svg?token=exp=1627468531~hmac=bf3960fd6660658841969e0cb9ebfede"
                  }
                />
                Q&A
              </span>
            }
            key={"3"}
          >
            "Questions and Answers Section"
          </TabPane>
          <TabPane
            tab={
              <span>
                <img
                  height="20px"
                  width="20px"
                  src={
                    "https://img-premium.flaticon.com/svg/3830/3830031.svg?token=exp=1627469019~hmac=a055410c99ce39b4cc11433a2bf095ba"
                  }
                />
                Interactions
              </span>
            }
            key={"4"}
          >
            Interactions section
          </TabPane>
          <TabPane
            tab={
              <span>
                <img
                  height="20px"
                  width="20px"
                  src={
                    "https:img-premium.flaticon.com/svg/1180/1180929.svg?token=exp=1627428466~hmac=8f028cff04afe241f5501e0885d65b8c"
                  }
                />
                Parts
              </span>
            }
            key={"5"}
          >
            <PartsSection post={post}></PartsSection>
          </TabPane>
        </Tabs>

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
