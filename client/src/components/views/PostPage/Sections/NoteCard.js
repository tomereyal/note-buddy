import React, { useState } from "react";
import axios from "axios";
import {
  Avatar,
  Card,
  Menu,
  Typography,
  Button,
  Tooltip,
  Dropdown,
} from "antd";
import { DeleteFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";

import SlateEditor from "../../../editor/SlateEditor";

export default function NoteCard(props) {
  const [card, setCard] = useState(props.card ? props.card : {});
  const [isShown, setIsShown] = useState(true);

  //removing the event listener when card unmounts..

  const removeCard = (cardId) => {
    const variables = {
      postId: card.inPost,
      sectionId: card.inSection,
      listId: card.inList,
      cardId: cardId,
    };
    axios.post("/api/blog/removeCard", variables).then((response) => {
      if (response.status === 200) {
        const updatedList = response.data.sections
          .find((section) => section._id === card.inSection)
          .lists.find((list) => list._id === card.inList);
        console.log(updatedList);
        props.setList(updatedList);
      }
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        {" "}
        <Tooltip title="Remove Note">
          <Button
            type="danger"
            shape="circle"
            size="small"
            id={card._id}
            icon={<DeleteFilled />}
            onClick={({ target }) => {
              console.log(card._id);
              console.log(`target`, target.id);
              removeCard(target.id);
            }}
          />
        </Tooltip>
      </Menu.Item>
      <Menu.Item key="2">2</Menu.Item>
      <Menu.Item key="3">3</Menu.Item>
    </Menu>
  );

  return (
    isShown && (
      <Dropdown id={card._id} overlay={menu} trigger={["contextMenu"]}>
        <div
          style={{
            textAlign: "center",
            minHeight: "50px",
            minWidth: "100%",
            // backgroundColor: "lightblue",
          }}
          onDoubleClick={(e) => {
            console.log("focused");
          }}
          id={card._id}
        >
          {" "}
          <Card style={{ width: "100%" }} hoverable={true}>
            <SlateEditor card={card}></SlateEditor>
          </Card>
        </div>
      </Dropdown>
    )
  );
}
