import { Navigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_LOGGED_IN_USER } from '../../utils/queries';
import Auth from '../../utils/auth';

const AdminRoute = ({ children }) => {
  const token = Auth.getToken();

  // If no token, redirect to login
  if (!token || !Auth.loggedIn()) {
    return <Navigate to="/login" replace />;
  }

  // Query to check if user is admin
  const { loading, error, data } = useQuery(GET_LOGGED_IN_USER);

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // If error or user is not admin, redirect
  if (error || !data?.getLoggedInUser?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is admin, render children
  return children;
};

export default AdminRoute;
