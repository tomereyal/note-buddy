import React, { useState, useEffect } from "react";
import { Button, Card, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { editNote } from "../../../../_actions/card_actions";
import SlateEditor from "../../../editor/SlateEditor";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
import { removeCardFromList } from "../../../../_actions/post_actions";
import { DeleteFilled } from "@ant-design/icons";

export default function NoteCard({
  card: initialCard,
  withTitle = true,
  index,
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

  const removeCard = () => {
    const variables = cardData;
    dispatch(removeCardFromList(variables));
  };
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
  }, [card, index]);
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
      <div
        style={{
          minHeight: "50px",
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
        <Tooltip title="Remove Note">
          <Button
            type="danger"
            shape="circle"
            size="small"
            icon={<DeleteFilled />}
            onClick={() => {
              removeCard();
            }}
          />
        </Tooltip>
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
          {withTitle && (
            <TitleEditor
              title={title}
              setTitle={setTitle}
              name={name}
              setName={setName}
              bgc={"#ffffff"}
              darkenBgc={true}
              size={4}
            />
          )}
          <SlateEditor
            card={card}
            key={card._id}
            style={{ width: "100%" }}
            setContent={setContent}
            content={content}
          ></SlateEditor>
        </Card>
      </div>
    )
  );
}
