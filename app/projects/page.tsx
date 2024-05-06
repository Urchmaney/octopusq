"use client"
import { useServiceRepo } from "@/contexts/services.repo.context";
import { AddIcon } from "@/lib/icons/add";
import { Project } from "@/models/project";
import { Button, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const { projectService } = useServiceRepo() || {};
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const openNewProjectModal = () => {
    onOpen();
  }

  const createProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const projectName = (e.currentTarget.elements[0] as HTMLInputElement).value;
    const newProject = await projectService?.addProject({ title: projectName, targetAudience: [] });
    if (newProject) {
      setProjects((projects) => [...projects, newProject]);
    }
  }

  useEffect(() => {
    projectService?.getProjects().then((projs: Project[]) => {
      setProjects(projs)
    })
  }, [])

  return (
    <div>
      <div className="flex justify-start flex-wrap gap-8 pt-14">
        {
          projects.map(x => (
            <div className="flex justify-center items-center w-[30%] bg-gray-200 h-[290px] rounded-md cursor-pointer" key={`projects-${x.id}`} onClick={() => router.push(`projects/${x.id}/questions`)}>
              <Link className="text-xl text-black" href={`projects/${x.id}/questions`}>{x.title}</Link>
            </div>
          ))
        }
        <div className="flex justify-center items-center w-[30%] bg-gray-200 h-[290px] rounded-md cursor-pointer" key={`add`} onClick={openNewProjectModal}>
          <AddIcon classname="" />
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        placement="top"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={createProject}>
              <>
                <ModalHeader className="flex flex-col gap-1">Project</ModalHeader>
                <ModalBody>
                  <Input
                    type="text"
                    placeholder=""
                    color='primary'
                    name='projectname'
                    id='projectname'
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button type="submit" color="primary" onPress={onClose}>
                    Create
                  </Button>
                </ModalFooter>
              </>
            </form>

          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
