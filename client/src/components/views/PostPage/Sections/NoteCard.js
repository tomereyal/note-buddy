import React, { useState, useEffect } from "react";
import { Button, Card, Popconfirm, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteCard, editNote } from "../../../../_actions/card_actions";
import SlateEditor from "../../../editor/SlateEditor";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
import { removeCardFromList } from "../../../../_actions/post_actions";

import ContainerWithMenu from "../../BasicComponents/ContainerWithMenu";

export default function NoteCard({
  card: initialCard,
  withTitle = true,
  simpleStyle = false,
  index,
  onRemove = () => {
    console.log(`remove me`);
  },
}) {
  const dispatch = useDispatch();

  const [card, setCard] = useState(initialCard ? initialCard : {});
  const {
    location = {},
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
    console.log(`content`, content);
    const variables = { id: card._id, updates };
    dispatch(editNote(variables));
  };

  const menu = (
    <div>
      {" "}
      <Popconfirm
        placement="bottomRight"
        title={"Delete Card Permanently"}
        onConfirm={() => {
          onRemove();
        }}
        okText="Yes"
        cancelText="No"
      >
        <Tooltip title="Remove Note">
          <Button
            type="text"
            shape="circle"
            size="small"
            icon={<span>X</span>}
          />
        </Tooltip>
      </Popconfirm>
    </div>
  );

  return (
    <div
      key={"card" + card._id}
      style={{
        minHeight: "50px",
        position: "relative",
      }}
      onBlur={() => {
        console.log("m saving");
        saveNote();
      }}
    >
      <ContainerWithMenu menu={menu}>
        <Card
          bodyStyle={{ padding: "2px" }}
          style={{ width: "100%" }}
          hoverable={true}
        >
          {withTitle && (
            <TitleEditor
              title={title}
              setTitle={setTitle}
              name={name}
              setName={setName}
              bgc={"#ffffff"}
              darkenBgc={simpleStyle ? false : true}
              size={4}
              justify="center"
              style={{ fontSize: "20px" }}
            />
          )}
          <SlateEditor
            card={card}
            key={card._id}
            setContent={setContent}
            content={content}
          />
        </Card>
      </ContainerWithMenu>
    </div>
  );
}
