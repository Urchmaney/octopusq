"use client"

import { DraggableIndicatorIcon } from "@/lib/icons/draggable-icon";
import { DndContext, DragEndEvent, DragOverEvent, KeyboardSensor, PointerSensor, TouchSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, Divider, CardBody, CardFooter, Link, Image } from "@nextui-org/react";
import { ReactNode, useEffect, useState } from "react";



function DraggableQuestionBox({ dragId, question }: { dragId: string, question: string }) {
  const { attributes, listeners, setNodeRef, transform, setActivatorNodeRef, transition } = useSortable({
    id: dragId
  })


  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  return (
    <div ref={setNodeRef} style={style}>
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


export default function Questions() {

  const [questions, setQuestions] = useState([
    { id: '1', val: "Mark" }, { id: '2', val: "John" }, { id: '3', val: "Kingsley" }, { id: '4', val: "Pope" }
  ])


  const onDragEndFn = (result: DragEndEvent) => {
    if (!result.over) {
      return;
    }

    console.log(result.active.id.toString(), result.over.id.toString())

    // const oldIndex = umber(result.active.id.toString().split("-")[1]);
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
      <DndContext collisionDetection={closestCorners} sensors={sensors}>
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