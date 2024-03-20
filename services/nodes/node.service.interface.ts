import { Node } from "../../models/node";

export interface INodeServiceInterface {
    getNodes() : Promise<Node[]>
}