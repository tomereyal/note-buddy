import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import NoteCard from "./NoteCard";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
import { List, Avatar, Col, Typography, Row, Button, Tooltip } from "antd";
import axios from "axios";
import ContainerWithMenu from "../../BasicComponents/ContainerWithMenu";

import {
  DeleteColumnOutlined,
  PlayCircleFilled,
  PlusCircleFilled,
  PlusSquareTwoTone,
} from "@ant-design/icons";
import {
  createListInSection,
  editList,
  removeListFromSection,
} from "../../../../_actions/post_actions";
import { createCardInList } from "../../../../_actions/post_actions";
import { fetchPost } from "../../../../api";
const { Text } = Typography;

export default function NoteList(props) {
  const { postId, sectionId, index, listsLength } = props;
  const [list, setList] = useState(props.list);
  const dispatch = useDispatch();
  // const [cards, setCards] = useState(list.cards ? list.cards : []);
  // const [cardCount, setCardCount] = useState(cards.length);

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

  const menu = (
    <div>
      {/* <Tooltip title="Add List">
        <Button
          type="primary"
          shape="circle"
          icon={<PlusSquareTwoTone />}
          onClick={() => {
            createList();
          }}
        />
      </Tooltip> */}
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
    <ContainerWithMenu menu={menu}>
      <List
        onDoubleClick={() => {
          createCard();
        }}
        bordered={true}
        style={{
          margin: "0 3px",
          padding: "0 1rem",
          marginBottom: "10px",
        }}
      >
        <Row
          style={{
            padding: "1rem 0",
          }}
          justify="center"
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

        {list.cards.map((card, index, cards) => {
          return (
            <NoteCard
              key={index}
              listCardCount={cards.length}
              card={card}
              index={index}
              setList={setList}
            ></NoteCard>
          );
        })}
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
      </List>
    </ContainerWithMenu>
  );
}
