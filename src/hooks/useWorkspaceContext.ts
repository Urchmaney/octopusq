import { useOutletContext } from "react-router";

export type WorkspaceContext = { activeWorkspace: string, setActiveWorkspace: (workspaceId: string) => void };

export function useWorkspaceContext() {
  return useOutletContext<WorkspaceContext>();
}