import { Node } from "@/models/node";
import { INodeServiceInterface } from "../node.service.interface";
import nodeJSON from "@/public/json/data.json"


export class NodeJsonService implements INodeServiceInterface {
  async getNodes(): Promise<Node[]> {
    const nodes = nodeJSON.nodes.reduce<{ [key: number]: Node }>((acc, node) => {
      acc[node.id] = node;
      return acc
    }, {})
    return Object.values(nodes);
  }

}