'use client'
import { useNodeRepoContext } from "@/contexts/node.repo.context";
import { MarkDownEditor } from "@/lib/components/mark-down-editor";
import { CheckIcon } from "@/lib/icons/check";
import { CloseIcon } from "@/lib/icons/close";
import { EditIcon } from "@/lib/icons/edit";
import { Button } from "@nextui-org/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Tree, { TreeProps } from "react-d3-tree";
import Graph, { Data, Edge, GraphEvents, Options, graphData } from "react-graph-vis";
import { v4 } from "uuid";
import { Node } from "@/models/node";



export default function Page() {
  const [isClient, setIsClient] = useState(false);
  const [size, setSize] = useState([0, 1212]);
  const [showNode, setShowNode] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [markDown, setMarkDown] = useState<string | undefined>("**Welcome**")
  const [markdownEdit, setMarkDownEdit] = useState(false)

  const nodeRepoService = useNodeRepoContext();

  useEffect(() => {
    nodeRepoService?.getNodes().then(data => {
      setNodes(data);
      const sEdges: Edge[] = data.map(x =>
        x.edges.map(y => ({
          from: x.id,
          to: y.id,
          label: y.title
        })
      )).flat();
      setEdges(sEdges);
    })
  }, [])


  useLayoutEffect(() => {
    setSize([window.innerWidth, window.innerHeight]);
  }, []);

  useEffect(() => {
    setIsClient(true);
  });

  // const graph: graphData = {
  //   nodes: [
  //     { id: 1, label: "Node 1", title: "node 2 tootip text" },
  //     { id: 2, label: "Node 2", title: "node 2 tootip text" },
  //     { id: 3, label: "Node 3", title: "node 3 tootip text", x: 10, y: 10, physics: false, fixed: { x: true, y: true } },
  //     { id: 4, label: "Node 4", title: "node 4 tootip text" },
  //     { id: 5, label: "Node 5", title: "node 5 tootip text" },
  //     { id: 7, label: "Node 7", title: "node 7 tootip text" }
  //   ],
  //   edges: [
  //     { from: 1, to: 2, label: "Lmaa" },
  //     { from: 1, to: 3 },
  //     { from: 2, to: 4 },
  //     { from: 2, to: 5 }
  //   ]
  // };

  const graph: graphData = {
    nodes: nodes,
    edges: edges
  };
  const options: Options = {
    autoResize: true,
    layout: {
      randomSeed: 8
    },
    edges: {
      color: "#f65"
    },
    height: size[1].toString(),
    width: size[0].toString(),
    nodes: {
      shape: "square",
      physics: false,
    },
    physics: {
      stabilization: false
    }
  };

  const events = {
    select: function (event: GraphEvents) {
      // const { nodes, edges } = event;

      setShowNode(true)
    }
  };

  return (
    <div className="relative">
      {
        isClient ?
          <div className="">
            <Button>Add Node</Button>
            <Graph
              key={v4()}
              graph={graph}
              options={options}
              events={events}
              getNetwork={network => {
                //  if you want access to vis.js network api you can set the state in a parent component using this property
              }}

            />
          </div>
          :
          <div></div>
      }

      {showNode &&
        <div className="absolute right-0 top-0 h-full w-[50%] bg-slate-100 flex flex-col">
          <div className="flex justify-end p-2">
            {
              markdownEdit ?
                <Button variant="light" onClick={() => setMarkDownEdit(false)}>
                  <CheckIcon />
                </Button> :
                <Button variant="light" onClick={() => setMarkDownEdit(true)}>
                  <EditIcon />
                </Button>
            }


            <Button variant="light" onClick={() => setShowNode(false)}>
              <CloseIcon />
            </Button>

          </div>
          <div className="grow-2">
            <MarkDownEditor value={markDown || ""} changeCb={setMarkDown} editMode={markdownEdit} />
          </div>
        </div>
      }

    </div>

  );
}

// function OrgChartGraph() {
//   const orgChart: TreeProps = {
//     draggable: true,
//     dimensions: { height: 100, width: 100 },
//     translate: { x: 50, y: 50 },
//     depthFactor: 200,
//     data: [
//       {
//         name: 'Manager',

//         attributes: {
//           department: 'Production',
//         },
//         children: [
//           {
//             name: 'Foreman',
//             attributes: {
//               department: 'Fabrication',
//             },
//             children: [
//               {
//                 name: 'Worker',
//               },
//             ],
//           },
//           {
//             name: 'Foreman',
//             attributes: {
//               department: 'Assembly',
//             },
//             children: [
//               {
//                 name: 'Worker',
//               },
//             ],
//           },
//         ],
//       },
//     ],

//   };
//   const [containerDimension, setContainerDimension] = useState<{ width: number, height: number }>({ height: 0, width: 0 })
//   const contref = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const dimension = contref.current?.getBoundingClientRect();
//     setContainerDimension({ width: dimension?.width || 0, height: dimension?.height || 0 })
//     console.log("initialozing", containerDimension)
//   }, [contref])


//   return (
//     // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.

//     <Tree {...orgChart} translate={{ x: -200, y: 100 }} />

//   );
// }

