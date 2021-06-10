import React, { useState, useEffect } from "react";
import NoteCard from "./NoteCard";
import { List, Avatar, Col, Typography, Row, Button, Tooltip } from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  PlayCircleFilled,
  PlusCircleFilled,
} from "@ant-design/icons";

export default function NoteList(props) {
  const [list, setList] = useState(props.list ? props.list : {});
  // const [cards, setCards] = useState(list.cards ? list.cards : []);
  // const [cardCount, setCardCount] = useState(cards.length);
  const [isShown, setIsShown] = useState(true);

  const createCard = () => {
    const variables = {
      postId: list.inPost,
      sectionId: list.inSection,
      listId: list._id,
      order: list.cards.length,
      content: null,
      tags: [],
    };
    axios.post("/api/blog/createCard", variables).then((response) => {
      console.log(response);
      if (response.status === 200) {
        const sections = response.data.sections;
        const thisSection = sections.find((el) => el._id === list.inSection);
        const thisList = thisSection.lists.find((el) => el._id === list._id);
        setList(thisList);
      }
    });
  };

  const removeList = () => {
    const variables = {
      postId: list.inPost,
      sectionId: list.inSection,
      listId: list._id,
    };
    axios.post("/api/blog/removeList", variables).then((response) => {
      console.log(response);
      if (response.status === 200) {
        setIsShown(false);
      }
    });
  };
  return (
    isShown && (
      <List
        bordered={true}
        // style={{ maxWidth: "300px" }}
      >
        <Tooltip title="Remove List">
          <Button
            type="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => {
              removeList();
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

        {list.cards.map((card, index) => {
          return (
            <NoteCard
              key={index}
              card={card}
              index={index}
              list={list}
              setList={setList}
            ></NoteCard>
          );
        })}
      </List>
    )
  );
}
