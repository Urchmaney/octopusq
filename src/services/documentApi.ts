import { addDoc, collection, doc, DocumentSnapshot, getDoc, updateDoc } from "firebase/firestore/lite";
import { firestoreDb } from "./firebase";

export interface TDocument {
  id: string;
  name: string
  content: string
}

export interface Question {
  id: string;
  content: string;
  documentId: string;
  activeFwdDocumentId: string;
}
export interface DocumentAPI {
  getDocument: (documentId: string) => Promise<TDocument | null>
  updateDocument: (documentId: string, document: Partial<TDocument>) => Promise<void>;
  addQuestion: (documentId: string, question: Omit<Question, "id">) => Promise<Question>;
}

const documentConverter = {
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

const questionConverter = {
  toFirestore: (question: Question) => {
    return {
      content: question.content,
      documentId: question.documentId,
      activeFwdDocumentId: question.activeFwdDocumentId,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot) => {
    const data = snapshot.data();
    return { documentId: data?.documentId, activeFwdDocumentId: data?.activeFwdDocumentId, content: data?.content, id: snapshot.id } as Question;
  },
}


export const firebaseDocumentAPI: DocumentAPI = {
  getDocument: async function (documentId: string): Promise<TDocument | null> {
    const documentReference = doc(firestoreDb, "documents", documentId).withConverter(documentConverter);
    const docSnapshot = await getDoc(documentReference);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    }
    return null;
  },

  updateDocument: async function (documentId: string, document: Partial<TDocument>): Promise<void> {
    const documentReference = doc(firestoreDb, "documents", documentId).withConverter(documentConverter);
    return updateDoc(documentReference, {
      ...document
    });
  },
  addQuestion: async function (documentId: string, question: Omit<Question, "id">): Promise<Question> {
    const questionCollection = collection(firestoreDb, "questions").withConverter(questionConverter);
    const docRef = await addDoc(questionCollection, { ...question, documentId } as Omit<Question, "id">);
    return { ...question, id: docRef.id };
  }
}