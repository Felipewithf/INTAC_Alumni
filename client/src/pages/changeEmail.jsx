import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";

import { useQuery, useMutation } from "@apollo/client";
import { GET_LOGGED_IN_USER, GET_USER_BY_ID } from "../utils/queries";
import { UPDATE_USER } from "../utils/mutations";

const ChangeEmail = () => {
  const {
    loading: loadingUser,
    error: errorUser,
    data: userData,
  } = useQuery(GET_LOGGED_IN_USER);

  if (loadingUser) {
    return <p>Loading user...</p>;
  }

  if (errorUser) return <div>Error loading data: {errorUser?.message}</div>;

  const handleLogout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <>
      <div className="alumPage">
        <div className="topNavigation">
          <div></div>
          <div className="rightGroup">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <User userId={userData.getLoggedInUser.id}></User>
      </div>
    </>
  );
};

const User = ({ userId }) => {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { getUserByIdId: userId },
    skip: !userId, // Don't run the query until we have a userId
  });

  //console.log(data);

  const [updateUser] = useMutation(UPDATE_USER); // Mutation hook to update user

  const [currentEmailValue, setCurrentEmailValue] = useState("");
  const [newEmailValue, setNewEmailValue] = useState("");
  const [confirmEmailValue, setConfirmEmailValue] = useState("");

  const [success, setSuccess] = useState(false); // Success state for showing message
  const [errorForm, setErrorForm] = useState(""); // State to hold error message

  if (error) return <div>Error loading full user data: {error?.message}</div>;

  if (loading) {
    return <p>Loading user...</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm(""); // Clear previous error

    if (!data) {
      setErrorForm("Failure to load your email data");
      return;
    }

    if (!currentEmailValue.trim() || currentEmailValue !== data.getUserById.email) {
      setErrorForm("Current Email does not match our records"); // Show error if input is empty
      return;
    }

    if (!newEmailValue.trim()) {
      setErrorForm("Emnail is required"); // Show error if input is empty
      return;
    }

    if (!confirmEmailValue.trim() || confirmEmailValue !== newEmailValue) {
      setErrorForm("New email does not match"); // Show error if input is empty or doesnt not match with new email
      return;
    }

    try {
      await updateUser({
        variables: {
          updateUserId: data.getUserById.id,
          email: confirmEmailValue,
          years: data.getUserById.years,
          register: data.getUserById.register,
          isAdmin: data.getUserById.isAdmin,
          schoolId: data.getUserById.school.id,
          designationRole: data.getUserById.designationRole,
        },
      });
      setSuccess(true);
      console.log(`User email: ${confirmEmailValue} - updated successfully`);
      setTimeout(() => {
        navigate("/alum");
      }, 2000);
    } catch (error) {
      console.error("Error updating user email:", error);
    }
  };

  return (
    <>
      <form id="createProfileForm" onSubmit={handleSubmit}>
        <h2>CHANGE EMAIL</h2>
        <table className="user-table">
          <tbody>
            <tr>
              <td>Current email</td>
              <td>
                <input
                  type="text"
                  value={currentEmailValue}
                  onChange={(e) => setCurrentEmailValue(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>New Email</td>
              <td>
                <input
                  type="text"
                  value={newEmailValue}
                  onChange={(e) => setNewEmailValue(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Confirm New Email</td>
              <td>
                <input
                  type="text"
                  value={confirmEmailValue}
                  onChange={(e) => setConfirmEmailValue(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <br></br>
        <br></br>
        <br></br>
        {success ? (
          <p className="successMessage">Email Updated!</p> // Display success message
        ) : (
          <>
            {errorForm && <p style={{ color: "red" }}>{errorForm}</p>}
            <button
              type="submit"
              // disabled={
              //   currentEmailValue === "" ||
              //   newEmailValue === "" ||
              //   confirmEmailValue === ""
              // }
              className={`button ${
                currentEmailValue === "" ||
                newEmailValue === "" ||
                confirmEmailValue === ""
                  ? "disabled"
                  : ""
              }`}
              // onClick={() => console.log("submit data:", isPublicValue)}
            >
              Update Email
            </button>
          </>
        )}
      </form>
    </>
  );
};

export default ChangeEmail;
