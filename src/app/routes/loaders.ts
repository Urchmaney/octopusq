import { Params, redirect } from "react-router";
import { userProfile } from "../../services";
import { firebaseDocumentAPI } from "../../services/documentApi";

export async function WorkspaceLoader() {
  try {
    const user = (await userProfile()).data;
    if (!user) return redirect("/auth/login");

    // const workspaces = (await userWorkspaces()).data;

    return {
      user: { email: user.email_address, fullName: user.full_name },
      workspaces: (await firebaseDocumentAPI.getProjects()).map(x => ({ id: x.id, name: x.content }))
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