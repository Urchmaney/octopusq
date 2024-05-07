import { Project } from "@/models/project";
import React, { useState } from "react";

type AppData = {
  activeProject: Project | null
  setActiveProject: (project: Project) => void
}

export const DataContext: React.Context<AppData> = React.createContext<AppData>({
  activeProject: null,
  setActiveProject(project) {
    
  }
});

export const useAppData = () => React.useContext(DataContext);

export const AppDataContextProvider = (
  { children }: { children: React.ReactNode }
) => {

  const [project, setProject] = useState<Project | null>(null);

  const setActiveProject = (project: Project) => {
    setProject(project)
  }

  return (
    <DataContext.Provider value={{ activeProject: project, setActiveProject }}>
      {children}
    </DataContext.Provider>
  )

}
