import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UserAdmin from "./pages/UserAdmin.jsx";
import Community from "./pages/Community.jsx";
import Home from "./pages/home.jsx";
import LoginUser from "./pages/LoginUser.jsx";
import PrivateRoute from "./components/PrivateRoute/index.jsx";
import CheckRegistration from "./components/PrivateRoute/checkRegistration.jsx";
import AdminRoute from "./components/PrivateRoute/AdminRoute.jsx";
import MagicLogin from "./pages/MagicLogin.jsx";
import Alum from "./pages/Alum.jsx";
import NewAlum from "./pages/NewAlum.jsx";
import ChangeEmail from "./pages/changeEmail.jsx";
import ChangeYears from "./pages/changeYears.jsx";
import Announcements from "./pages/Announcements.jsx";
import CreateAnnouncement from "./pages/CreateAnnouncement.jsx";
import EmailAnnouncement from "./pages/EmailAnnouncement.jsx";
import App from "./App.jsx";

import "./stylecards.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    //errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/community",
        element: <Community />,
      },
      {
        path: "/a",
        element: <Announcements />,
      },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <UserAdmin />
          </AdminRoute>
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
        path: "/changeyears",
        element: (
          <PrivateRoute>
            <ChangeYears />
          </PrivateRoute>
        ),
      },
      {
        path: "/newannouncement",
        element: (
          <PrivateRoute>
            <CreateAnnouncement />
          </PrivateRoute>
        ),
      },
      {
        path: "/ea/:aid",
        element: (
          <PrivateRoute>
            <EmailAnnouncement />
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
