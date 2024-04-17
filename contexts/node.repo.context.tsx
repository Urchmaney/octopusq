import { NodeFirebaseService } from "@/services/nodes/firebase_service/node.firebase.service";
import { NodeJsonService } from "@/services/nodes/json_service/node.json.service";
import { INodeServiceInterface } from "@/services/nodes/node.service.interface";
import React, { useMemo } from "react";
import firebase_app from "@/firebase";


export const NodeRepoContext: React.Context<INodeServiceInterface | null> = React.createContext<INodeServiceInterface | null>(null);

export const useNodeRepoContext = () => React.useContext(NodeRepoContext);

export const NodeRepoContextProvider = (
  { children }: { children: React.ReactNode }
) => {
  // const nodeRepoService: INodeServiceInterface = useMemo(() => new NodeJsonService(), [])
  const nodeRepoService: INodeServiceInterface = useMemo(() => new NodeFirebaseService(firebase_app), [])
  return (
    <NodeRepoContext.Provider value={nodeRepoService}>
      {children}
    </NodeRepoContext.Provider>
  )
}
