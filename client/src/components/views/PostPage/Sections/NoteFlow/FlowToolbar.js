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
  const nodes = useStoreState((store) => store.nodes);
  const transform = useStoreState((store) => store.transform);
  const setSelectedElements = useStoreActions(
    (actions) => actions.setSelectedElements
  );

  const selectAll = () => {
    setSelectedElements(
      nodes.map((node) => ({ id: node.id, type: node.type }))
    );
  };

  const addNode = useCallback(async () => {
    const variables = {
      postId,
      sectionId,
      listId: listId,
      content: [],
      flowData: {
        type: "NODE",
        position: {
          x: Math.random() * window.innerWidth - 100,
          y: Math.random() * window.innerHeight,
        },
      },
      tags: [],
    };

    const { data } = await createCard(variables);
    const newCard = data.card;

    dispatch(addCardToList({ postId, sectionId, listId, cardId: newCard._id }));

    const newNode = {
      id: newCard._id,
      data: {
        label: (
          <div>
            <NoteFlowNode card={newCard}></NoteFlowNode>
          </div>
        ),
      },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };
    setElements((els) => els.concat(newNode));
  }, [setElements]);

  return (
    <aside>
      <button onClick={selectAll}>select all nodes</button>
      <button onClick={addNode}>Add node</button>
    </aside>
  );
}
