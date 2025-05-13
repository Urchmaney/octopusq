import { redirect } from "react-router";
import { userProfile, userWorkspaces } from "../../services";

export async function WorkspaceLoader() {
  try {
    const user = (await userProfile()).data;
    if (!user) return redirect("/auth/login");
    
    const workspaces = (await userWorkspaces()).data;
    
    return {
      user: { email: user.email_address, fullName: user.full_name },
      workspaces
    };
  } catch (e) {
    return redirect("/auth/login");
  }
}