'use client'
import { Bound, CanvasForm, CanvasSpace, Geom, Group, Line, Pt, Rectangle, Space, Triangle } from "pts"
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
  const [translateOffSet, setTranslateOffset] = useState<[number, number]>([0,0]);
  const [position, setPosition] = useState<[number, number]>([0, 0])
  
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

    renderNode(form, graph, 0, 0, space.pointer)

  };

  const translatedPoint = (point: Pt) : Pt => {
    return new Pt(point.x + translateOffSet[0], point.y + translateOffSet[1])
  }


  const renderNode = (form: CanvasForm, node: Node, xIndex: number, yIndex: number, cursorPoint: Pt): Pt => {
    const point = translatedPoint(new Pt(50 + (xIndex * 200) , 50 + (yIndex * 200)));
  
    const rect = Rectangle.fromCenter(point, 80);
    if (Rectangle.withinBound(rect, cursorPoint)) {
      const biggerRect = Rectangle.fromCenter(point, 85);
      form.fillOnly("#000").rect(biggerRect);
      console.log("==================")
      console.log([point.x, point.y])
      console.log([cursorPoint.x, cursorPoint.y])
      console.log(translateOffSet)
      console.log("======================")
    }
    form.fillOnly("#f98").rect(rect);
    

    node.children?.forEach((n, i) => {
      const nodePoint = renderNode(form, n, xIndex + 1, i, cursorPoint);
      
      form.stroke("#f98").line([point, nodePoint])
    });
    return point
  }


  const onActionPerformed = (space: CanvasSpace, form: CanvasForm, type: string, px: number, py: number, evt: Event) => {
    const pEvt = evt as PointerEvent;

    // console.log(pEvt.offsetX, pEvt.offsetY, "======")
    if (type === "drop") {
      console.log("drop")
      setPosition([0,0])
    }

    if (type === "drag") {
      
      let diff = [pEvt.screenX - position[0], pEvt.screenY - position[1]];

      console.log("drag")
      if (!position[0] && !position[1]) {
        diff = [0, 0]
      }
     
      setPosition([pEvt.offsetX, pEvt.offsetY]);
      setTranslateOffset([translateOffSet[0] + diff[0], translateOffSet[1] - diff[1]])
      // const x = pEvt.pageX - space.ctx.canvas.offsetLeft;
      // const y = pEvt.pageY - space.ctx.canvas.offsetTop
      // space.ctx.translate(x, y);
      
      // console.log(pEvt.clientX, pEvt.movementX);
      // console.log(pEvt.clientY, pEvt.movementY);

      // setTranslateOffset([x, y])
      // space.clear();
    }
    if (type === "click") {
    
     
      console.log("click")
      // space.ctx.translate(200, 0);

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