import { useOutletContext } from "react-router";

export type WorkspaceContext = { activeWorkspace: number };

export function useWorkspaceContext() {
  return useOutletContext<WorkspaceContext>();
}