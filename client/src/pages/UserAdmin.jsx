import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, GET_LOGGED_IN_USER, GET_SCHOOLS } from "../utils/queries";
import { DELETE_USER, UPDATE_USER } from "../utils/mutations";

import AddUserModal from "../components/modals/addUser";
import { designationRoles } from "../utils/staticSettings";

const UserAdmin = () => {
  const [yearInput, setYearInput] = useState();
  const [yearIsChanged, setYearIsChanged] = useState(false);
  const [userIdYearChanged, setUserIdYearChanged] = useState();
  const [deleteUser] = useMutation(DELETE_USER);

  const { loading, error, data } = useQuery(GET_USERS);

  const {
    loading: loadingSchools,
    error: errorSchool,
    data: schoolData,
  } = useQuery(GET_SCHOOLS);

  const {
    loading: loadingUser,
    error: errorUser,
    data: userData,
  } = useQuery(GET_LOGGED_IN_USER);

  const [updateUser] = useMutation(UPDATE_USER); // Mutation hook to update user

  const deleteUserById = async (id) => {
    console.log(id);
    try {
      await deleteUser({
        variables: {
          deleteUserId: id,
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 500); // Wait half a second before reloading
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // State to control modal visibility
  const [isModalVisible, setModalVisible] = useState(false);

  if (loading || loadingUser || loadingSchools) {
    return <p>Loading users...</p>;
  }

  if (error || errorUser || errorSchool) {
    return (
      <p>
        Error loading: {error ? error.message : ""} or error verifying user:{" "}
        {errorUser ? errorUser.message : ""} or error loading schools:{" "}
        {errorSchool ? errorSchool.message : ""}
      </p>
    );
  }

  const schools =
    schoolData && schoolData.getSchools ? schoolData.getSchools : [];
  const users = data?.getUsers || [];
  const loggedInUser = userData?.getLoggedInUser || null;

  // Function to toggle modal visibility
  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleChange = async (userId, field, e, schoolId) => {
    let value = e.target.value;

    // Convert "true"/"false" string to boolean for 'isAdmin' field
    if (field === "isAdmin") {
      value = value === "true"; // Convert string to boolean
    }

    const user = users.find((u) => u.id === userId); // Find the specific user
    const updatedUser = { ...user, [field]: value }; // Update the specific field
    try {
      await updateUser({
        variables: {
          updateUserId: userId,
          register: updatedUser.register,
          isAdmin: updatedUser.isAdmin,
          email: updatedUser.email,
          schoolId, // Pass schoolId directly, not as part of updatedUser
          years: updatedUser.years,
          designationRole: updatedUser.designationRole,
        },
      });
      console.log(`User ${userId} updated successfully`);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSchoolChange = async (userId, field, e) => {
    let value = e.target.value;

    const user = users.find((u) => u.id === userId); // Find the specific user
    const updatedUser = { ...user, [field]: value }; // Update the specific field
    try {
      await updateUser({
        variables: {
          updateUserId: userId,
          isAdmin: updatedUser.isAdmin,
          register: updatedUser.register,
          email: updatedUser.email,
          schoolId: value, // Pass schoolId directly, not as part of updatedUser
          years: updatedUser.years,
          designationRole: updatedUser.designationRole,
        },
      });
      console.log(`User ${userId} updated successfully`);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleYearsInput = async (userId, e) => {
    const newYearValue = e.target.value;

    // Find the user by userId from the list of users
    const userToUpdate = users.find((u) => u.id === userId);

    if (userToUpdate) {
      // Compare new input with original years
      const originalYears = userToUpdate.years.join(", ");
      setYearIsChanged(newYearValue !== originalYears); // Set the state only if the values differ
      setUserIdYearChanged(userId); // Track the userId for which the change was made
      setYearInput(newYearValue); // Update the year input
    }
  };

  const handleSaveYears = async (userId, field, schoolId) => {
    const yearsArray = yearInput
      .split(",")
      .map((year) => parseInt(year.trim()));

    const user = users.find((u) => u.id === userId); // Find the specific user
    const updatedUser = { ...user, [field]: yearsArray }; // Update the specific field
    try {
      await updateUser({
        variables: {
          updateUserId: userId,
          email: updatedUser.email,
          schoolId: schoolId, // Pass schoolId directly, not as part of updatedUser
          years: updatedUser.years,
          designationRole: updatedUser.designationRole,
          isAdmin: updatedUser.isAdmin,
          register: updatedUser.register,
        },
      });
      console.log(`User ${userId} updated successfully`);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <div>
        <div className="constructionBanner">
          <h3>Admin Dashboard</h3>
        </div>
        {users.length > 0 ? (
          <>
            <h2>ADMINS</h2>

            <table className="user-table" id="adminUserTable">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Year(s)</th>
                  <th>Community Role</th>
                  <th>School</th>
                  <th>Register</th>
                </tr>
              </thead>
              <tbody>
                {users.map(
                  (user) =>
                    user.isAdmin && (
                      <tr
                        className={
                          user.email === loggedInUser.email
                            ? "highlightUser"
                            : ""
                        }
                        key={user.id}
                      >
                        <td>{user.email}</td>
                        <td>
                          <select
                            defaultValue={user.designationRole}
                            onChange={(e) =>
                              handleChange(
                                user.id,
                                "designationRole",
                                e,
                                user.school.id
                              )
                            }
                          >
                            {designationRoles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div className="yearGroup">
                            <input
                              type="text"
                              defaultValue={user.years.join(", ")}
                              onChange={(e) => handleYearsInput(user.id, e)}
                            />
                            {yearIsChanged && userIdYearChanged === user.id && (
                              <button
                                className="savebtn"
                                onClick={(e) =>
                                  handleSaveYears(
                                    user.id,
                                    "years",
                                    user.school.id
                                  )
                                }
                              ></button>
                            )}
                          </div>
                        </td>
                        <td>
                          <select
                            defaultValue={user.isAdmin ? "true" : "false"}
                            onChange={(e) =>
                              handleChange(
                                user.id,
                                "isAdmin",
                                e,
                                user.school.id
                              )
                            }
                          >
                            <option value="true">Admin</option>
                            <option value="false">User</option>
                          </select>
                        </td>
                        <td>
                          <select
                            defaultValue={user.school.id}
                            onChange={(e) =>
                              handleSchoolChange(user.id, "school", e)
                            }
                          >
                            {schools.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td></td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
            <div className="addUsers">
              <h2>USERS</h2>
              <button onClick={showModal}>ADD</button>
            </div>

            <table className="user-table" id="usersTable">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Year(s)</th>
                  <th>Community Role</th>
                  <th>School</th>
                  <th>Register</th>
                </tr>
              </thead>
              <tbody>
                {users.map(
                  (user) =>
                    !user.isAdmin && (
                      <tr key={user.id} data-deletable={!user.register}>
                        <td>{user.email}</td>
                        <td>
                          <select
                            defaultValue={user.designationRole}
                            onChange={(e) =>
                              handleChange(
                                user.id,
                                "designationRole",
                                e,
                                user.school.id
                              )
                            }
                          >
                            {designationRoles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div className="yearGroup">
                            <input
                              type="text"
                              defaultValue={user.years.join(", ")}
                              onChange={(e) => handleYearsInput(user.id, e)}
                            />
                            {yearIsChanged && userIdYearChanged === user.id && (
                              <button
                                className="savebtn"
                                onClick={(e) =>
                                  handleSaveYears(
                                    user.id,
                                    "years",
                                    user.school.id
                                  )
                                }
                              ></button>
                            )}
                          </div>
                        </td>
                        <td>
                          <select
                            defaultValue={user.isAdmin ? "true" : "false"}
                            onChange={(e) =>
                              handleChange(
                                user.id,
                                "isAdmin",
                                e,
                                user.school.id
                              )
                            }
                          >
                            <option value="true">Admin</option>
                            <option value="false">User</option>
                          </select>
                        </td>
                        <td>
                          <select
                            defaultValue={user.school.id}
                            onChange={(e) =>
                              handleSchoolChange(user.id, "school", e)
                            }
                          >
                            {schools.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div
                            className={`register-circle ${user.register ? "check" : ""}`}
                          ></div>
                          {!user.register && (
                            <button
                              onClick={() => deleteUserById(user.id)}
                              className="deleteIcon"
                            ></button>
                          )}
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </>
        ) : (
          <p>No users found.</p>
        )}

        {loggedInUser && (
          <div>
            <h2>Welcome, {loggedInUser.email}</h2>
          </div>
        )}
      </div>
      {isModalVisible && <AddUserModal onClose={hideModal} />}
    </>
  );
};

export default UserAdmin;
