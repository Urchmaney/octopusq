import firebaseApp from "@/firebase";
import { Project } from "@/models/project";
import { Question } from "@/models/question";
import { FirestoreService } from "@/services/nodes/firebase_service/node.firebase.service";
import { INodeServiceInterface } from "@/services/nodes/node.service.interface";
import { IProjectServiceInterface } from "@/services/projects/projects.service.interface";
import { IQuestionServiceInterface } from "@/services/questions/questions.service.interface";
import React, { useMemo } from "react";

type RepoServices = {
  nodeService: INodeServiceInterface
  projectService: IProjectServiceInterface
  questionService: IQuestionServiceInterface
}

export const ServicesRepoContext: React.Context<RepoServices | null> = React.createContext<RepoServices | null>(null);

export const useServiceRepo = () => React.useContext(ServicesRepoContext);

export const ServicesRepoContextProvider = (
  { children }: { children: React.ReactNode }
) => {

  const nodeRepoService: INodeServiceInterface = useMemo(() => new FirestoreService<Node>(firebaseApp, "nodes", "node").functions() as unknown as INodeServiceInterface, []);
  const projectRepoService: IProjectServiceInterface = useMemo(() => new FirestoreService<Project>(firebaseApp, "projects", "project").functions() as unknown as IProjectServiceInterface, []);
  const questionRepoService: IQuestionServiceInterface = useMemo(() => new FirestoreService<Question>(firebaseApp, "projects/questions", "projectQuestion").functions()as unknown as IQuestionServiceInterface, [])

  return (
    <ServicesRepoContext.Provider 
      value={{
        nodeService: nodeRepoService,
        projectService: projectRepoService,
        questionService: questionRepoService
      }}>
      { children }
    </ServicesRepoContext.Provider>
  )
}