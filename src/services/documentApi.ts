import { addDoc, collection, doc, DocumentSnapshot, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore/lite";
import { firestoreDb } from "./firebase";

export interface TDocument {
  id: string;
  name: string;
  content: string;
  questionId: string;
  resultId: string;
}

export interface TDocumentResult {
  id: string;
  documentId: string;
  content: string;
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

  getDocumentResult: (documentResultId: string) => Promise<TDocumentResult | null>;
  updateDocumentResult: (documentResultId: string, content: string) => Promise<void>;
}

const documentConverter = {
  toFirestore: (doc: TDocument) => ({
    name: doc.name,
    content: doc.content,
    questionId: doc.questionId,
    resultId: doc.resultId
  }),
  fromFirestore: (snapshot: DocumentSnapshot) => {
    const data = snapshot.data();
    return { name: data?.name, content: data?.content, id: snapshot.id, resultId: data?.resultId } as TDocument;
  },
};

const documentResultConverter = {
  toFirestore: (doc: TDocumentResult) => ({
    documentId: doc.documentId,
    content: doc.content,
  }),
  fromFirestore: (snapshot: DocumentSnapshot) => {
    const data = snapshot.data();
    return { documentId: data?.documentId, content: data?.content, id: snapshot.id } as TDocumentResult;
  }
}

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

const documentCollection = collection(firestoreDb, "documents").withConverter(documentConverter);
const resultDocumentCollection = collection(firestoreDb, "document_results").withConverter(documentResultConverter);
const questionCollection = collection(firestoreDb, "questions").withConverter(questionConverter);

const getDocumentReference = (id: string) => doc(firestoreDb, "documents", id).withConverter(documentConverter);
const getResultDocumentReference = (id: string) => doc(firestoreDb, "document_results", id).withConverter(documentResultConverter);
const getQuestionReference = (id: string) => doc(firestoreDb, "questions", id).withConverter(questionConverter);

export const firebaseDocumentAPI: DocumentAPI = {
  getDocument: async function (documentId: string): Promise<TDocument | null> {
    const docSnapshot = await getDoc(getDocumentReference(documentId));
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    }
    return null;
  },

  updateDocument: async function (documentId: string, document: Partial<TDocument>): Promise<void> {
    return updateDoc(getDocumentReference(documentId), {
      ...document
    });
  },

  addQuestion: async function (documentId: string, question: Omit<Question, "id">): Promise<Question> {
    const docRef = await addDoc(questionCollection, { ...question, documentId } as Omit<Question, "id">);
    return { ...question, id: docRef.id };
  },

  getQuestion: async function (questionId: string): Promise<Question | null> {
    const questionSnapshot = await getDoc(getQuestionReference(questionId));
    if (questionSnapshot.exists()) {
      return questionSnapshot.data();
    }
    return null;
  },

  getQuestionDocuments: async function (questionId: string): Promise<TDocument[]> {
    const q = query(documentCollection, where("questionId", "==", questionId))
    const documentSnapshot = await getDocs(q);
    const documents: TDocument[] = [];
    documentSnapshot.forEach((doc) => {
      documents.push(doc.data());
    });
    return documents;
  },

  createNewDoc: async function (name: string, questionId: string): Promise<TDocument> {
    if (!questionId) throw 'Question must be present to create a document.';
    const content = "[]";
    const resultDocument = doc(resultDocumentCollection);
    const document = await addDoc(documentCollection, { name, questionId, content, resultId: resultDocument.id } as TDocument);
    await setDoc(resultDocument, { content: '[]', documentId: document.id, id: resultDocument.id })
    return { id: document.id, name, questionId, content, resultId: resultDocument.id };
  },

  updateDocumentResult: function (documentResultId: string, content: string): Promise<void> {
    return updateDoc(getResultDocumentReference(documentResultId), {
      content
    });
  },

  getDocumentResult: async function (documentResultId: string): Promise<TDocumentResult | null> {
    const documentResultSnapshot = await getDoc(getResultDocumentReference(documentResultId));
    if (!documentResultSnapshot.exists()) return null;
    return documentResultSnapshot.data();
  }
}