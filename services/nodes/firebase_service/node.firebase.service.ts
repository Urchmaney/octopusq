import { Node } from "@/models/node";
import { INodeServiceInterface } from "../node.service.interface";
import { Firestore, QueryDocumentSnapshot, addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { FirebaseApp } from "firebase/app";

export class NodeFirebaseService implements INodeServiceInterface {
  private appFirestore: Firestore
  readonly NODE_COLLECTION: string = "nodes"

  readonly FIREBASE_NODE_CONVERTER = {
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Node,
    toFirestore: (data: Partial<Node>) => data
  }

  constructor(firebas_app: FirebaseApp) {
    this.appFirestore = getFirestore(firebas_app)
  }
  async addNode(node: Node): Promise<Boolean> {
    try {
      const collectionRef = collection(this.appFirestore, this.NODE_COLLECTION).withConverter(this.FIREBASE_NODE_CONVERTER)
      await addDoc(collectionRef, node);
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  }
  
  async getNodes(): Promise<Node[]> {
    try {
      const collectionRef = collection(this.appFirestore, this.NODE_COLLECTION).withConverter(this.FIREBASE_NODE_CONVERTER);
      const snapshot = await getDocs(collectionRef);
      return snapshot.docs.map((x) =>  ({ id: x.id, title: x.data().title, edges: x.data().edges }) as Node);
    }
    catch(err) {
      return []
    }
  }

}