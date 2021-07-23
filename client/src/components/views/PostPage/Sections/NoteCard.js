import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { editNote } from "../../../../_actions/card_actions";
import SlateEditor from "../../../editor/SlateEditor";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
import session from "express-session";

export default function NoteCard(props) {
  const dispatch = useDispatch();
  const { index } = props;
  const [card, setCard] = useState(props.card ? props.card : {});
  const {
    location,
    _id,
    content: initialContent,
    title: initialTitle,
    name: initialName,
  } = card;
  const { post, section, list } = location;
  const cardData = {
    postId: post,
    sectionId: section,
    listId: list,
    cardId: _id,
  };
  const [title, setTitle] = useState(initialTitle);
  const [name, setName] = useState(initialName);
  const [content, setContent] = useState(initialContent);
  const [isShown, setIsShown] = useState(true);
  const [isCardHovered, setIsCardHovered] = useState(false);

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
  const saveNote = () => {
    if (!content) return;
    const updates = {
      content,
      title,
      name,
    };
    const variables = { id: card._id, updates };
    dispatch(editNote(variables));
  };

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
        onBlur={() => {
          console.log("card blurred so saving..");
          saveNote();
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
          <TitleEditor
            title={title}
            setTitle={setTitle}
            name={name}
            setName={setName}
            bgc={"#ffffff"}
            darkenBgc={true}
            size={4}
          />
          <SlateEditor
            listCardCount={props.listCardCount}
            card={card}
            order={index}
            key={card._id}
            style={{ width: "100%" }}
            isCardHovered={isCardHovered}
            setContent={setContent}
            content={content}
          ></SlateEditor>
        </Card>
      </div>
      // </Dropdown>
    )
  );
}
