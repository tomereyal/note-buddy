import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";

import SlateEditor from "../../../editor/SlateEditor";
import {
  createCardInList,
  removeCardFromList,
} from "../../../../_actions/post_actions";
import session from "express-session";

export default function NoteCard(props) {
  const dispatch = useDispatch();
  const { postId, sectionId, listId, index } = props;
  const [card, setCard] = useState(props.card ? props.card : {});
  const [isShown, setIsShown] = useState(true);
  const [isMenuShown, setIsMenuShown] = useState(false);
  const posts = useSelector((state) => state.posts);
  //removing the event listener when card unmounts..

  // console.log(
  //   `the problem is here... in NoteCard which doesnt seem to give slate the updated cards!
  //   NoteCard is receiving the updated cards arr but is not giving slateEditor the right one
  //   `
  // );
  useEffect(() => {
    //props will update and to update its children you can useState or
    //give the children below props.cards
    if (props.card) {
      setCard(props.card);
    }
  }, [props]);
  const createCard = () => {
    const variables = {
      postId,
      sectionId,
      listId,
      order: index,
      content: [],
      tags: [],
    };
    const cardVariables = {
      order: index,
      content: [],
      tags: [],
      postId,
      sectionId,
      listId,
    };
    const location = { postId, sectionId, listId };

    dispatch(createCardInList(variables));
  };

  const removeCard = () => {
    const variables = {
      postId,
      sectionId,
      listId,
      cardId: card._id,
    };
    dispatch(removeCardFromList(variables));
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
            onClick={() => {
              removeCard();
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
            // textAlign: "center",
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
          <Card
            bodyStyle={{ padding: "2px" }}
            style={{ width: "100%" }}
            hoverable={true}
            onMouseEnter={() => {
              setIsMenuShown(true);
            }}
            onMouseLeave={() => {
              setIsMenuShown(false);
            }}
          >
            <SlateEditor
              listCardCount={props.listCardCount}
              card={card}
              listId={listId}
              sectionId={sectionId}
              postId={postId}
              order={index}
              key={card._id}
              style={{ width: "100%" }}
              isMenuShown={isMenuShown}
            ></SlateEditor>
          </Card>
        </div>
      </Dropdown>
    )
  );
}
