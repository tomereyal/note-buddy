import React, { useState, useEffect } from "react";
import ReactFlow, {
  useStoreState,
  ReactFlowProvider,
  addEdge,
  removeElements,
} from "react-flow-renderer";
import { useDispatch } from "react-redux";
import { editNote } from "../../../../../_actions/card_actions";
import {
  createCardInList,
  editList,
} from "../../../../../_actions/post_actions";
import "react-flow-renderer/dist/style.css";
import NoteFlowNode from "./NoteFlowNode";
import FlowToolbar from "./FlowToolbar";
import TitleEditor from "../../../../editor/TitleEditor/TitleEditor";

const onElementClick = (event, element) => console.log("click", element);

export default function NoteFlow({ postId, sectionId, list }) {
  const dispatch = useDispatch();

  const [rfInstance, setRfInstance] = useState(null);
  const onLoad = (reactFlowInstance) => {
    console.log("rfInstance:", reactFlowInstance);
    reactFlowInstance.fitView();
    setRfInstance(reactFlowInstance);
  };

  const mapCardsToNode = (cards) => {
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
      };
    });
  };
  const initElements = mapCardsToNode(list.cards);
  const [elements, setElements] = useState(initElements);

  useEffect(() => {
    setElements(mapCardsToNode(list.cards));
    if (rfInstance) rfInstance.fitView();
  }, [list]);

  const onConnect = (params) => {
    console.log(`params`, params);
    addEdgeToDB({ target: params.target, source: params.source });
    setElements((els) => addEdge({ ...params, animated: true }, els));
  };

  const addEdgeToDB = ({ target, source }) => {
    const variables = {
      postId,
      sectionId,
      listId: list._id,
      flowData: {
        type: "EDGE",
        source,
        target,
      },
    };

    dispatch(createCardInList(variables));
  };
  const saveNodePosition = (node) => {
    const card = list.cards.find(({ _id }) => _id === node.id);
    const position = rfInstance
      .getElements()
      .find(({ id }) => id === card._id).position;
    if (!position) return;
    const updates = {
      flowData: { ...card.flowData, position },
    };
    const variables = { id: card._id, updates };
    dispatch(editNote(variables));
  };

  return (
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
        postId={postId}
        sectionId={sectionId}
        listId={list._id}
        rfInstance={rfInstance}
      />
    </ReactFlowProvider>
  );
}
