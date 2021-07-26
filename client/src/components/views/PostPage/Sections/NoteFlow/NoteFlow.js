import React from "react";
import ReactFlow from "react-flow-renderer";
import "react-flow-renderer/dist/style.css";
import NoteFlowNode from "./NoteFlowNode";

export default function NoteFlow({ list }) {
  // const elements = list.cards.map(card=>{
  //   return     {
  //     id: "1",
  //     type: "input", // input node
  //     data: { label: "Input Node" },
  //     position: { x: 250, y: 25 },
  //   }

  // })

  const elements = [
    {
      id: "1",
      type: "input", // input node
      data: { label: "Input Node" },
      position: { x: 250, y: 25 },
    },
    // default node
    {
      id: "2",
      // you can also pass a React component as a label
      data: {
        label: (
          <div>
            <NoteFlowNode card={list.cards[0]}></NoteFlowNode>
          </div>
        ),
      },
      position: { x: 100, y: 125 },
    },
    {
      id: "3",
      type: "output", // output node
      data: { label: "Output Node" },
      position: { x: 250, y: 250 },
    },
    // animated edge
    { id: "e1-2", source: "1", target: "2", animated: true },
    { id: "e2-3", source: "2", target: "3" },
  ];
  return (
    // <div style={{ height: 300, width: 400 }}>
    <ReactFlow elements={elements} />
    // </div>
  );
}
