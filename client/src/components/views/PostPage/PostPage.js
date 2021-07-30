import React, { useEffect, useState, useRef, Component } from "react";
import axios from "axios";
import Section from "./Sections/Section";
import PostHeader from "./Sections/PostHeader";
import { Col, Typography, Row, Tooltip, Button, Tabs } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSectionInPost } from "../../../_actions/post_actions";
import PartsSection from "./PartsSection";
import DerivativesSection from "./DerivativesSection";
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

  const initialPanes = [
    {
      title: (
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
      ),
      content: <PartsSection post={post}></PartsSection>,
      key: "1",
    },
    {
      title: (
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
      ),
      content:
        "Examples Section ... reasons why each is considered a type of this object",
      key: "2",
    },
    {
      title: (
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
      ),
      content: "Questions and Answers Section",
      key: "3",
    },
    {
      title: (
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
      ),
      content: "Interactions Section",
      key: "4",
    },
    {
      title: <span>Derivatives</span>,
      content: <DerivativesSection post={post} />,
      key: "5",
    },
  ];

  const newTabIndex = 0;
  const [tabState, setTabState] = useState({
    activeKey: initialPanes[0].key,
    panes: initialPanes,
  });

  const onChange = (activeKey) => {
    setTabState({ ...tabState, activeKey });
  };

  const onEdit = (targetKey, action) => {
    console.log(`action`, action);
    switch (action) {
      case "add":
        add();
        break;
      case "remove":
        remove(targetKey);
        break;

      default:
        break;
    }
    // this[action](targetKey);
  };

  const add = () => {
    const { panes } = tabState;
    const newActiveKey = `newTab${newTabIndex + 1}`;
    const newPanes = [...panes];
    newPanes.push({
      title: "New",
      content: "Content of new Tab",
      key: newActiveKey,
    });
    setTabState({
      panes: newPanes,
      activeKey: newActiveKey,
    });
  };

  const remove = (targetKey) => {
    const { panes, activeKey } = tabState;
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setTabState({
      panes: newPanes,
      activeKey: newActiveKey,
    });
  };

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
        <Tabs
          type="editable-card"
          onChange={onChange}
          activeKey={tabState.activeKey}
          onEdit={onEdit}
        >
          {tabState?.panes.map((pane) => (
            <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
              {pane.content}
            </TabPane>
          ))}
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
