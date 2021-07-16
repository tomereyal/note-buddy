import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { useDispatch, useSelector } from "react-redux";

import SlateEditor from "../../../editor/SlateEditor";
import session from "express-session";

export default function NoteCard(props) {
  const dispatch = useDispatch();
  const { index } = props;
  const [card, setCard] = useState(props.card ? props.card : {});
  const [isShown, setIsShown] = useState(true);
  const [isCardHovered, setIsCardHovered] = useState(false);
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
  
  return (
    isShown && (
      // <Dropdown id={card._id} overlay={menu} trigger={["contextMenu"]}>
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
        <Card
          bodyStyle={{ padding: "2px" }}
          style={{ width: "100%" }}
          hoverable={true}
          onMouseEnter={() => {
            setIsCardHovered(true);
          }}
          onMouseLeave={() => {
            setIsCardHovered(false);
          }}
        >
          <SlateEditor
            listCardCount={props.listCardCount}
            card={card}
            order={index}
            key={card._id}
            style={{ width: "100%" }}
            isCardHovered={isCardHovered}
          ></SlateEditor>
        </Card>
      </div>
      // </Dropdown>
    )
  );
}
