import { Navigate } from "react-router-dom";
import { GET_LOGGED_IN_USER } from "../../utils/queries";
import { useQuery } from "@apollo/client";

const CheckRegistration = ({ children }) => {
  const token = localStorage.getItem("id_token");
  const { loading, error, data: userData } = useQuery(GET_LOGGED_IN_USER);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error fetching user data: {error.message}</p>;

  if (!userData.getLoggedInUser.register) {
    return <Navigate to="/newAlum" replace />;
  }

  return children;
};

export default CheckRegistration;
