import React, { useState, useEffect } from "react";
import ReactFlow, { ReactFlowProvider, addEdge } from "react-flow-renderer";
import { useDispatch, useSelector } from "react-redux";
import { createCard, editCard } from "../../../../../_actions/card_actions";
import {
  createCardInList,
  removeListFromSection,
} from "../../../../../_actions/post_actions";
import "react-flow-renderer/dist/style.css";
import NoteFlowNode from "./NoteFlowNode";
import FlowToolbar from "./FlowToolbar";

import { Button, Tooltip } from "antd";
import ContainerWithMenu from "../../../BasicComponents/ContainerWithMenu";
import { editChain } from "../../../../../api";

/**
 *
 * @param {ObjectId} listId
 * @param {Array} cards
 * @param {Object} parentContainer
 * @returns
 */

export default function NoteFlow({ cards, parentContainer }) {
  const dispatch = useDispatch();
  const allCards = useSelector((state) => state.cards);
  const [rfInstance, setRfInstance] = useState(null);
  const onLoad = (reactFlowInstance) => {
    console.log("rfInstance:", reactFlowInstance);
    reactFlowInstance.fitView();
    setRfInstance(reactFlowInstance);
  };

  const mapCardsToNode = (cards) => {
    if (!cards) return;
    return cards.map((card) => {
      const { _id, flowData } = card;
      const { type, source, target, animated, position } = flowData;
      if (type === "EDGE") {
        return {
          id: _id,
          source,
          target,
          animated,
        };
      }
      return {
        id: card._id,

        data: {
          label: (
            <div>
              <NoteFlowNode card={card}></NoteFlowNode>
            </div>
          ),
        },
        position,
        style: { width: "auto", minWidth: "200px", padding: 0, margin: 0 },
      };
    });
  };
  const initElements = mapCardsToNode(cards);
  const [elements, setElements] = useState(initElements);

  useEffect(() => {
    if (!cards) return;
    setElements(mapCardsToNode(cards));
    if (rfInstance) rfInstance.fitView();
  }, [parentContainer, cards, allCards]);

  const onConnect = (params) => {
    console.log(`params`, params);
    addEdgeToDB({ target: params.target, source: params.source });
    setElements((els) => addEdge({ ...params, animated: true }, els));
  };

  const addEdgeToDB = async (source, target) => {
    // const variables = {
    //   postId,
    //   sectionId,
    //   listId: list._id,
    //   flowData: {
    //     type: "EDGE",
    //     source,
    //     target,
    //   },
    // };

    const variables = {
      content: [],
      flowData: {
        type: "EDGE",
        source,
        target,
      },
    };

    const { data } = await createCard(variables);
    const newCard = data.card;

    if (parentContainer && parentContainer.nodes) {
      const editVariables = {
        id: parentContainer._id,
        updates: { nodes: [...parentContainer.nodes, newCard._id] },
      };
      // dispatch(editChain(editVariables));
      const updatedChain = await editChain(editVariables);
      console.log(`updatedChain`, updatedChain);
    }

    //else if its in a list editList..
  };

  const saveNodePosition = async (node) => {
    const card = cards.find(({ _id }) => _id === node.id);
    const position = rfInstance
      .getElements()
      .find(({ id }) => id === card._id).position;
    if (!position) return;
    const updates = {
      flowData: { ...card.flowData, position },
    };
    const variables = { id: card._id, updates };
    const updatedCard = await dispatch(editCard(variables));
  };

  const removeList = () => {
    // const variables = {
    //   postId,
    //   sectionId,
    //   listId: list._id,
    // };
    // dispatch(removeListFromSection(variables));
  };

  const menu = (
    <div>
      <Tooltip title="Remove Flow Chart">
        <Button
          shape="circle"
          icon={<span>X</span>}
          onClick={() => {
            removeList();
          }}
        />
      </Tooltip>
    </div>
  );

  return (
    <ContainerWithMenu menu={menu}>
      <div style={{ height: 300, width: "100%" }}>
        <ReactFlowProvider>
          <ReactFlow
            elements={elements}
            onConnect={onConnect}
            onLoad={onLoad}
            snapToGrid={true}
            onDoubleClick={() => {
              console.log(`rfInstance`, rfInstance);
              rfInstance.fitView();
            }}
            onNodeDragStop={(event, node) => {
              if (rfInstance) rfInstance.fitView();
              saveNodePosition(node);
            }}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
          >
            {" "}
          </ReactFlow>{" "}
          <FlowToolbar
            elements={elements}
            setElements={setElements}
            rfInstance={rfInstance}
            parentContainer={parentContainer}
          />
        </ReactFlowProvider>
      </div>
    </ContainerWithMenu>
  );
}
