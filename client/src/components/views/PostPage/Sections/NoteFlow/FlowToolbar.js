import React, { useState, useCallback } from "react";
import { useStoreState, useStoreActions } from "react-flow-renderer";
import { addCardToList } from "../../../../../_actions/post_actions";
// import { createCard, editCard } from "../../../../../api";
import { createCard, editCard } from "../../../../../_actions/card_actions";
import { useDispatch } from "react-redux";
import NoteFlowNode from "./NoteFlowNode";
import { editChain } from "../../../../../api";

/**
 * @param {array} elements array of currentnode elements
 * @param {array} setElements set method of currentnode elements state
 * @param {Object}parentContainer
 * @returns FlowToolbar
 */

export default function FlowToolbar({
  postId,
  sectionId,
  listId,
  parentContainer,
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
      content: [],
      flowData: {
        type: "NODE",
        position: {
          x: nodes[nodes.length - 1]?.position.x + 200 || 100,

          y: nodes[nodes.length - 1]?.position.y || 100,
        },
      },
    };

    const newCard = await dispatch(createCard(variables));


    if (parentContainer && newCard) {
      const update = parentContainer.nodes
        ? { $push: { nodes: newCard._id } }
        : { nodes: [newCard._id] };

      const editVariables = {
        id: parentContainer.chainId,
        updates: update,
      };
      const updatedChain = await editChain(editVariables);
      console.log(`updatedChain`, updatedChain);
    }
  };

  return (
    <aside>
      <button onClick={selectAll}>select all nodes</button>
      <button onClick={addNode}>Add node</button>
    </aside>
  );
}
