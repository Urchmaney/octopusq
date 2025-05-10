import { ActionFunctionArgs, redirect } from "react-router";
import { login, register } from "../../services";
import { AxiosError } from "axios";

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
    return redirect("/dashboard");
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
    return redirect("/dashboard");
  } catch (e) {
    return handleError(e);
  }
}

