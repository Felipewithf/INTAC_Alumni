import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALUMPROFILE_BY_USER_ID } from "../../utils/queries";
import { CREATE_EXHIBITION_REFERENCE_LINK } from "../../utils/mutations";

const AddExhibitionReference = ({ userId, exhibitionId, onClose }) => {
  const {
    loading: alumProfileLoading,
    error: alumProfileError,
    data: alumProfileData,
  } = useQuery(GET_ALUMPROFILE_BY_USER_ID, {
    variables: { getAlumProfileByUserIdId: userId },
    skip: !userId, // Don't run the query until we have a userId
  });

  const [createExhibitionReference] = useMutation(CREATE_EXHIBITION_REFERENCE_LINK);

  const [linkValue, setLinkValue] = useState("");
  const [alumProfileID, setAlumProfileID] = useState("");

  const [success, setSuccess] = useState(false); // Success state for showing message

  // Load the alumProfileID
  useEffect(() => {
    if (alumProfileData && alumProfileData.getAlumProfileByUserId) {
      setAlumProfileID(alumProfileData.getAlumProfileByUserId.id);
    }
  }, [alumProfileData]);

  if (alumProfileLoading) {
    return <div>Loading Platforms...</div>;
  }

  if (alumProfileError) {
    return <div>Error loading data: {alumProfileError?.message}</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExhibitionReference({
        variables: {
          exhibitionId,
          alumProfileId: alumProfileID,
          referenceLink: linkValue,
        },
      });
      setSuccess(true); // Set success state to true
      setTimeout(() => {
        window.location.reload(); // Reload the page to display new data
      }, 2000); // Wait 2 seconds before reloading
    } catch (error) {
      console.error("Error adding social media link:", error);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>ADD REFERENCE LINK</h2>
          <form id="addReferenceLinkForm" onSubmit={handleSubmit}>
            <table className="user-table">
              <tbody>
                <tr>
                  <td>URL Link</td>
                  <td>
                    <input
                      type="text"
                      value={linkValue}
                      onChange={(e) => setLinkValue(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br></br>
            {success ? (
              <p className="successMessage">Successfully added!</p> // Display success message
            ) : (
              <button
                type="submit"
                disabled={linkValue === ""}
                className={`button ${linkValue === "" ? "disabled" : ""}`}
              >
                Add Link
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default AddExhibitionReference;
