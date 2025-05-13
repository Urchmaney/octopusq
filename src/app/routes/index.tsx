import { createBrowserRouter } from "react-router";
import { AuthLayout, Login, Register } from "../auth";
import { Workspace } from "../../components";
import { Dashboard, Projects, WorkspaceLayout } from "../workspace";
import { WorkspaceAction, loginAction, registerAction } from "./actions";
import { WorkspaceLoader } from "./loaders";

export default createBrowserRouter([
  {
    path: "/",
    element: (
      <Workspace>
        <p>Show me love</p>
      </Workspace>
    )
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
        action: loginAction
      },
      {
        path: "register",
        Component: Register,
        action: registerAction
      },

    ]
  },
  {
    path: "workspaces/:workspaceId?",
    Component: WorkspaceLayout,
    action: WorkspaceAction,
    loader: WorkspaceLoader,
    children: [
      {
        index: true,
        Component: Dashboard,
        hydrateFallbackElement: <>loading</>
      },
      {
        path: "dashboard",
        Component: Dashboard,
        hydrateFallbackElement: <>loading</>
      },
      {
        path: "projects",
        Component: Projects,
        hydrateFallbackElement: <>loading</>
      },
    ]
  }
]);

