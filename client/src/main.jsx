import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import UserAdmin from './pages/UserAdmin.jsx'
import Default from './pages/Default.jsx'
import Directory from './pages/Directory.jsx'
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
        element: <Directory />,
      },
      {
        path: '/default',
        element: <Default />,
      },
      {
        path: '/admin',
        element: <UserAdmin />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
