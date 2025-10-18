import { addDoc, arrayUnion, collection, doc, documentId, DocumentSnapshot, getDoc, getDocs, limit, query, setDoc, updateDoc, where } from "firebase/firestore/lite";
import { firestoreDb } from "./firebase";
import { authService } from "./auth";

export interface TDocument {
  id: string;
  name: string;
  content: string;
  questionId: string;
  resultId: string;
  parentQuestionIds: string[];
}

export interface TDocumentResult {
  id: string;
  documentId: string;
  content: string;
}

export interface Question {
  id: string;
  content: string;
  documentId: string | null;
  activeFwdDocumentId: string;
  activeFwdDocumentResultId?: string;
}
export interface DocumentAPI {
  getProjects: () => Promise<Question[]>;
  getDocument: (documentId: string) => Promise<TDocument | null>;
  updateDocument: (documentId: string, document: Partial<TDocument>) => Promise<void>;
  addQuestion: (documentId: string | null, question: Omit<Question, "id">) => Promise<Question>;
  getQuestion: (questionId: string) => Promise<Question | null>;
  setQuestionActiveDocument: (questionId: string, document: TDocument) => Promise<void>;
  getQuestionDocuments: (questionId: string) => Promise<TDocument[]>;
  createNewDoc: (name: string, questionId: string, parentQuestionIds: Array<string>) => Promise<TDocument>;

  getDocumentResult: (documentResultId: string) => Promise<TDocumentResult | null>;
  updateDocumentResult: (documentResultId: string, content: string) => Promise<void>;

  getFavoriteDocs: () => Promise<TDocument[]>
  addDocToFavorite: (docId: string) => Promise<boolean>;
}

const documentConverter = {
  toFirestore: (doc: TDocument) => ({
    name: doc.name,
    content: doc.content,
    questionId: doc.questionId,
    resultId: doc.resultId,
    parentQuestionIds: doc.parentQuestionIds
  }),
  fromFirestore: (snapshot: DocumentSnapshot) => {
    const data = snapshot.data();
    return { name: data?.name, content: data?.content, id: snapshot.id, resultId: data?.resultId, parentQuestionIds: data?.parentQuestionIds } as TDocument;
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
      activeFwdDocumentResultId: question.activeFwdDocumentResultId
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot) => {
    const data = snapshot.data();
    return { documentId: data?.documentId, activeFwdDocumentId: data?.activeFwdDocumentId, content: data?.content, id: snapshot.id, activeFwdDocumentResultId: data?.activeFwdDocumentResultId } as Question;
  },
}

const documentCollection = (userId: string) => collection(firestoreDb, "users", userId, "documents").withConverter(documentConverter);
const resultDocumentCollection = (userId: string) => collection(firestoreDb, "users", userId, "document_results").withConverter(documentResultConverter);
const questionCollection = (userId: string) => collection(firestoreDb, "users", userId, "questions").withConverter(questionConverter);
const favoriteCollection = (userId: string) => collection(firestoreDb, "users", userId, "favorites");

const getDocumentReference = (id: string, userId: string) => doc(firestoreDb, "users", userId, "documents", id).withConverter(documentConverter);
const getResultDocumentReference = (id: string, userId: string) => doc(firestoreDb, "users", userId, "document_results", id).withConverter(documentResultConverter);
const getQuestionReference = (id: string, userId: string) => doc(firestoreDb, "users", userId, "questions", id).withConverter(questionConverter);

const { getCurrentUser } = authService

async function getUserId(): Promise<string> {
  const userId = await getCurrentUser();
  if (!userId) throw "not logged in";

  return userId;
}


