import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import NoteCard from "./NoteCard";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
import {
  Steps,
  Avatar,
  Col,
  Typography,
  Row,
  Button,
  Tooltip,
  Popover,
} from "antd";
import axios from "axios";
import {
  DeleteColumnOutlined,
  PlusCircleFilled,
  PlusSquareTwoTone,
} from "@ant-design/icons";
import {
  createListInSection,
  editList,
  removeListFromSection,
} from "../../../../_actions/post_actions";
import { createCardInList } from "../../../../_actions/post_actions";
import NoteSingleStep from "./NoteSingleStep";
const { Text } = Typography;
const { Step } = Steps;

export default function NoteSteps(props) {
  const { postId, sectionId, index, listsLength } = props;
  const [list, setList] = useState(props.list);
  const dispatch = useDispatch();
  const [isShown, setIsShown] = useState(true);

  const { title: initialTitle, name: initialName } = list;
  const [title, setTitle] = useState(initialTitle);
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setList(props.list);
  }, [props]);

  const createList = () => {
    if (listsLength >= 3) {
      alert("Max 3 lists per section");
      return;
    }
    const variables = {
      postId,
      sectionId,
      title: "new list",
      order: index + 1,
      cards: [],
    };
    dispatch(createListInSection(variables));
  };

  const removeList = () => {
    const variables = {
      postId,
      sectionId,
      listId: list._id,
    };
    dispatch(removeListFromSection(variables));
  };

  const saveList = () => {
    const variables = {
      postId,
      sectionId,
      listId: list._id,
      editArr: [
        { editType: "name", editValue: name },
        { editType: "title", editValue: title },
      ],
    };
    dispatch(editList(variables));
  };

  const createCard = () => {
    const variables = {
      postId,
      sectionId,
      listId: list._id,
      order: index,
      content: [],
      tags: [],
    };
    dispatch(createCardInList(variables));
  };

  const customDot = (dot, { status, index }) => (
    <Popover
      content={
        <span>
          step {index} status: {status}
        </span>
      }
    >
      {dot}
    </Popover>
  );

  return (
    isShown && (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem 0",
          }}
        >
          <div
            onBlur={() => {
              saveList();
            }}
          >
            <TitleEditor
              name={name}
              setName={setName}
              title={title}
              setTitle={setTitle}
              size={3}
            ></TitleEditor>
          </div>

          <Tooltip title="Add List">
            <Button
              type="primary"
              shape="circle"
              icon={<PlusSquareTwoTone />}
              onClick={() => {
                createList();
              }}
            />
          </Tooltip>
          <Tooltip title="Remove List">
            <Button
              type="danger"
              shape="circle"
              icon={<DeleteColumnOutlined />}
              onClick={() => {
                removeList();
              }}
            />
          </Tooltip>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem 0",
          }}
        >
          <Tooltip title="Add Card">
            <Button
              type="default"
              shape="circle"
              icon={<PlusCircleFilled />}
              onClick={() => {
                createCard();
              }}
            />
          </Tooltip>
        </div>

        <Steps
          style={{
            margin: "0 3px",
            padding: "0 1rem",
            marginBottom: "10px",
          }}
          progressDot={customDot}
        >
          {list.cards.map((card, index, cards) => {
            return (
              <NoteSingleStep
                key={index}
                card={card}
                status="Finished"
                listCardCount={cards.length}
                index={index}
                // setList={setList}
              ></NoteSingleStep>
            );
          })}
        </Steps>
      </>
    )
  );
}
