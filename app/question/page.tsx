"use client"

import { DraggableIndicatorIcon } from "@/lib/icons/draggable-icon";
import { DndContext, DragEndEvent, DragOverEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { Card, CardHeader, Divider, CardBody, CardFooter, Link, Image } from "@nextui-org/react";
import { ReactNode, useState } from "react";


function DraggableQuestionBox({ dragId, question }: { dragId: string, question: string }) {
  const { attributes, listeners, setNodeRef, transform, setActivatorNodeRef } = useDraggable({
    id: dragId
  })

  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div key={`question-${dragId}`} ref={setNodeRef} style={style}>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <div {...listeners} {...attributes}>
            <DraggableIndicatorIcon size={25} className="cursor-pointer" />
          </div>

          <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">{question}</p>
            <p className="text-small text-default-500">nextui.org</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>Make beautiful websites regardless of your design experience.</p>
        </CardBody>
        <Divider />
        <CardFooter>
          <Link
            isExternal
            showAnchorIcon
            href="https://github.com/nextui-org/nextui"
          >
            Visit source code on GitHub.
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

function DroppableBox({ droppableId, isDraggedOver, children }: { droppableId: string, isDraggedOver: boolean, children: ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: droppableId
  })
  return (
    <div ref={setNodeRef} className="min-h-24">
      { isDraggedOver && <div className="min-h-28"> </div>}
      {children}
    </div>
  )
}

export default function Questions() {

  const [currentDragOver, setCurrentDragOver] = useState<number | null>(null)

  const [questions, setQuestions] = useState( [
    "Mark", "John", "Kingsley", "Pope"
  ])


  const onDragEndFn = (result: DragEndEvent) => {
    if (!result.over) {
      return;
    }

    console.log(result.active.id.toString(), result.over.id.toString())

    setCurrentDragOver(null)
    // const oldIndex = umber(result.active.id.toString().split("-")[1]);
    // const newIndex = sizeOfSteps - Number(result.over.id.toString().split("-")[1]);
  }

  const onDragOverFn = (event: DragOverEvent) => {
    if (!event.over) {
      return;
    }
    setCurrentDragOver(Number(event.over.id.toString().split("-")[1]))

    // const overIndex = Number(event.over?.id.toString().split("-")[1]) - 1
    // const dragIndex = Number(event.active.id.toString().split("-")[1]) - 1

    // setQuestions([...questions.slice(0, overIndex), "", ...questions.slice(overIndex + 1)])
  }

  return (
    <div className="flex flex-col gap-3">
      <DndContext onDragEnd={onDragEndFn} onDragOver={onDragOverFn}>
        {
           questions.map((x, index) => {
            return (
              <div>
                {
                  x === "" ? <div></div> :
                  <DroppableBox droppableId={`droppable-${index + 1}`} key={`droppable-${index + 1}`} isDraggedOver={index + 1 === currentDragOver}>
                  <DraggableQuestionBox
                    dragId={`dragged-${index + 1}`}
                    question={x}
                  />
                </DroppableBox>
                }
              </div>
            )
           
          })
        }
      </DndContext>
    </div>
  )
}