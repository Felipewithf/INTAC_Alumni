import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_SOCIAL_MEDIA_PLATFORMS,
  GET_ALUMPROFILE_BY_USER_ID,
} from "../../utils/queries";
import { CREATE_SOCIAL_MEDIA_LINK } from "../../utils/mutations";

const AddSocialMediaLink = ({ userId, onClose }) => {
  const {
    loading: loadingPlatforms,
    error: errorPlatforms,
    data: dataPlatforms,
  } = useQuery(GET_SOCIAL_MEDIA_PLATFORMS);

  const {
    loading: alumProfileLoading,
    error: alumProfileError,
    data: alumProfileData,
  } = useQuery(GET_ALUMPROFILE_BY_USER_ID, {
    variables: { getAlumProfileByUserIdId: userId },
    skip: !userId, // Don't run the query until we have a userId
  });

  const [
    createSocialMediaLink,
    { loading: newMediaLinkLoading, error: newMediaLinkError, data: newMediaLinkData },
  ] = useMutation(CREATE_SOCIAL_MEDIA_LINK);

  const [selectedPlatformId, setSelectedPlatformId] = useState("");
  const [mediaLinkValue, setMediaLinkValue] = useState("");
  const [alumProfileID, setAlumProfileID] = useState("");

  const [success, setSuccess] = useState(false); // Success state for showing message

  // When platform data is loaded, set the first platform's ID
  useEffect(() => {
    if (dataPlatforms && dataPlatforms.getSocialMediaPlatforms.length > 0) {
      setSelectedPlatformId(dataPlatforms.getSocialMediaPlatforms[0].id);
    }
  }, [dataPlatforms]);

  // Load the alumProfileID
  useEffect(() => {
    if (alumProfileData && alumProfileData.getAlumProfileByUserId) {
      setAlumProfileID(alumProfileData.getAlumProfileByUserId.id);
    }
  }, [alumProfileData]);

  if (loadingPlatforms || alumProfileLoading) {
    return <div>Loading Platforms...</div>;
  }

  if (errorPlatforms || alumProfileError || newMediaLinkError) {
    return (
      <div>
        Error loading data:{" "}
        {errorPlatforms?.message ||
          alumProfileError?.message ||
          newMediaLinkError?.message}
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

     // Check if the URL starts with https://
  if (!mediaLinkValue.startsWith("https://")) {
    alert("Please enter a URL that starts with 'https://'");
    return; // Prevent form submission if the URL is invalid
  }

    try {
      await createSocialMediaLink({
        variables: {
          socialMediaPlatformId: selectedPlatformId,
          urlLink: mediaLinkValue,
          alumProfileId: alumProfileID,
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
          <h2>ADD SOCIAL MEDIA LINK</h2>
          <form id="addSocialMediaLinkForm" onSubmit={handleSubmit}>
            <table className="user-table">
              <tbody>
                <tr>
                  <td>Social Media Platform</td>
                  <td>
                    <select onChange={(e) => setSelectedPlatformId(e.target.value)}>
                      {dataPlatforms.getSocialMediaPlatforms.map((platforms) => (
                        <option key={platforms.id} value={platforms.id}>
                          {platforms.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>URL Link</td>
                  <td>
                    <input
                      type="text"
                      value={mediaLinkValue}
                      onChange={(e) => setMediaLinkValue(e.target.value)}
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
                disabled={newMediaLinkLoading || mediaLinkValue === ""}
                className={`button ${
                  newMediaLinkLoading || mediaLinkValue === "" ? "disabled" : ""
                }`}
              >
                {newMediaLinkLoading ? "Adding..." : "Add Social Media Link"}
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default AddSocialMediaLink;
