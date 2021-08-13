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
  Menu,
  Dropdown,
} from "antd";
import {
  DeleteOutlined,
  PlusSquareTwoTone,
  PlusCircleOutlined,
  DeleteRowOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  createCardInList,
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

  const removeSection = () => {
    // if (sectionsLength <= 1) {
    //   alert("A blog must contain atleast 1 section");
    //   return;
    // }
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

  const menu = (
    <Menu>
      <Menu.Item key="1">
        {" "}
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
      </Menu.Item>
      <Menu.Item key="2">
        <Tooltip title="Add CHEATSHEET">
          <Button
            type="primary"
            onClick={() => {
              createList({ type: "LIST" });
            }}
          >
            add cheat-sheet
          </Button>
        </Tooltip>
      </Menu.Item>
      <Menu.Item key="4">
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
      </Menu.Item>
      <Menu.Item key="5">
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
      </Menu.Item>
      <Menu.Item key="6">
        {" "}
        <Tooltip title="Add card">
          <Button
            type="primary"
            // onClick={() => {
            //  createcard
            // }}
          >
            add Card
          </Button>
        </Tooltip>
      </Menu.Item>
    </Menu>
  );

  const addEdgeToDB = ({ listId, postId, sectionId }) => {
    return async ({ target, source }) => {
      const variables = {
        postId,
        sectionId,
        listId,
        flowData: {
          type: "EDGE",
          source,
          target,
        },
      };

      dispatch(createCardInList(variables));
    };
  };

  const childSwitchRenderer = (list, index, lists) => {
    const { type } = list;
    switch (type) {
      case "LIST":
        return (
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
        break;
      case "STEPS":
        return (
          <Col flex="auto" key={index}>
            <NoteSteps
              postId={postId}
              sectionId={props.section._id}
              listsLength={lists.length}
              list={list}
              key={list._id}
              index={index}
            ></NoteSteps>
          </Col>
        );
        break;
      case "FLOW":
        return (
          <Col flex="auto" key={index}>
            <NoteFlow
              postId={postId}
              sectionId={props.section._id}
              listsLength={lists.length}
              list={list}
              key={list._id}
              index={index}
            ></NoteFlow>
          </Col>
        );
        break;

      default:
        return (
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
        break;
    }
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
          <Dropdown overlay={menu}>
            <Button
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              Add To Section <DownOutlined />
            </Button>
          </Dropdown>

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
              icon={<span>X</span>}
              onClick={() => {
                removeSection();
              }}
            />
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
            <Row
              justify="center"
              style={{ minWidth: "300px" }}
              onBlur={() => {
                saveSection();
              }}
            >
              <Col>
                <TitleEditor
                  name={name}
                  bgc={backgroundColor}
                  setName={setName}
                  title={title}
                  setTitle={setTitle}
                  size={2}
                />
              </Col>
            </Row>
          </div>
        </Divider>

        {/*-----------------------CHILDREN---------------------*/}

        {section.lists.map((list, index, lists) => {
          return childSwitchRenderer(list, index, lists);
        })}
      </Row>
    )
  );
}
