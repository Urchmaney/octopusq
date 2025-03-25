import { ReactNode } from "react"
import { Point, Rect } from "../../core"


type ContainerProp = {
  workspaceRect: Rect
  children?: ReactNode
  position: Point
}

export function Container ({ workspaceRect, position, children }: ContainerProp) {
  const left = `${position.x - workspaceRect.left}px`;
  const top = `${position.y - workspaceRect.top}px`

  return workspaceRect.includes(position) ? <div className={`absolute`} style={{ left, top }}>
    {children}
  </div> : <></>
}