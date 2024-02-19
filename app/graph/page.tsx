'use client'
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Tree, { TreeProps } from "react-d3-tree";


  
  export default function OrgChartGraph() {
    const orgChart: TreeProps = {
        draggable: true,
        dimensions: { height: 100, width: 100 },
        translate: {x: 50, y: 50 },
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
      <div id="treeWrapper" ref={contref} style={{ width: '50em', height: '20em' }}>
        <Tree {...orgChart} translate={{ x: -200 , y: 100 }} />
      </div>
    );
  }