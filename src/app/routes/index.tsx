import { createBrowserRouter } from "react-router";
import { AuthLayout, Login, Register } from "../auth";
// import { Workspace } from "../../components";
import { Dashboard, Projects, WorkspaceLayout, EditorPage } from "../workspace";
import { AddFileAndWorkspaceAction, AddNewFileDocumentAction, WorkspaceAction, loginAction, registerAction } from "./actions";
import { favoritesLoader, ProjectLoader, WorkspaceLoader } from "./loaders";


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
        loader: favoritesLoader,
        action: AddFileAndWorkspaceAction,
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
        loader: favoritesLoader,
        action: AddFileAndWorkspaceAction,
        hydrateFallbackElement: <>loading</>,
      },
      {
        path: "editor/:docId?",
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

