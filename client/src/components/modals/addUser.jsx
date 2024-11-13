import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SCHOOLS } from "../../utils/queries";
import { CREATE_USER } from "../../utils/mutations";
import { designationRoles } from "../../utils/staticSettings";

// import designation names from one place that will not change (utils?)

const AddUserModal = ({ onClose }) => {
  const {
    loading: loadingSchools,
    error: errorSchool,
    data: schoolData,
  } = useQuery(GET_SCHOOLS);
  const [addUser, { loading: newUserLoading, error: newUserError, data: newUserData }] =
    useMutation(CREATE_USER);

  const [emailInput, setEmailInput] = useState("");
  const [yearInput, setYearInput] = useState("2022");
  const [designationInput, setDesignationInput] = useState(designationRoles[0]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");

  const [success, setSuccess] = useState(false); // Success state for showing message

  // When school data is loaded, set the selectedSchoolId to the first school's ID
  useEffect(() => {
    if (schoolData && schoolData.getSchools && schoolData.getSchools.length > 0) {
      setSelectedSchoolId(schoolData.getSchools[0].id); // Set the ID of the first school
    }
    console.log(`school id loaded on useState: ${selectedSchoolId}`);
  }, [schoolData]);

  useEffect(() => {
    console.log(`school id loaded on useState: ${selectedSchoolId}`);
    console.log(`year loaded on useState: ${yearInput}`);
    console.log(`Designation loaded on useState: ${designationInput}`);
    console.log(`Email loaded on useState: ${emailInput}`);
  }, [selectedSchoolId, yearInput, designationInput, emailInput]);

  if (loadingSchools) {
    return <div>Loading schools...</div>;
  }

  if (errorSchool) {
    return <div>Error loading schools: {errorSchool.message}</div>;
  }

  // Defensive check to ensure `schoolData` and `schoolData.schools` exist
  const schools = schoolData && schoolData.getSchools ? schoolData.getSchools : [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Split the email input into multiple emails
    const emails = emailInput.split(",").map((email) => email.trim());

    try {
      // Loop through each email and call the addUser mutation
      for (const email of emails) {
        await addUser({
          variables: {
            email,
            schoolId: selectedSchoolId,
            register: false,
            isAdmin: false,
            years: parseInt(yearInput, 10),
            designationRole: designationInput,
          },
        });
      }
      setSuccess(true); // Set success state to true
      setTimeout(() => {
        window.location.reload(); // Reload the page to display new data
      }, 2000); // Wait 2 seconds before reloading
    } catch (error) {
      console.error("Error adding users:", error);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>ADD USER(S)</h2>
          <form id="addUserForm" onSubmit={handleSubmit}>
            <table className="user-table">
              <thead>
                <tr>
                  <th>School</th>
                  <th>Year</th>
                  <th>Designation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select onChange={(e) => setSelectedSchoolId(e.target.value)}>
                      {schools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={yearInput}
                      onChange={(e) => setYearInput(e.target.value)}
                    />
                  </td>
                  <td>
                    <select onChange={(e) => setDesignationInput(e.target.value)}>
                      {designationRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="form-group">
              <label htmlFor="emails">Email(s)</label>
              <textarea
                id="emails"
                placeholder="Add multiple users by separating the emails with a comma."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              ></textarea>
            </div>
            {success ? (
              <p className="successMessage">Successfully added!</p> // Display success message
            ) : (
              <button type="submit">ADD USER(S)</button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default AddUserModal;
