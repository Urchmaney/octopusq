import { collection, doc, DocumentSnapshot, getDoc, updateDoc } from "firebase/firestore/lite";
import { firestoreDb } from "./firebase";

export interface TDocument {
  id: string;
  name: string
  content: string
}
export interface DocumentAPI {
  getDocument: (documentId: string) => Promise<TDocument | null>
  updateDocument: (documentId: string, document: Partial<TDocument>) => Promise<void>;
}

const DocumentConverter = {
  toFirestore: (doc: TDocument) => {
    return {
      name: doc.name,
      content: doc.content,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot) => {
    const data = snapshot.data();
    return { name: data?.name, content: data?.content, id: snapshot.id } as TDocument;
  },
};


export const firebaseDocumentAPI: DocumentAPI = {
  getDocument: async function (documentId: string): Promise<TDocument | null> {
    const documentReference = doc(firestoreDb, "documents", documentId).withConverter(DocumentConverter);
    const docSnapshot = await getDoc(documentReference);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    }
    return null
  },

  updateDocument: async function (documentId: string, document: Partial<TDocument>): Promise<void> {
    const documentReference = doc(firestoreDb, "documents", documentId).withConverter(DocumentConverter);
    return updateDoc(documentReference, {
      ...document
    });
  }
}