import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import NoteCard from "./NoteCard";
import { List, Avatar, Col, Typography, Row, Button, Tooltip } from "antd";
import axios from "axios";
import {
  DeleteColumnOutlined,
  PlayCircleFilled,
  PlusCircleFilled,
  PlusSquareTwoTone,
} from "@ant-design/icons";
import {
  createListInSection,
  removeListFromSection,
  setListTitle,
} from "../../../../_actions/post_actions";
import { createCardInList } from "../../../../_actions/post_actions";
const { Text } = Typography;

export default function NoteList(props) {
  const { postId, sectionId, index, listsLength } = props;
  const [list, setList] = useState(props.list);
  const dispatch = useDispatch();
  // const [cards, setCards] = useState(list.cards ? list.cards : []);
  // const [cardCount, setCardCount] = useState(cards.length);
  const [isShown, setIsShown] = useState(true);
  const [editableStr, setEditableStr] = useState(list.title);

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

  const handleListTitle = (newTitle) => {
    const variables = {
      postId,
      sectionId,
      listId: list._id,
      newTitle,
    };
    dispatch(setListTitle(variables));
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

  return (
    isShown && (
      <List
        bordered={true}
        style={{
          margin: "0 10px",
          marginBottom: "10px",
          backgroundColor: "rgba(255,255,255, 0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem 0",
          }}
        >
          <Text
            style={{
              fontSize: "20px",
              minWidth: "150px",
              color: "black",
              fontWeight: "bold",
              backgroundColor: "rgba(255,255,255, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 1rem",
              borderRadius: "5px",
            }}
            editable={{
              onChange: (e) => {
                setEditableStr(e);
                handleListTitle(e);
              },
            }}
          >
            {editableStr}
          </Text>

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

        {list.cards.map((card, index, cards) => {
          return (
            <NoteCard
              key={index}
              listCardCount={cards.length}
              card={card}
              index={index}
              listId={list._id}
              sectionId={sectionId}
              postId={postId}
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
    )
  );
}
