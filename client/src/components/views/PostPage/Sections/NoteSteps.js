import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import NoteCard from "./NoteCard";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
import ContainerWithMenu from "../../BasicComponents/ContainerWithMenu";
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
  ArrowDownOutlined,
  ArrowRightOutlined,
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
  const { title: initialTitle, name: initialName } = list;
  const [title, setTitle] = useState(initialTitle);
  const [name, setName] = useState(initialName);
  const [direction, setDirection] = useState("horizontal");
  useEffect(() => {
    setList(props.list);
    console.log(`list`, list);
  }, [props, listsLength]);

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

  const customDot = (dot, { status, title, description, index }) => (
    <Popover content={<span>step {index + 1}</span>}>
      <Button
        default
        size={4}
        shape="circle"
        style={{ transform: `translateY(-10px)` }}
        icon={<span>{index + 1}</span>}
      />
    </Popover>
  );

  const menu = (
    <div>
      <Tooltip title="Change steps view">
        <Button
          shape="circle"
          icon={
            direction === "vertical" ? (
              <ArrowDownOutlined />
            ) : (
              <ArrowRightOutlined />
            )
          }
          onClick={() => {
            setDirection((prev) => {
              return prev === "horizontal" ? "vertical" : "horizontal";
            });
          }}
        />
      </Tooltip>
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
      <Tooltip title="Remove List">
        <Button
          shape="circle"
          icon={<span>X</span>}
          onClick={() => {
            removeList();
          }}
        />
      </Tooltip>
    </div>
  );

  return (
    <>
      <ContainerWithMenu
        menu={menu}
        key={"steps" + list._id}
        onDoubleClick={(e) => {
          createCard();
        }}
      >
        <Row
          justify="center"
          style={{
            padding: "1rem 0",
          }}
        >
          <Col
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
          </Col>
        </Row>

        <Steps
          style={{
            margin: "0 3px",
            padding: "0 1rem",
            marginBottom: "10px",
          }}
          progressDot={customDot}
          direction={direction}
          current={list.cards.length}
        >
          {/* {list.cards.map((card, index, cards) => {
            return (
              <NoteSingleStep
                key={index + card._id}
                card={card}
                // status={"progess"}
                listCardCount={cards.length}
                index={index}
                direction={direction}
                // setList={setList}
              ></NoteSingleStep>
            );
          })} */}
        </Steps>
      </ContainerWithMenu>
    </>
  );
}
