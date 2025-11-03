import { ActionFunctionArgs, redirect } from "react-router";
import { AxiosError } from "axios";
import { firebaseDocumentAPI } from "../../services/documentApi";
import { authService } from "../../services";

const { login, register, logout } = authService;

function handleError(error: unknown) {
  const errors = (error as AxiosError).response?.data || (error as AxiosError).message;
  return { errors: Array.isArray(errors) ? errors : [errors] }
}

export async function loginAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    await login(
      formData.get("email")?.toString() || "",
      formData.get("password")?.toString() || ""
    );
    return redirect("/");
  } catch (e) {
    return handleError(e);
  }
}

export async function registerAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();

    await register(
      formData.get("email")?.toString() || "",
      formData.get("password")?.toString() || "",
      formData.get("full_name")?.toString() || "",
    );
    return redirect("/");
  } catch (e) {
    return handleError(e);
  }
}

// export async function WorkspaceAction({ request }: ActionFunctionArgs) {
//   const formData = await request.formData();
//   const actionType = formData.get("action_type");
//   switch (actionType) {
//     case "logout":
//       await logout();
//       return redirect("/auth/login");
//     case "create_workspace":
//       try {
//         const result = await createUserWorkspace(formData.get("workspace_name") as string);
//         return { data: result.data };
//       }catch(e) {
//         return handleError(e);
//       }
//     default:
//   }
// }

export async function WorkspaceAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("action_type");
  switch (actionType) {
    case "logout":
      await logout();
      return redirect("/auth/login");
    case "create_workspace":
      try {
        const result = await firebaseDocumentAPI.addQuestion(null, {
          content: formData.get("workspace_name") as string,
          documentId: null,
          activeFwdDocumentId: "",
          activeFwdDocumentResultId: ""
        })
        return { data: { name: result.content, id: result.id } };
      } catch (e) {
        return handleError(e);
      }
    default:
  }
}

export async function AddNewFileDocumentAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const document = await firebaseDocumentAPI.createNewDoc(
      formData.get("file_name") as string,
      formData.get("question") as string,
      []
    );
    return { data: document, errors: [] };
  }
  catch (e) {
    return handleError(e);
  }
}

export async function AddFileAndWorkspaceAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const workspaceName = formData.get("workspace_name") as string;
    const selectedWorkspaceId = formData.get("workspace_id") as string;
    const fileName = formData.get("file_name") as string;
    let workspaceId: string = selectedWorkspaceId;
    if (selectedWorkspaceId === "__create_new__") {
      const newQuestion = await firebaseDocumentAPI.addQuestion(null, {
        content: workspaceName,
        documentId: null,
        activeFwdDocumentId: "",
        activeFwdDocumentResultId: ""
      });
      workspaceId = newQuestion.id;
    }
    const newDocument = await firebaseDocumentAPI.createNewDoc(
      fileName,
      workspaceId,
      []
    );
    await firebaseDocumentAPI.setQuestionActiveDocument(workspaceId, newDocument);
    await firebaseDocumentAPI.addDocToFavorite(newDocument.id);

    return { data: {
      document: newDocument, workspaceId }, errors: [] };
  }
  catch (e) {
    return handleError(e);
  }
}

