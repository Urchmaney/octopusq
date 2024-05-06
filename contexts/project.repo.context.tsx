import firebaseApp from "@/firebase";
import { Project } from "@/models/project";
import { FirestoreService } from "@/services/nodes/firebase_service/node.firebase.service";
import { IProjectServiceInterface } from "@/services/projects/projects.service.interface";
import React, { useMemo } from "react";

export const ProjectRepoContext: React.Context<IProjectServiceInterface | null> = React.createContext<IProjectServiceInterface | null>(null);

export const useProjectRepoContext = () => React.useContext(ProjectRepoContext);

export const ProjectRepoContextProvider = (
  { children }: { children: React.ReactNode }
) => {

  const projectRepoService: IProjectServiceInterface = useMemo(() => new FirestoreService<Project>(firebaseApp, "projects", "project").functions() as unknown as IProjectServiceInterface, [])

  return (
    <ProjectRepoContext.Provider value={projectRepoService}>
      {children}
    </ProjectRepoContext.Provider>
  )
}