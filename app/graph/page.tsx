'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import Tree, { TreeProps } from "react-d3-tree";

export const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }): [{ width: number, height: number} | undefined, { x: number, y: number}, (containerElem: HTMLDivElement) => void] => {
    const [translate, setTranslate] = useState<{ x: number, y: number }>(defaultTranslate);
    const [dimensions, setDimensions] = useState<{ width: number, height: number }>();
    const containerRef = useCallback((containerElem: HTMLDivElement) => {
      if (containerElem !== null) {
        const { width, height } = containerElem.getBoundingClientRect();
        setDimensions({ width, height });
        setTranslate({ x: width / 2, y: height / 2 });
      }
    }, []);
    return [dimensions, translate, containerRef];
  };

export default function OrgChartGraph() {
    const orgChart: TreeProps = {
        
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
    // const [containerDimension, setContainerDimension] = useState<{ width: number, height: number }>({ height: 0, width: 0 })
    // const contref = useRef<HTMLDivElement>(null);
    // useEffect(() => {
    //     const dimension = contref.current?.getBoundingClientRect();
    //     setContainerDimension({ width: dimension?.width || 0, height: dimension?.height || 0 })
    //     console.log("initialozing", containerDimension, contref)
    // }, [contref])
    const [dimensions, translate, containerRef] = useCenteredTree();
    console.log(dimensions)

    return (
        // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
        <div id="treeWrapper" ref={containerRef} style={{ width: '100vw', height: '100vh' }}>
            <Tree
                data={orgChart.data}
                dimensions={dimensions}
                translate={translate}
                draggable={false}
                zoomable={true}
            />
        </div>
    );
}