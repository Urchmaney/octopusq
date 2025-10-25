import { Params, redirect } from "react-router";
import { authService } from "../../services/auth/firebase";
import { firebaseDocumentAPI } from "../../services/documentApi";

const { userProfile } = authService;

export async function WorkspaceLoader() {
  try {
    const user = await userProfile();
    if (!user) return redirect("/auth/login");

    return {
      user: { email: user.email_address, fullName: user.full_name },
      workspaces: (await firebaseDocumentAPI.getProjects())
    };

  } catch (e) {
    return redirect("/auth/login");
  }
}

export async function ProjectLoader({
  params
}: { params: Params<"id"> }) {
  if (!params.id) return null;
  const question = await firebaseDocumentAPI.getQuestion(params.id);
  if (!question) return { question, documents: [] }
  const documents = await firebaseDocumentAPI.getQuestionDocuments(question.id);
  return { question, documents };
}

export async function favoritesLoader() {
  const favorites = await firebaseDocumentAPI.getFavoriteDocs()
  return { favorites }
}