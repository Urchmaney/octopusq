import { createBrowserRouter } from "react-router";
import { AuthLayout, Login, Register } from "../auth";
import { Workspace } from "../../components";
import { Dashboard } from "../dashboard";
import { dashboardAction, loginAction, registerAction } from "./actions";
import { dashboardLoader } from "./loaders";
import { DashboardLayout } from "../dashboard/layout";

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
    path: "dashboard",
    Component: DashboardLayout,
    action: dashboardAction,
    children: [
      {
        path: "",
        Component: Dashboard,
        hydrateFallbackElement: <>loading</>,
        loader: dashboardLoader
      }
    ]
  }
]);

