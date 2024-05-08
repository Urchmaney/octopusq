"use client"

import { DraggableIndicatorIcon } from "@/lib/icons/draggable-icon";
import { DndContext, DragEndEvent, DragOverEvent, KeyboardSensor, PointerSensor, TouchSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, Divider, CardBody, CardFooter, Link, Image, Input, Button } from "@nextui-org/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import EditorJS from '@editorjs/editorjs';
import dynamic from "next/dynamic";
import { useServiceRepo } from "@/contexts/services.repo.context";
import { Question } from "@/models/question";
import { useAppData } from "@/contexts/data.context";



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
      <div ref={setNodeRef} style={style}>
        <Card className="max-w-[400px] min-w-[350px]">
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
            <div className="flex flex-row gap-2 w-full" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
              {mouseInside &&
                <div className="flex items-center justify-center" {...listeners} {...attributes}>
                  <div>
                    <DraggableIndicatorIcon size={15} className="cursor-pointer" />
                  </div>
                </div>
              }
              <div className="flex flex-col gap-3 flex-grow">
                <div className="flex bg-[#F2F3F5] p-3 rounded">
                  <p className="text-md">{question}</p>
                </div>

                <p className="text-small text-default-500">Answer</p>
                {/* <p>Make beautiful websites regardless of your design experience.</p> */}
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
                color="secondary"
              >
                sub-questions
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>

  )
}

const Editor = dynamic(() => import("./editor"), {
  ssr: false,
});



export default function Questions({ params }: { params: { id: string } }) {

  // const editorRef = useRef<EditorJS>();

  // useEffect(() => {
  //   //initialize editor if we don't have a reference
  //   if (!editorRef.current) {
  //     const editor = new EditorJS({ holder: "editorId" });
  //     editorRef.current = editor;
  //   }

  //   //add a return function handle cleanup
  //   return () => {
  //     if (editorRef.current && editorRef.current.destroy) {
  //       editorRef.current.destroy();
  //     }
  //   };
  // }, []);

  const { activeProject } = useAppData();

  const { questionService } = useServiceRepo() || {};

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    questionService?.getProjectQuestions([params.id]).then((questions: Question[]) => {
      setQuestions(questions)
    })
  }, [])

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


  const createQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const questionElement = (form.elements[0] as HTMLInputElement);
    const question = questionElement.value;
    const newQuestion = await questionService?.addProjectQuestion({ body: question }, [params.id]);
    if (newQuestion) {
      setQuestions((questions) => [newQuestion, ...questions ]);
      form.reset();
      questionElement.value = questionElement.defaultValue;
    }
  }

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex">
      <div className="flex grow flex-col">
        <p className="flex justify-center text-lg font-bold p-4">
          { activeProject?.title }
        </p>
        <Editor holder="editorId"></Editor>
      </div>
      <div className="flex flex-col gap-3">

        <div className="px-5">
          <Card className="max-w-[400px] w-[350px]">
            <CardBody>
              <form onSubmit={createQuestion}>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-center">
                    <Input size={"md"} type="text" label="New Question" name="newQuestion" />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="solid" color="secondary" type="submit">
                      Create
                    </Button>
                  </div>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>



        <DndContext collisionDetection={closestCorners} sensors={sensors} onDragEnd={onDragEndFn}>
          <div>
            <SortableContext items={questions.map((x) => ({ id: x.id!.toString(), ...x }))} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-4">
                {
                  questions.map((x, index) => {
                    return (
                      <DraggableQuestionBox
                        dragId={x.id!.toString()}
                        question={x.body}
                        key={`draggable-question-${x.id}`}
                      />
                    )

                  })
                }
              </div>

            </SortableContext>
          </div>

        </DndContext>
      </div>
    </div>
  )
}
