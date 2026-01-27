import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_SCHOOL } from "../../utils/mutations";
import { GET_SCHOOLS } from "../../utils/queries";

const AddInstitutionModal = ({ onClose }) => {
  const [createSchool, { loading: creatingSchool, error: createError }] =
    useMutation(CREATE_SCHOOL, {
      refetchQueries: [{ query: GET_SCHOOLS }],
    });

  const [formState, setFormState] = useState({
    name: "",
    acronym: "",
    url: "",
    logo: "",
    country: "",
    location: "",
    status: "",
    color: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formState.name.trim() || !formState.url.trim() || !formState.logo.trim() || !formState.country.trim()) {
      alert("Please fill in all required fields: Name, URL, Logo, and Country");
      return;
    }

    try {
      await createSchool({
        variables: {
          name: formState.name.trim(),
          acronym: formState.acronym.trim() || null,
          url: formState.url.trim(),
          logo: formState.logo.trim(),
          country: formState.country.trim(),
          location: formState.location.trim() || null,
          status: formState.status.trim() || null,
          color: formState.color.trim() || null,
        },
      });
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error creating institution:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>ADD INSTITUTION</h2>
        <form id="addInstitutionForm" onSubmit={handleSubmit}>
          <table className="user-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <label htmlFor="name">Name *</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    placeholder="Institution name"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="acronym">Acronym</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="acronym"
                    name="acronym"
                    value={formState.acronym}
                    onChange={handleChange}
                    placeholder="e.g. INTAC"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="url">URL *</label>
                </td>
                <td>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    value={formState.url}
                    onChange={handleChange}
                    required
                    placeholder="https://example.com"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="logo">Logo *</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="logo"
                    name="logo"
                    value={formState.logo}
                    onChange={handleChange}
                    required
                    placeholder="logo.png"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="country">Country *</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formState.country}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Mexico"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="location">Location</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formState.location}
                    onChange={handleChange}
                    placeholder="e.g. Mexico City"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="status">Status</label>
                </td>
                <td>
                  <select
                    id="status"
                    name="status"
                    value={formState.status}
                    onChange={handleChange}
                    as="select"
                  >
                     <option value="partner">Partner</option>
                    <option value="collaborator">Collaborator</option>
                    <option value="past partner">Past Partner</option>
                   
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="color">Color</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formState.color}
                    onChange={handleChange}
                    placeholder="e.g. #FF0000"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {createError && (
            <p style={{ color: "red", marginTop: "10px" }}>
              Error: {createError.message}
            </p>
          )}
          {success ? (
            <p className="successMessage">Institution added successfully!</p>
          ) : (
            <button type="submit" disabled={creatingSchool}>
              {creatingSchool ? "Adding..." : "ADD INSTITUTION"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddInstitutionModal;
