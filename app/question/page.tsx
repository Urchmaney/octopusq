"use client"

import { DraggableIndicatorIcon } from "@/lib/icons/draggable-icon";
import { DndContext, DragEndEvent, DragOverEvent, KeyboardSensor, PointerSensor, TouchSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, Divider, CardBody, CardFooter, Link, Image } from "@nextui-org/react";
import { ReactNode, useEffect, useState } from "react";



function DraggableQuestionBox({ dragId, question }: { dragId: string, question: string }) {

  const [mouseInside, setMouseInside] = useState(false);

  const { attributes, listeners, setNodeRef, transform, setActivatorNodeRef, transition } = useSortable({
    id: dragId
  })


  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  const mouseEnter = () => {
    setMouseInside(true);
  }

  const mouseLeave = () => {
    setMouseInside(false);
  }

  return (
    <div className="flex flex-row p-2 px-4">
      <div className="flex grow">

      </div>

      <div ref={setNodeRef} style={style} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
        <Card className="max-w-[400px]">
          {/* <CardHeader >
          <div className="flex gap-3 bg-secondary-50">
            <div {...listeners} {...attributes}>
              <DraggableIndicatorIcon size={20} className="cursor-pointer" />
            </div>

            <div className="flex flex-col">
              <p className="text-md">{question}</p>
            </div>
          </div>

        </CardHeader> */}

          <CardBody>
            <div className="flex flex-row gap-2">
              {mouseInside &&
                <div className="flex items-center justify-center" {...listeners} {...attributes}>
                  <div>
                    <DraggableIndicatorIcon size={15} className="cursor-pointer" />
                  </div>
                </div>
              }
              <div className="flex flex-col gap-3">
                <div className="flex bg-[#F2F3F5] p-3 rounded">
                  <p className="text-md">{question}</p>
                </div>

                <p className="text-small text-default-500">Answer</p>
                <p>Make beautiful websites regardless of your design experience.</p>
              </div>

            </div>

          </CardBody>
          <Divider />
          <CardFooter>
            <div className="flex justify-end w-full">
              <Link
                isExternal
                showAnchorIcon
                href="#"
              >
                Sub-question
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>

  )
}


export default function Questions() {

  const [questions, setQuestions] = useState([
    { id: '1', val: "Mark" }, { id: '2', val: "John" }, { id: '3', val: "Kingsley" }, { id: '4', val: "Pope" }
  ])


  const onDragEndFn = (result: DragEndEvent) => {
    const { over, active } = result;
    if (!over || over.id === active.id) {
      return;
    }

    setQuestions((questions) => {
      const oldPosition = questions.findIndex(x => x.id === active.id);
      const newPosition = questions.findIndex(x => x.id === over.id);

      return arrayMove(questions, oldPosition, newPosition)
    })
  }

  const onDragOverFn = (event: DragOverEvent) => {
    if (!event.over) {
      return;
    }

    console.log((Number(event.active.id.toString().split("-")[1]) - 1))
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-3">
      <DndContext collisionDetection={closestCorners} sensors={sensors} onDragEnd={onDragEndFn}>
        <div>
          <SortableContext items={questions} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-4">
              {
                questions.map((x, index) => {
                  return (
                    <DraggableQuestionBox
                      dragId={x.id}
                      question={x.val}
                      key={`draggable-question-${x.id}`}
                    />
                  )

                })
              }
            </div>

          </SortableContext>
        </div>

      </DndContext>
    </div >
  )
}