export const firebaseDocumentAPI: DocumentAPI = {
  getDocument: async function (documentId: string): Promise<TDocument | null> {
    const userId = await getUserId()
    const docSnapshot = await getDoc(getDocumentReference(documentId, userId));
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    }
    return null;
  },

  updateDocument: async function (documentId: string, document: Partial<TDocument>): Promise<void> {
    const userId = await getUserId();
    return updateDoc(getDocumentReference(documentId, userId), {
      ...document
    });
  },

  addQuestion: async function (documentId: string | null, question: Omit<Question, "id">): Promise<Question> {
    const userId = await getUserId();
    const docRef = await addDoc(questionCollection(userId), { ...question, documentId } as Omit<Question, "id">);
    return { ...question, id: docRef.id };
  },

  getQuestion: async function (questionId: string): Promise<Question | null> {
    const userId = await getUserId();
    const questionSnapshot = await getDoc(getQuestionReference(questionId, userId));
    if (questionSnapshot.exists()) {
      return questionSnapshot.data();
    }
    return null;
  },

  getQuestionDocuments: async function (questionId: string): Promise<TDocument[]> {
    const userId = await getUserId();
    const q = query(documentCollection(userId), where("questionId", "==", questionId));
    const documentSnapshot = await getDocs(q);
    const documents: TDocument[] = [];
    documentSnapshot.forEach((doc) => {
      documents.push(doc.data());
    });
    return documents;
  },

  createNewDoc: async function (name: string, questionId: string, parentQuestionIds: Array<string>): Promise<TDocument> {
    const userId = await getUserId();
    if (!questionId) throw 'Question must be present to create a document.';
    const content = "[]";
    const resultDocument = doc(resultDocumentCollection(userId));
    parentQuestionIds = [...parentQuestionIds, questionId];
    const document = await addDoc(documentCollection(userId), { name, questionId, content, resultId: resultDocument.id, parentQuestionIds } as TDocument);
    await setDoc(resultDocument, { content: '[]', documentId: document.id, id: resultDocument.id });
    return { id: document.id, name, questionId, content, parentQuestionIds, resultId: resultDocument.id };
  },

  updateDocumentResult: async function (documentResultId: string, content: string): Promise<void> {
    const userId = await getUserId();
    return updateDoc(getResultDocumentReference(documentResultId, userId), {
      content
    });
  },

  getDocumentResult: async function (documentResultId: string): Promise<TDocumentResult | null> {
    const userId = await getUserId();
    const documentResultSnapshot = await getDoc(getResultDocumentReference(documentResultId, userId));
    if (!documentResultSnapshot.exists()) return null;
    return documentResultSnapshot.data();
  },

  setQuestionActiveDocument: async function (questionId: string, document: TDocument): Promise<void> {
    const userId = await getUserId();
    await updateDoc(getQuestionReference(questionId, userId), { activeFwdDocumentId: document.id });
  },

  getFavoriteDocs: async function (): Promise<TDocument[]> {
    const userId = await getUserId();
    const firstDocumentQuery = query(favoriteCollection(userId), limit(1));
    const documentSnapshot = await getDocs(firstDocumentQuery);
    if (documentSnapshot.empty) return [];

    const favoritesIds = documentSnapshot.docs[0].data().data as Array<string>;
    const docsQuery = query(documentCollection(userId), where(documentId(), 'in', favoritesIds));

    const querySnapshot = await getDocs(docsQuery);
    const documents: TDocument[] = [];
    querySnapshot.forEach((doc) => documents.push(doc.data()));
    return documents;
  },

  addDocToFavorite: async function (docId: string): Promise<boolean> {
    const userId = await getUserId();
    try {
      if (!docId) return false;
      const firstDocumentQuery = query(favoriteCollection(userId), limit(1));
      const documentSnapshot = await getDocs(firstDocumentQuery);
      if (documentSnapshot.empty) return false;

      const ref = doc(favoriteCollection(userId), documentSnapshot.docs[0].id);
      await updateDoc(ref, { data: arrayUnion(docId) });
      return true;
    } catch (e) {
      return false;
    }
  },
  getProjects: async function (): Promise<Question[]> {
    const userId = await getUserId();
    const q = query(questionCollection(userId), where("documentId", '==', null));
    const querySnapshot = await getDocs(q);
    const questions: Question[] = [];
    querySnapshot.forEach((doc) => {
      questions.push(doc.data());
    });

    return questions;
  }
}
