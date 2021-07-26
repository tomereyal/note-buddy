import React, { useState } from "react";
import ReactFlow, {
  useStoreState,
  ReactFlowProvider,
  addEdge,
  removeElements,
} from "react-flow-renderer";
import { useDispatch } from "react-redux";
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
    setRfInstance(reactFlowInstance);
  };

  const [elementsToRemove, setElementsToRemove] = useState();
  const initElements = list.cards.map((card) => {
    // console.log(`card.flowData`, card.flowData);

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
  console.log(`initElements`, initElements);

  const [elements, setElements] = useState(initElements);

  const onConnect = (params) => {
    console.log(`params`, params);
    addEdgeToDB({ target: params.target, source: params.source });
    setElements((els) => addEdge({ ...params, animated: true }, els));
  };
  const onElementsRemove = () => {
    console.log(`elementsToRemove`, elementsToRemove);

    setElements((els) => {
      console.log(
        `removeElements(elementsToRemove, els)`,
        removeElements(elementsToRemove, els)
      );
      removeElements(elementsToRemove, els);
    });
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

  return (
    <ReactFlowProvider>
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onLoad={onLoad}
        snapToGrid={true}
      ></ReactFlow>
      <FlowToolbar
        elements={elements}
        setElements={setElements}
        postId={postId}
        sectionId={sectionId}
        listId={list._id}
      />
    </ReactFlowProvider>
  );
}
