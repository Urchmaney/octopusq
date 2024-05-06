import { Project } from "@/models/project";

export interface IProjectServiceInterface {
  getProjects() : Promise<Project[]>
  addProject(project: Project): Promise<Project>
}