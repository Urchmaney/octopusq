import { useWorkspaceContext } from "../../hooks";


export function Dashboard() {
  const { activeWorkspace } = useWorkspaceContext();
  return (
    <div className="text-2xl text-black">{`Dashboard ${activeWorkspace}`}</div>
  );
}