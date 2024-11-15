import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";

import { useQuery, useMutation } from "@apollo/client";
import { GET_LOGGED_IN_USER } from "../utils/queries";
import { CREATE_ALUMPROFILE } from "../utils/mutations";

const NewAlum = () => {
  const navigate = useNavigate();

  const {
    loading: loadingUser,
    error: errorUser,
    data: userData,
    refetch,
  } = useQuery(GET_LOGGED_IN_USER);

  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");
  const [bioValue, setBioValue] = useState("");
  const [isPublicValue, setIsPublicValue] = useState(true);

  const [success, setSuccess] = useState(false); // Success state for showing message
  const [error, setError] = useState(""); // State to hold error message

  const [createAlumProfile] = useMutation(CREATE_ALUMPROFILE);

  if (loadingUser) {
    return <p>Loading users...</p>;
  }

  if (errorUser) return <div>Error loading data: {errorUser?.message}</div>;

  const handleLogout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstNameValue.trim()) {
      setError("First name is required"); // Show error if input is empty
      return;
    }

    if (!lastNameValue.trim()) {
      setError("Last name is required"); // Show error if input is empty
      return;
    }

    setError(""); // Clear any previous error if input is not empty

    try {
      // Call the update mutation
      await createAlumProfile({
        variables: {
          firstName: firstNameValue,
          lastName: lastNameValue,
          bio: bioValue,
          public: isPublicValue,
          websiteLinks: [],
          exhibitions: [],
          socialMedia: [],
          exhibitionsReferences: [],
          userId: userData.getLoggedInUser.id,
        },
      });

      // Handle success (e.g., show a success message or close modal)
      setSuccess(true);
      const checkRegistration = setInterval(async () => {
        const { data: updatedData } = await refetch();
        if (updatedData.getLoggedInUser.register) {
          clearInterval(checkRegistration);
          navigate("/alum");
        }
      }, 500); // Poll every 500ms
    } catch (error) {
      console.error("Error creating Alum profile:", error);
    }
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

        <form id="createProfileForm" onSubmit={handleSubmit}>
          <h2>CREATE A PROFILE</h2>
          <table className="user-table">
            <tbody>
              <tr>
                <td>First Name</td>
                <td>
                  <input
                    type="text"
                    value={firstNameValue}
                    onChange={(e) => setFirstNameValue(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Last Name</td>
                <td>
                  <input
                    type="text"
                    value={lastNameValue}
                    onChange={(e) => setLastNameValue(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Bio</td>
                <td>
                  <textarea
                    type="text"
                    value={bioValue}
                    onChange={(e) => setBioValue(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Profile Visibility</td>
                <td>
                  <select
                    value={isPublicValue}
                    onChange={(e) => setIsPublicValue(e.target.value === "true")}
                  >
                    <option value="true">Public</option>
                    <option value="false">Private</option>
                  </select>
                  <label>
                    Private profile will be hidden to the public, but will be visible to
                    INTAC users when they are logged in.
                  </label>
                </td>
              </tr>
            </tbody>
          </table>

          <br></br>
          <br></br>
          <br></br>
          {success ? (
            <p className="successMessage">Saved!</p> // Display success message
          ) : (
            <>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button
                type="submit"
                disabled={
                  firstNameValue === "" || lastNameValue === "" || bioValue === ""
                }
                className={`button ${
                  firstNameValue === "" || lastNameValue === "" || bioValue === ""
                    ? "disabled"
                    : ""
                }`}
                onClick={() => console.log("isPublicValue:", isPublicValue)}
              >
                Save Profile
              </button>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default NewAlum;
