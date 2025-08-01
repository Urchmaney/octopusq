import clsx, { ClassValue } from "clsx";
import { Point, Rect } from "./core";
import { twMerge } from "tailwind-merge";

export function toScreenCoords(x: number, y: number, scale: number, scrollElement: HTMLElement | null, canvas: HTMLCanvasElement | null): [number, number] {
  if (!scrollElement || !canvas) return [0, 0]
  var rect = canvas.getBoundingClientRect();
  
  let wx = x * scale + rect.left + scrollElement.scrollLeft;
  let wy = y * scale + rect.top + scrollElement.scrollTop;
  return [wx, wy];
}

export function toCanvasCoords(canvas: HTMLCanvasElement | null, pageX: number, pageY: number, scale: number): Point {
  if (!canvas) return Point.zero;

  const rect = canvas.getBoundingClientRect();
  let x = (pageX - rect.left) / scale;
  let y = (pageY - rect.top) / scale;
  return new Point(x, y);
}

export function canvasRect(canvas: HTMLCanvasElement): Rect {
  const rect = canvas.getBoundingClientRect();
  return new Rect(rect.x, rect.y, rect.width, rect.height)
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce(fn: Function, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
