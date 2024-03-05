'use client'
import { CanvasForm, CanvasSpace, Group, Line, Pt, Space } from "pts"
import { useEffect, useRef, useState } from "react";
import { PtsCanvas } from "react-pts-canvas";



export default function OrgChartGraph() {
  let name = "canvaClass";
  let data = [5, 6, 7, 69];
  let background = "#fff"
  const [space, setSpace] = useState<CanvasSpace | null>(null);
  const [form, setForm] = useState<CanvasForm | null>(null);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
   
    if (space && form) {
      space.clear();
      handleAnimate(space, form);
    }
  }, [space, form, data]);

  const handleAnimate = (space: CanvasSpace, form: CanvasForm) => {
    if (!space || !form) return;

    let w = space.size.x / data.length;
    let bars = data.map((d, i) => {
      return new Group(
        new Pt(i * w, space.size.y),
        new Pt(i * w, space.size.y - d * space.size.y - 1)
      );
    });

    // Draw a line controlled by mouse pointer
    let line = new Group(
      new Pt(0, space.pointer.y),
      new Pt(space.size.x, space.pointer.y)
    );

    


   

    // Draw the bars and also check intersection with the pointer's line
    let intersects = bars.map((b, i) => {
      form.stroke("#123", w - 1).line(bars[i]);
      return Line.intersectLine2D(b, line);
    });

    form.stroke("#fff", 10).line(line);
    // Draw intersection points
    form.fillOnly("#f98").points(intersects, w / 2, "circle");

  };

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
      />
    </div>
  );
}