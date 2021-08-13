import React, { useState, useEffect } from "react";
import { Button, Card, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { editCard } from "../../../../../_actions/card_actions";
import SlateEditor from "../../../../editor/SlateEditor";
import { useStoreState, useStoreActions } from "react-flow-renderer";
import {
  deleteCardFromList,
  removeCardFromList,
} from "../../../../../_actions/post_actions";
import { deleteCard } from "../../../../../_actions/card_actions";
import { DeleteFilled } from "@ant-design/icons";
import ContainerWithMenu from "../../../BasicComponents/ContainerWithMenu";

export default function NoteFlowNode({ card: initialCard, index }) {
  const dispatch = useDispatch();

  const edges = useStoreState((store) => store.edges);
  const transform = useStoreState((store) => store.transform);
  const [card, setCard] = useState(initialCard ? initialCard : {});
  const {
    _id,
    content: initialContent,
    title: initialTitle,
    name: initialName,
  } = card;

  const [title, setTitle] = useState(initialTitle);
  const [name, setName] = useState(initialName);
  const [content, setContent] = useState(initialContent);
  const [isShown, setIsShown] = useState(true);

  const removeCard = () => {

    console.log(`removinggg`, card._id);

    dispatch(deleteCard(card._id));
  };

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
    dispatch(editCard(variables));
  };

  const menu = (
    <Tooltip title="Remove Note">
      <a
        onClick={() => {
          removeCard();
        }}
      >
        <DeleteFilled style={{ fontSize: "10px", color: "black" }} />
      </a>
    </Tooltip>
  );

  return (
    isShown && (
      <div
        style={{
          minHeight: "100%",
        }}
        onBlur={() => {
          console.log("card blurred so saving..");
          saveNote();
        }}
        id={card._id}
      >
        <ContainerWithMenu menu={menu} noPadding={true}>
          <Card
            bodyStyle={{ padding: 0 }}
            // style={{ width: "100%" }}
            hoverable={true}
          >
            <SlateEditor
              card={card}
              key={card._id}
              style={{ minWidth: "100%" }}
              setContent={setContent}
              content={content}
            ></SlateEditor>
          </Card>
        </ContainerWithMenu>
      </div>
    )
  );
}
