import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UserAdmin from "./pages/UserAdmin.jsx";
import Default from "./pages/Default.jsx";
import Community from "./pages/Community.jsx";
import LoginUser from "./pages/LoginUser.jsx";
import PrivateRoute from "./components/PrivateRoute/index.jsx";
import CheckRegistration from "./components/PrivateRoute/checkRegistration.jsx";
import MagicLogin from "./pages/MagicLogin.jsx";
import Alum from "./pages/Alum.jsx";
import NewAlum from "./pages/NewAlum.jsx";
import ChangeEmail from "./pages/changeEmail.jsx";

import App from "./App.jsx";

import "./index.css";
import Announcements from "./pages/announcements.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    //errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Community />,
      },
      {
        path: "/default",
        element: <Default />,
      },
      {
        path: "/a",
        element: <Announcements />,
      },
      {
        path: "/admin",
        element: (
          <PrivateRoute>
            <UserAdmin />
          </PrivateRoute>
        ),
      },
      {
        path: "/alum",
        element: (
          <CheckRegistration>
            <Alum />
          </CheckRegistration>
        ),
      },
      {
        path: "/changeemail",
        element: (
          <PrivateRoute>
            <ChangeEmail />
          </PrivateRoute>
        ),
      },
      {
        path: "/newAlum",
        element: (
          <PrivateRoute>
            <NewAlum />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <LoginUser />,
      },
      { path: "/magic-login", element: <MagicLogin /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
