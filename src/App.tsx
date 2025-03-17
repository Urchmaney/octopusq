import { BaseSyntheticEvent, MouseEventHandler, useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const coordinates: Array<[number, number]> = [
  [175, 252],
  [512, 436],
  [235, 44],
  [295, 725],
  [1000, 44]
]


const xcoordinates: Array<[number, number]> = [[306, 411], [413, 549]]
function rectContains(canvas: HTMLCanvasElement | null, point: [number, number]): boolean {
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    const inHorizontalRange = rect.left <= point[0] && point[0] <= rect.right;
    const inVerticalRange = rect.top <= point[1] && point[1] <= rect.bottom;

    // console.log("canvas", point, [rect.left, rect.right, rect.top, rect.bottom], inHorizontalRange && inVerticalRange)
    return inHorizontalRange && inVerticalRange;
  }
  return false;
}

const ZOOM_SPEED = 0.1;

function toScreenCoords(x: number, y: number, scale: number, scrollElement: HTMLElement | null, canvas: HTMLCanvasElement | null): [number, number] {
  if (!scrollElement || !canvas) return [0, 0]
  var rect = canvas.getBoundingClientRect();
  let wx = x * scale + rect.left + scrollElement.scrollLeft;
  let wy = y * scale + rect.top + scrollElement.scrollTop;
  return [wx, wy];
}

function toCanvasCoords(canvas: HTMLCanvasElement | null, pageX: number, pageY: number, scale: number): [number, number] {
  if (!canvas) return [0, 0];

  var rect = canvas.getBoundingClientRect();
  let x = (pageX - rect.left) / scale;
  let y = (pageY - rect.top) / scale;
  return [x, y];
}

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (context) {
      context.scale(.5, .5)
      context.fillStyle = "lightgray";
      console.log(canvas.current?.width,  canvas.current?.height)
      context.fillRect(0, 0, canvas.current?.clientWidth || 0, canvas.current?.clientHeight || 0)
    }
  }, [canvas.current]);

  const [scale, setScale] = useState<number>(.5)
  const [mouseCoordinate, setMouseCoordinate] = useState<[number, number]>([0, 0])

  
  const handleScroll = (e: React.WheelEvent) => {
    setScale(scale =>  scale * (1 + (Math.sign(e.deltaY) * ZOOM_SPEED)));
	
		// const position = Math.ceil(
		// 	(scrollTop / (scrollHeight - clientHeight)) * 100
		// );
		// console.log(scrollTop, )
	};
  const onMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setMouseCoordinate(toCanvasCoords(canvas.current!, event.clientX, event.clientY, 1))
    // console.log(toScreenCoords(event.clientX,  event.clientY, .5, container.current, canvas.current!), "=========")
  }
  return (
    <div className='relative' style={{ transform: `scale(${scale}, ${scale})`}} ref={container}>
      <canvas ref={canvas} width={300} height={300} onMouseMove={onMouseMove} onWheel={handleScroll} >
      </canvas>
      {
        xcoordinates.map((x, i) => {
          // const coord = x
          const coord = toCanvasCoords(canvas.current, x[0], x[1], scale)
          // console.log(rectContains(canvas.current, coord), canvas.current?.getBoundingClientRect())
          return (rectContains(canvas.current, coord) && (
            <div key={`kfk-${i}`} className='absolute w-10 h-10 bg-black' style={{ left: coord[0], top: coord[1] }}>
              welcome
            </div>

          ))
        })
      }

    </div>
  )
}

export default App
