import { addDoc, collection, doc, DocumentSnapshot, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
import { firestoreDb } from "./firebase";

export interface TDocument {
  id: string;
  name: string;
  content: string;
  questionId: string;
}

export interface Question {
  id: string;
  content: string;
  documentId: string;
  activeFwdDocumentId: string;
}
export interface DocumentAPI {
  getDocument: (documentId: string) => Promise<TDocument | null>;
  updateDocument: (documentId: string, document: Partial<TDocument>) => Promise<void>;
  addQuestion: (documentId: string, question: Omit<Question, "id">) => Promise<Question>;
  getQuestion: (questionId: string) => Promise<Question | null>;
  getQuestionDocuments: (questionId: string) => Promise<TDocument[]>;
  createNewDoc: (name: string, questionId: string) => Promise<TDocument>;
}

const documentConverter = {
  toFirestore: (doc: TDocument) => {
    return {
      name: doc.name,
      content: doc.content,
      questionId: doc.questionId
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
  },

  getQuestion: async function (questionId: string): Promise<Question | null> {
    const questionReference = doc(firestoreDb, "questions", questionId).withConverter(questionConverter);
    const questionSnapshot = await getDoc(questionReference);
    if (questionSnapshot.exists()) {
      return questionSnapshot.data();
    }
    return null;
  },

  getQuestionDocuments: async function (questionId: string): Promise<TDocument[]> {
    const q = query(collection(firestoreDb, "documents"), where("questionId", "==", questionId)).withConverter(documentConverter);
    const documentSnapshot = await getDocs(q);
    const documents: TDocument[] = [];
    documentSnapshot.forEach((doc) => {
      documents.push(doc.data());
    });
    return documents;
  },

  createNewDoc: async function (name: string, questionId: string): Promise<TDocument> {
    if (!questionId) throw 'Question must be present to create a document.'

    const documentCollection = collection(firestoreDb, "documents").withConverter(documentConverter);
    const content = "[]";
    const result = await addDoc(documentCollection, { name, questionId, content: "[]" } as TDocument);
    return { id: result.id, name, questionId, content }
  }
}