'use client'
import { Bound, CanvasForm, CanvasSpace, Geom, Group, Line, Pt, Space, Triangle } from "pts"
import { useEffect, useRef, useState } from "react";
import { PtsCanvas } from "react-pts-canvas";

type Node = {
  val: string,
  children?: Node[],
  question?: string
}

const graph: Node = {
  val: "Parent",
  children: [
    {
      question: "How are you ?",
      val: "child 1",
      children: [
        {
          val: "Grand Child 1"
        }
      ]
    },

    {
      question: "Are you Ok?",
      val: "child 2"
    },

    {
      question: "Where are you doing ?",
      val: "child 3"
    }
  ]
}


export default function OrgChartGraph() {
  let name = "canvaClass";
  let data = [5, 6, 7, 69];
  let background = "#fff"
  const [space, setSpace] = useState<CanvasSpace | null>(null);
  const [form, setForm] = useState<CanvasForm | null>(null);
  const [hovered, setHovered] = useState(false);
  const [translateOffSet, setTranslateOffset] = useState<[number, number]>([0,0])
  
  useEffect(() => {
   
    if (space && form) {
      space.clear();

      handleAnimate(space, form);
    }
  }, [space, form, data]);

  const handleAnimate = (space: CanvasSpace, form: CanvasForm) => {
    if (!space || !form) return;

    
    
    // Draw a line controlled by mouse pointer
   
    // const points = [
    //   new Pt(60 + translateOffSet[0], 60 + translateOffSet[1]), 
    //   // new Pt(space.pointer.x + translateOffSet[0], space.pointer.y + translateOffSet[1]),
    //   // space.pointer
    //   new Pt(100 + translateOffSet[0], 100 + translateOffSet[1])
    // ]
    // form.fillOnly("#f98").point(points[0], 10, "square");

    // form.fillOnly("#f98").point(points[1], 10, "square");

    // const lineEnd = Line.marker(points, space.pointer, "arrow");

    // console.log(Triangle.oppositeSide([space.pointer], 0))

    // const lineEnd = Line.crop(points, [15, 15], 1,);

    // // console.log(lineEnd)
    // const t = Triangle.fromCenter(lineEnd, 5)
   

    // form.stroke("#f98").line(points)
    // form.fillOnly("#f98").polygon(t)

    // console.log()
    // const degree = Geom.toDegree(points[1].angleBetween(new Pt(points[1].x, points[0].y)));
    // const fPoint = Line.fromAngle(points[1], degree - 10, 10);
    // const sPoint = Line.fromAngle(points[1], 360 -degree - 10, 10);

    // form.stroke("#000").line(fPoint)
    // form.stroke("#000").line(sPoint)
    
    // form.stroke("#000").line([new Pt(points[1].x-10, points[1].y - 10),  points[1]])
    // form.stroke("#000").line([new Pt(points[1].x-10, points[1].y + 10),  points[1]])
    

    // const p = Line.perpendicularFromPt(points, new Pt(points[1].x -10, points[1].y - 10))
    // form.fillOnly("#000").point(p, 10, "polygon")
    renderNode(form, graph, 0, 0)

  };


  const renderNode = (form: CanvasForm, node: Node, xIndex: number, yIndex: number): Pt => {
    const point = new Pt((xIndex * 200) + 100, (yIndex * 200) + 100);
    console.log(`${xIndex * 100},   ${yIndex * 200}`)
    form.fillOnly("#f98").point(point, 80, "square");

    node.children?.forEach((n, i) => {
      const nodePoint = renderNode(form, n, xIndex + 1, i);
      
      form.stroke("#f98").line([point, nodePoint])
    });
    return point
  }


  const onActionPerformed = (space: CanvasSpace, form: CanvasForm, type: string, px: number, py: number, evt: Event) => {
    const pEvt = evt as PointerEvent;
    if (type === "drag") {
      space.clear();
      space.ctx.translate(pEvt.movementX, pEvt.movementY);
      setTranslateOffset([translateOffSet[0] + pEvt.movementX, translateOffSet[1] + pEvt.movementY])
      // console.log("draging", pEvt)
    }
    if (type === "click") {
    
     
    
      // space.ctx.translate(200, 0);
      console.log(space.pixelScale, type, pEvt.clientX, pEvt.clientY)
    }
  }

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ width: "80%"}}>
      <PtsCanvas
        name={name}
        play={hovered}
        background={background}
        onReady={(space, form) => {
          setSpace(space);
          setForm(form);
        }}
        onAnimate={handleAnimate}
        onAction={onActionPerformed}
        retina={true}
      />
    </div>
  );
}