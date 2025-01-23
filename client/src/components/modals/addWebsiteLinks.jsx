import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALUMPROFILE_BY_USER_ID } from "../../utils/queries";
import { UPDATE_ALUMPROFILE } from "../../utils/mutations";

const AddWebsiteLinks = ({ userId, onClose }) => {
  const {
    loading: alumProfileLoading,
    error: alumProfileError,
    data: alumProfileData,
  } = useQuery(GET_ALUMPROFILE_BY_USER_ID, {
    variables: { getAlumProfileByUserIdId: userId },
    skip: !userId, // Don't run the query until we have a userId
  });

  const [linkValue, setLinkValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [success, setSuccess] = useState(false); // Success state for showing message

  const [updateAlumProfile] = useMutation(UPDATE_ALUMPROFILE);

  useEffect(() => {
    if (alumProfileData) {
      console.log(alumProfileData);
    }
  }, [alumProfileData]);

  if (alumProfileLoading) return <div>Loading Platforms...</div>;

  if (alumProfileError) return <div>Error loading data: {alumProfileError?.message}</div>;

  const handleSubmit = async (e) => {

    e.preventDefault();

      // Check if the URL starts with https://
  if (!linkValue.startsWith("https://")) {
    alert("Please enter a URL that starts with 'https://'");
    return; // Prevent form submission if the URL is invalid
  }


    try {
      // Collect all existing data from alumProfileData
      const {
        firstName,
        lastName,
        bio,
        public: isPublic,
        websiteLinks,
        exhibitions,
        socialMedia,
        exhibitionsReferences,
      } = alumProfileData.getAlumProfileByUserId;

      // Filter out __typename from websiteLinks
      const cleanWebsiteLinks = [
        ...websiteLinks.map(({ __typename, ...rest }) => rest),
        { urlLink: linkValue, description: displayValue },
      ];
      
      // Call the update mutation
      await updateAlumProfile({
        variables: {
          updateAlumProfileId: alumProfileData.getAlumProfileByUserId.id,
          firstName,
          lastName,
          bio,
          public: isPublic,
          websiteLinks: cleanWebsiteLinks,
          exhibitions: exhibitions.map((ex) => ex.id),
          socialMedia: socialMedia.map((sm) => sm.id),
          exhibitionsReferences: exhibitionsReferences.map((ref) => ref.id),
        },
      });

      // Handle success (e.g., show a success message or close modal)
      setSuccess(true);
      setTimeout(onClose, 2000); // Close modal after 2 seconds
    } catch (error) {
      console.error("Error updating alum profile:", error);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>ADD LINK</h2>
          <form id="addLinkForm" onSubmit={handleSubmit}>
            <table className="user-table">
              <tbody>
                <tr>
                  <td>Display Text</td>
                  <td>
                    <input
                      type="text"
                      value={displayValue}
                      onChange={(e) => setDisplayValue(e.target.value)}
                    />
                  </td>
                </tr>
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
                disabled={displayValue === "" || linkValue === ""}
                className={`button ${
                  displayValue === "" || linkValue === "" ? "disabled" : ""
                }`}
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

export default AddWebsiteLinks;
