import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteList from "./NoteList";
import NoteFlow from "./NoteFlow/NoteFlow";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
import ColorMenu from "./ColorMenu";
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
  createListInSection,
  createSectionInPost,
  editSection,
  removeSectionFromPost,
} from "../../../../_actions/post_actions";
import { css } from "@emotion/css";
import NoteSteps from "./NoteSteps";
const { Text } = Typography;
//Section will make an axious get request to get his lists..

export default function Section(props) {
  const { postId, sectionsLength, index } = props;
  const [section, setSection] = useState(props.section);
  const [pattern, setPattern] = useState(section.backgroundPattern);
  const { title: initialTitle, name: initialName } = section;
  const [title, setTitle] = useState(initialTitle);
  const [name, setName] = useState(initialName);
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
      name: `new section ${sectionsLength + 1}`,
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

  const createList = ({ type }) => {
    const variables = {
      postId: postId,
      sectionId: sectionId,
      order: section?.lists?.length || 1,
      cards: [],
      type,
    };
    dispatch(createListInSection(variables));
  };

  const saveSection = () => {
    const variables = {
      postId,
      sectionId: section._id,
      editArr: [
        { editType: "title", editValue: title },
        { editType: "name", editValue: name },
      ],
    };
    dispatch(editSection(variables));
  };

  return (
    showComponent && (
      <Row
        className={css`
          background-color: ${backgroundColor};
          ${pattern};
          padding: 0 20px;
        `}
      >
        <div
          style={{
            width: "100%",
            margin: "8px 3px 16px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
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
          <Tooltip title="Add LIST">
            <Button
              type="primary"
              onClick={() => {
                createList({ type: "LIST" });
              }}
            >
              add list
            </Button>
          </Tooltip>
          <Tooltip title="Add FLOW">
            <Button
              type="primary"
              onClick={() => {
                createList({ type: "FLOW" });
              }}
            >
              add Flow
            </Button>
          </Tooltip>
          <Tooltip title="Add steps">
            <Button
              type="primary"
              onClick={() => {
                createList({ type: "STEPS" });
              }}
            >
              add Steps
            </Button>
          </Tooltip>
        </div>
        <Divider>
          <div
            style={{
              display: "inline-flex",
              padding: "0 1rem",
              // margin: "2rem 0",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "rgba(0,0,0, 0.5)",
              borderRadius: "10px",
            }}
          >
            <div
              style={{ minWidth: "300px" }}
              onBlur={() => {
                saveSection();
              }}
            >
              {" "}
              <TitleEditor
                name={name}
                setName={setName}
                title={title}
                setTitle={setTitle}
                size={2}
              />{" "}
            </div>
          </div>
        </Divider>
        {/*-----------------------STEPS---------------------*/}
        {/* {section.lists.map((list, index, lists) => {
          return (
            // <Col span={8}>
            // <Col flex="auto" key={index}>
            <NoteSteps
              postId={postId}
              sectionId={props.section._id}
              listsLength={lists.length}
              list={list}
              key={list._id}
              index={index}
            ></NoteSteps>
            // </Col>
          );
        })} */}
        {/*-----------------------FLOW---------------------*/}
        <div style={{ height: 300, width: "100%" }}>
          {section.lists.map((list, index, lists) => {
            return (
              <NoteFlow
                postId={postId}
                sectionId={props.section._id}
                listsLength={lists.length}
                list={list}
                key={list._id}
                index={index}
              ></NoteFlow>
            );
          })}
        </div>

        {/*-----------------------LIST---------------------*/}
        {/* {section.lists.map((list, index, lists) => {  
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
        })} */}
      </Row>
    )
  );
}
