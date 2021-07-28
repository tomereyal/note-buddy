import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { editNote } from "../../../../_actions/card_actions";
import SlateEditor from "../../../editor/SlateEditor";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
import TextEditor from "../../../editor/TextEditor";
import { Steps, StepProps } from "antd";
import session from "express-session";

const { Step } = Steps;
export default function NoteSingleStep({
  card: initialCard,
  index,
  listCardCount,
  ...StepProps
}) {
  const dispatch = useDispatch();
  const [card, setCard] = useState(initialCard ? initialCard : {});
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
    if (card) {
      setCard(card);
    }
  }, [card]);
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
      <Step
        title={
          <TitleEditor
            title={title}
            setTitle={setTitle}
            name={name}
            setName={setName}
            bgc={"#ffffff"}
            darkenBgc={true}
            size={4}
          />
        }
        subTitle={
          <div
            style={{
              // textAlign: "center",
              minHeight: "50px",
              // minWidth: "100%",

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
              style={{ width: "100%", minWidth: "100px" }}
              hoverable={true}
              onMouseEnter={() => {
                setIsCardHovered(true);
              }}
              onMouseLeave={() => {
                setIsCardHovered(false);
              }}
            >
              <SlateEditor
                card={card}
                key={card._id}
                style={{ width: "100%" }}
                setContent={setContent}
                content={content}
              ></SlateEditor>
            </Card>
          </div>
        }
        {...StepProps}
      ></Step>
    )
  );
}
