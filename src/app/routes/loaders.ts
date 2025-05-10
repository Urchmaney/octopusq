import { redirect } from "react-router";
import { userProfile } from "../../services";

export async function dashboardLoader() {
  try {
    const user = await userProfile();
    if (!user) return redirect("/auth/login");
    return user;
  } catch (e) {
    return redirect("/auth/login");
  }
}