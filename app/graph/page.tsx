'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import Tree, { TreeProps } from "react-d3-tree";
import Graph, { GraphEvents } from "react-graph-vis";



function OrgChartGraph() {
  const orgChart: TreeProps = {
    draggable: true,
    dimensions: { height: 100, width: 100 },
    translate: { x: 50, y: 50 },
    depthFactor: 200,
    data: [
      {
        name: 'Manager',

        attributes: {
          department: 'Production',
        },
        children: [
          {
            name: 'Foreman',
            attributes: {
              department: 'Fabrication',
            },
            children: [
              {
                name: 'Worker',
              },
            ],
          },
          {
            name: 'Foreman',
            attributes: {
              department: 'Assembly',
            },
            children: [
              {
                name: 'Worker',
              },
            ],
          },
        ],
      },
    ],

  };
  const [containerDimension, setContainerDimension] = useState<{ width: number, height: number }>({ height: 0, width: 0 })
  const contref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dimension = contref.current?.getBoundingClientRect();
    setContainerDimension({ width: dimension?.width || 0, height: dimension?.height || 0 })
    console.log("initialozing", containerDimension)
  }, [contref])


  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.

    <Tree {...orgChart} translate={{ x: -200, y: 100 }} />

  );
}

export default function PPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true);
  })
  const graph = {
    nodes: [
      { id: 1, label: "Node 1", title: "node 2 tootip text" },
      { id: 2, label: "Node 2", title: "node 2 tootip text" },
      { id: 3, label: "Node 3", title: "node 3 tootip text" },
      { id: 4, label: "Node 4", title: "node 4 tootip text" },
      { id: 5, label: "Node 5", title: "node 5 tootip text" },
      { id: 7, label: "Node 7", title: "node 7 tootip text" }
    ],
    edges: [
      { from: 1, to: 2, label: "Lmaa" },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 }
    ]
  };

  const options = {
    layout: {
      hierarchical: true
    },
    edges: {
      color: "#f65"
    },
    height: "500px"
  };

  const events = {
    select: function (event: GraphEvents) {
      var { nodes, edges } = event;
    }
  };
  return (
    <div>
      {
        isClient ?
          <Graph
            graph={graph}
            options={options}
            events={events}
            getNetwork={network => {
              //  if you want access to vis.js network api you can set the state in a parent component using this property
            }}
            
          /> :
          <div></div>
        }

    </div>

  );
} 