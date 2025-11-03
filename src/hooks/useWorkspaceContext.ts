import { useOutletContext } from "react-router";
import { Question } from "../services/documentApi";

export type WorkspaceContext = { activeWorkspace: string, setActiveWorkspace: (workspaceId: string) => void, allWorkspaces: Question[] };

export function useWorkspaceContext() {
  return useOutletContext<WorkspaceContext>();
}