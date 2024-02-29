'use client';
import Graph, { graphEvents } from "react-graph-vis";
import { useCallback, useEffect, useRef, useState } from "react";

export default function OrgChartGraph() {

  const events: graphEvents = {
    select: ({ nodes, edges }: { nodes: any, edges: any }) => {
      console.log("Selected nodes:");
      console.log(nodes);
      console.log("Selected edges:");
      console.log(edges);
      alert("Selected node: " + nodes);
    },
    doubleClick: ({ pointer: { canvas } }: { pointer: { canvas: any }}) => {
      // createNode(canvas.x, canvas.y);
    }
  }

  const graph = {
    nodes: [
      { id: 1, label: 'Node 1', color: '#e04141' },
      { id: 2, label: 'Node 2', color: '#e09c41' },
      { id: 3, label: 'Node 3', color: '#e0df41' },
      { id: 4, label: 'Node 4', color: '#7be041' },
      { id: 5, label: 'Node 5', color: '#41e0c9' },
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
    ],
  };
  
  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: '#000000',
    },
  };

  return (
  
      <Graph graph={graph} options={options} events={events} style={{ height: "640px" }} />
  );
}