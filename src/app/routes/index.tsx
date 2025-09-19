import { createBrowserRouter } from "react-router";
import { AuthLayout, Login, Register } from "../auth";
// import { Workspace } from "../../components";
import { Dashboard, Projects, WorkspaceLayout, EditorPage } from "../workspace";
import { AddNewFileDocumentAction, WorkspaceAction, loginAction, registerAction } from "./actions";
import { ProjectLoader, WorkspaceLoader } from "./loaders";


export default createBrowserRouter([
  // {
  //   path: "/",
  //   element: (
  //     <Workspace>
  //       <p>Show me love</p>
  //     </Workspace>
  //   )
  // },
  {
    path: "/",
    Component: WorkspaceLayout,
    loader: WorkspaceLoader,
    action: WorkspaceAction,
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
        hydrateFallbackElement: <>loading</>
      },
      {
        path: "projects/:id",
        Component: Projects,
        hydrateFallbackElement: <>loading</>,
        loader: ProjectLoader,
        action: AddNewFileDocumentAction
      },
      {
        index: true,
        Component: Dashboard,
        hydrateFallbackElement: <>loading</>,
      },
      {
        path: "editor",
        Component: EditorPage,
        hydrateFallbackElement: <>loading</>
      }
    ]
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
]);

