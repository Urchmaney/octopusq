import { createBrowserRouter } from "react-router";
import { AuthLayout, Login, Register } from "./auth";
import { Workspace } from "../components";

const router = createBrowserRouter([
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
      { path: "login", Component: Login },
      { path: "register", Component: Register },

    ]
  }
]);

export default router;