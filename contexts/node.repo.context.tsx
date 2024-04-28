import { NodeFirebaseService, FirestoreService } from "@/services/nodes/firebase_service/node.firebase.service";
import { NodeJsonService } from "@/services/nodes/json_service/node.json.service";
import { INodeServiceInterface } from "@/services/nodes/node.service.interface";
import React, { useMemo } from "react";
import firebase_app from "@/firebase";
import { Node } from "@/models/node";


export const NodeRepoContext: React.Context<INodeServiceInterface | null> = React.createContext<INodeServiceInterface | null>(null);

export const useNodeRepoContext = () => React.useContext(NodeRepoContext);

export const NodeRepoContextProvider = (
  { children }: { children: React.ReactNode }
) => {
  // const nodeRepoService: INodeServiceInterface = useMemo(() => new NodeJsonService(), [])
  // const nodeRepoService: INodeServiceInterface = useMemo(() => new NodeFirebaseService(firebase_app), [])

  const nodeRepoService: INodeServiceInterface = useMemo(() => new FirestoreService<Node>(firebase_app, "nodes", "node").functions() as unknown as INodeServiceInterface, [])

  // console.log(new FirestoreService<Node>(firebase_app, "nodes", "node").functions());

  // const nodeRepoService: INodeServiceInterface = useMemo(() => {
  //   const  nodeService = new FirestoreService<Node>(firebase_app, "nodes", "node").functions();
  //    return nodeService as unknown as INodeServiceInterface
  // }, [])
  return (
    <NodeRepoContext.Provider value={nodeRepoService}>
      {children}
    </NodeRepoContext.Provider>
  )
}
