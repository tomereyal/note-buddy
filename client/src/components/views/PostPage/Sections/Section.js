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
import { DeleteOutlined, PlusSquareTwoTone } from "@ant-design/icons";
//Section will make an axious get request to get his lists..

export default function Section(props) {
  let initLists = props.section.lists ? props.section.lists : [];
  const [section, setSection] = useState({});
  const [lists, setLists] = useState(initLists);
  const [showComponent, setShowComponent] = useState(true);

  const sectionId = props.section._id;
  const postId = props.section.inPost;

  // useEffect(() => {

  //   const variables = { postId: postId, sectionId: sectionId };

  //   axios.post("/api/blog/getSection", variables).then((response) => {
  //     if (response.data.post) {
  //       if (response.data.post) {
  //         setSection(
  //           response.data.post.sections.find(
  //             (section) => (section._id = sectionId)
  //           )
  //         );
  //         setLists(section.lists);
  //       }
  //     } else {
  //       alert("Error Retrieving Sections");
  //     }
  //   });
  // }, []);

  const removeSection = () => {
    const variables = { postId: postId, sectionId: sectionId };
    console.log(variables.postId + "-T-T-T-T" + variables.sectionId);
    axios.post("/api/blog/removeSection", variables).then((response) => {
      console.log(response.status);
      setShowComponent(false);
    });
  };

  const createList = () => {
    const variables = {
      postId: postId,
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
