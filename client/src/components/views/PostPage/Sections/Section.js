import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteList from "./NoteList";
import {
  List,
  Card,
  Avatar,
  Col,
  Typography,
  Row,
  Button,
  Divider,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  PlusSquareTwoTone,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createSectionInPost } from "../../../../_actions/post_actions";

//Section will make an axious get request to get his lists..

export default function Section(props) {
  let initLists = props.section.lists ? props.section.lists : [];
  const [section, setSection] = useState({});
  const [post, setPost] = useState();
  const [lists, setLists] = useState(initLists);
  const [showComponent, setShowComponent] = useState(true);
  const dispatch = useDispatch();

  const sectionId = props.section._id;
  useEffect(() => {
    setPost(props.post);
  }, [props]);

  const createSection = () => {
    const variables = {
      title: "",
      order: props.index + 1, //We will insert the new section beneath this one..
      postId: post._id,
    };

    dispatch(createSectionInPost(variables));
  };

  const removeSection = () => {
    const variables = { postId: post._id, sectionId: sectionId };
    console.log(variables.postId + "-T-T-T-T" + variables.sectionId);
    axios.post("/api/blog/removeSection", variables).then((response) => {
      console.log(response.status);
      setShowComponent(false);
    });
  };

  const createList = () => {
    const variables = {
      postId: post._id,
      sectionId: sectionId,
      order: lists.length,
      cards: [],
    };
    axios.post("/api/blog/createList", variables).then((response) => {
      console.log(response);
      if (response.status === 200) {
        const sections = response.data.sections;
        const thisSection = sections.find(
          (section) => section._id === sectionId
        );
        setLists(thisSection.lists);
      }
    });
  };

  return (
    showComponent && (
      <Row>
        <Divider>
          Text{" "}
          <Tooltip title="Remove Section">
            <Button
              type="default"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => {
                removeSection();
              }}
            />
          </Tooltip>
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
          <Tooltip title="Add List">
            <Button
              type="primary"
              shape="circle"
              icon={<PlusSquareTwoTone />}
              onClick={() => {
                if (lists.length >= 3) {
                  alert("Max 3 lists per section");
                  return;
                }
                createList();
              }}
            />
          </Tooltip>
        </Divider>
        {lists.map((list, index) => {
          return (
            // <Col span={8}>
            <Col flex="auto" key={index}>
              <NoteList list={list} key={index}></NoteList>
            </Col>
          );
        })}
      </Row>
    )
  );
}
