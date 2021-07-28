import React, { useState, useCallback } from "react";
import { useStoreState, useStoreActions } from "react-flow-renderer";
import { addCardToList } from "../../../../../_actions/post_actions";
import { createCard } from "../../../../../api";
import { useDispatch } from "react-redux";
import NoteFlowNode from "./NoteFlowNode";

/**
 * @param {array} elements array of currentnode elements
 * @param {array} setElements set method of currentnode elements state
 * @returns FlowToolbar
 */

export default function FlowToolbar({
  postId,
  sectionId,
  listId,
  elements,
  setElements,
}) {
  const dispatch = useDispatch();
  const rfStoreState = useStoreState((store) => store);
  const nodes = useStoreState((store) => store.nodes);
  const transform = useStoreState((store) => store.transform);
  const setSelectedElements = useStoreActions(
    (actions) => actions.setSelectedElements
  );

  const selectAll = () => {
    console.log(`rfStoreState`, rfStoreState);
    setSelectedElements(
      nodes.map((node) => ({ id: node.id, type: node.type }))
    );
  };

  const addNode = async () => {
    const variables = {
      postId,
      sectionId,
      listId: listId,
      content: [],
      flowData: {
        type: "NODE",
        position: {
          x: nodes[nodes.length - 1]?.position.x + 200 || 100,

          y: nodes[nodes.length - 1]?.position.y || 100,
        },
      },
      tags: [],
    };

    const { data } = await createCard(variables);
    const newCard = data.card;

    dispatch(addCardToList({ postId, sectionId, listId, cardId: newCard._id }));
  };

  return (
    <aside>
      <button onClick={selectAll}>select all nodes</button>
      <button onClick={addNode}>Add node</button>
    </aside>
  );
}
