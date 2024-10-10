import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import UserAdmin from './pages/UserAdmin.jsx'
import Default from './pages/Default.jsx'
import Community from './pages/Community.jsx'
import LoginUser from './pages/LoginUser.jsx'
import PrivateRoute from './components/PrivateRoute/index.jsx'
import MagicLogin from './pages/MagicLogin.jsx'
import App from './App.jsx'

import './index.css'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Community />,
      },
      {
        path: '/default',
        element: <Default />,
      },
      {
        path: '/admin',
        element: <PrivateRoute><UserAdmin /></PrivateRoute>,
      },
      {
        path: '/login',
        element: <LoginUser />,
      },
      { path: '/magic-login', 
      element: <MagicLogin /> 
      }, 
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
