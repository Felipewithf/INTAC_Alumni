import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";

import { useQuery, useMutation } from "@apollo/client";
import { GET_LOGGED_IN_USER, GET_USER_BY_ID } from "../utils/queries";
import { UPDATE_USER } from "../utils/mutations";

const ChangeYears = () => {
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

  const [updateUser] = useMutation(UPDATE_USER); // Mutation hook to update user

  const [newYearsValue, setNewYearsValue] = useState("");
  const [yearIsChanged, setYearIsChanged] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorForm, setErrorForm] = useState("");

  useEffect(() => {
    if (data?.getUserById?.years) {
      setNewYearsValue(data.getUserById.years.join(", "));
    }
  }, [data]);

  if (error) return <div>Error loading full user data: {error?.message}</div>;

  if (loading) {
    return <p>Loading user...</p>;
  }

  const handleYearsInput = (e) => {
    const newValue = e.target.value;
    setNewYearsValue(newValue);
    setYearIsChanged(newValue !== data?.getUserById?.years?.join(", "));
  };

  const handleSaveYears = async () => {
    setErrorForm("");

    if (!data) {
      setErrorForm("Failure to load your email data");
      return;
    }

    if (!newYearsValue.trim()) {
      setErrorForm("Years is required");
      return;
    }

    try {
      const yearsArray = newYearsValue
        .split(",")
        .map((year) => parseInt(year.trim()));
      await updateUser({
        variables: {
          updateUserId: data.getUserById.id,
          email: data.getUserById.email,
          years: yearsArray,
          register: data.getUserById.register,
          isAdmin: data.getUserById.isAdmin,
          schoolId: data.getUserById.school.id,
          designationRole: data.getUserById.designationRole,
        },
      });
      setSuccess(true);
      console.log(`User years: ${newYearsValue} - updated successfully`);
      setTimeout(() => {
        navigate("/alum");
      }, 2000);
    } catch (error) {
      console.error("Error updating user years:", error);
      setErrorForm("Failed to update years");
    }
  };

  return (
    <>
      <form id="createProfileForm" onSubmit={(e) => e.preventDefault()}>
        <h2>CHANGE YEARS</h2>
        <table className="user-table">
          <tbody>
            <tr>
              <td>Current years</td>
              <td>
                <input
                  type="text"
                  value={newYearsValue}
                  onChange={handleYearsInput}
                />
                <label>Enter the years separated by commas</label>
              </td>
            </tr>
          </tbody>
        </table>

        <br></br>
        <br></br>
        <br></br>

        {success ? (
          <p className="successMessage">Years Updated!</p>
        ) : (
          <>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button
              type="submit"
              disabled={!yearIsChanged || !/^[\d,\s]+$/.test(newYearsValue)}
              className={`button ${!yearIsChanged || !/^[\d,\s]+$/.test(newYearsValue) ? "disabled" : ""}`}
              onClick={handleSaveYears}
            >
              Update Years
            </button>
          </>
        )}
      </form>
    </>
  );
};

export default ChangeYears;
