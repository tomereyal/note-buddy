import React, { useState, useEffect } from "react";
import { Button, Card, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { editNote } from "../../../../_actions/card_actions";
import SlateEditor from "../../../editor/SlateEditor";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
import TextEditor from "../../../editor/TextEditor";
import { Steps, StepProps } from "antd";
import session from "express-session";
import Avatar from "antd/lib/avatar/avatar";
import ContainerWithMenu from "../../BasicComponents/ContainerWithMenu";
import { removeCardFromList } from "../../../../_actions/post_actions";

const { Meta } = Card;
const { Step } = Steps;

export default function NoteSingleStep({
  card: initialCard,
  index,
  listCardCount,
  direction,
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
  const removeCard = () => {
    const variables = cardData;
    dispatch(removeCardFromList(variables));
  };

  const menu = (
    <div>
      <Tooltip title="Remove Note">
        <Button
          shape="circle"
          size="small"
          icon={<span>X</span>}
          onClick={() => {
            removeCard();
          }}
        />
      </Tooltip>
    </div>
  );

  return (
    <Step
      key={"step" + card._id}
      subTitle={
        <ContainerWithMenu
          menu={menu}
          style={{
            minHeight: "50px",
          }}
          onBlur={() => {
            saveNote();
          }}
        >
          <Card
            bodyStyle={{ padding: "2px", borderRadius: "4px" }}
            style={{
              width: "100%",
              minWidth: direction === "horizontal" ? "100px" : "300px",
            }}
            hoverable={true}
            bordered={true}
            cover={
              direction === "horizontal" ? (
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              ) : (
                ""
              )
            }
          >
            <Meta
              avatar={
                direction === "vertical" ? (
                  <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
                ) : (
                  ""
                )
              }
              style={{ paddingBottom: "10px" }}
              title={
       
                  <TitleEditor
                    title={title}
                    setTitle={setTitle}
                    name={name}
                    setName={setName}
                    bgc={"#ffffff"}
                    darkenBgc={false}
                    size={4}
                  />
           
              }
              description={
                <SlateEditor
                  card={card}
                  key={card._id}
                  style={{ width: "100%" }}
                  setContent={setContent}
                  content={content}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                  }}
                ></SlateEditor>
              }
            />
          </Card>
        </ContainerWithMenu>
      }
      {...StepProps}
    ></Step>
  );
}
