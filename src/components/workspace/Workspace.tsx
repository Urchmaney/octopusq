import { useEffect, useRef, useState, MouseEvent, Children, ReactNode } from "react"
import { Container } from "../container/Container";
import { useWindowDimension } from "../../hooks/useWindowDimension";
import { Point, Rect } from "../../core";
import { canvasRect } from "../../utils";



export type WorkspaceStatus = "idle" | "panning";

export function Workspace({ children }: { children?: ReactNode }) {
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 600;
  const windowRect = useWindowDimension();
  const [rect, setRect] = useState(new Rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT));
  const [status, setStatus] = useState<WorkspaceStatus>("idle");
  const [startPanningPoint, setStartPanningPoint] = useState<Point>(Point.zero);
  const [startingRect, setStartingRect] = useState<Rect>(new Rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT))

  const workspaceCanvas = useRef<HTMLCanvasElement>(null);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const context = workspaceCanvas.current?.getContext("2d");
    if (workspaceCanvas.current && context) {
      setRect(new Rect(0, 0, workspaceCanvas.current.clientWidth, workspaceCanvas.current.clientHeight))
      context.fillStyle = "lightgray";
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }, [workspaceCanvas.current]);


  const onMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    
    if (status === "panning") {
      const deltaX = clientX - startPanningPoint.x;
      const deltaY = clientY - startPanningPoint.y;
      const canvasDelta = canvasRect(workspaceCanvas.current!).scalePointFrom(new Point(deltaX,  deltaY), windowRect);

      setRect(new Rect(startingRect.left + canvasDelta.x, startingRect.top + canvasDelta.y, startingRect.width, startingRect.height ));
      return;
    }
  }

  const onMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    const { button, clientX, clientY } = event;
    if (button === 0) {
      setStatus("panning");
      setStartPanningPoint(new Point(clientX, clientY));
      setStartingRect(rect);
    }
  }

  const onMouseUp = (_: MouseEvent<HTMLCanvasElement>) => {
    setStatus("idle");
  }

  return (
    <div className="w-2xl h-96 relative" ref={container}>
      <canvas ref={workspaceCanvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-full cursor-pointer" onMouseMove={onMouseMove} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      </canvas>
      {
        Children.map(children, (child) => {
          return <Container workspaceRect={rect} position={new Point(20,100)}>{child}</Container>
        })
      }
    </div>
  )
}