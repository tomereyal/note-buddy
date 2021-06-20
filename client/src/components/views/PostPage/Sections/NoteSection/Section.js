import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteList from "../NoteList";
import ColorMenu from "../ColorMenu";
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
  DeleteRowOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  createSectionInPost,
  setSectionTitle,
  removeSectionFromPost,
} from "../../../../../_actions/post_actions";
import { css } from "@emotion/css";
const { Text } = Typography;
//Section will make an axious get request to get his lists..

export default function Section(props) {
  const { postId, sectionsLength, index } = props;
  const [section, setSection] = useState(props.section);
  const [pattern, setPattern] = useState(section.backgroundPattern);
  const [editableStr, setEditableStr] = useState(section.title);
  const [backgroundColor, setBackgroundColor] = useState(
    section.backgroundColor
  );
  const [showComponent, setShowComponent] = useState(true);
  const dispatch = useDispatch();

  const sectionId = props.section._id;
  useEffect(() => {
    setSection(props.section);
  }, [props]);

  const createSection = () => {
    const variables = {
      title: `new section ${sectionsLength + 1}`,
      backgroundColor,
      backgroundPattern: pattern,
      order: props.index + 1, //We will insert the new section beneath this one..
      postId,
    };
    console.log(`variables`, variables);
    dispatch(createSectionInPost(variables));
  };

  const removeSection = () => {
    if (sectionsLength <= 1) {
      alert("A blog must contain atleast 1 section");
      return;
    }
    const variables = { postId, sectionId: section._id };
    dispatch(removeSectionFromPost(variables));
  };

  // const createList = () => {
  //   const variables = {
  //     postId: post._id,
  //     sectionId: sectionId,
  //     order: lists.length,
  //     cards: [],
  //   };
  //   axios.post("/api/blog/createList", variables).then((response) => {
  //     console.log(response);
  //     if (response.status === 200) {
  //       const sections = response.data.sections;
  //       const thisSection = sections.find(
  //         (section) => section._id === sectionId
  //       );
  //       setLists(thisSection.lists);
  //     }
  //   });
  // };

  const handleSectionTitle = (newTitle) => {
    const variables = {
      postId,
      sectionId: section._id,
      newTitle,
    };
    dispatch(setSectionTitle(variables));
  };

  return (
    showComponent && (
      <Row
        className={css`
          background-color: ${backgroundColor};
          ${pattern};
        `}
        // className={sectionBgc}
      >
        <Divider>
          <div
            style={{
              display: "inline-flex",
              padding: "0 1rem",
              margin: "2rem 0",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0, 0.5)",
              borderRadius: "10px",
            }}
          >
            <Text
              style={{ fontSize: "25px", minWidth: "150px", color: "white" }}
              editable={{
                onChange: (e) => {
                  setEditableStr(e);
                  handleSectionTitle(e);
                },
              }}
            >
              {editableStr}
            </Text>

            <ColorMenu
              setPattern={setPattern}
              setBackgroundColor={setBackgroundColor}
              postId={postId}
              sectionId={section._id}
            ></ColorMenu>
            <Tooltip title="Remove Section">
              <Button
                type="default"
                shape="circle"
                icon={<DeleteRowOutlined />}
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
          </div>
        </Divider>

        {section.lists.map((list, index, lists) => {
          return (
            // <Col span={8}>
            <Col flex="auto" key={index}>
              <NoteList
                postId={postId}
                sectionId={props.section._id}
                listsLength={lists.length}
                list={list}
                key={list._id}
                index={index}
              ></NoteList>
            </Col>
          );
        })}
      </Row>
    )
  );
}
