import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_EXHIBITIONS, GET_ALUMPROFILE_BY_USER_ID } from "../../utils/queries";
import { UPDATE_ALUMPROFILE } from "../../utils/mutations";

const AddExhibition = ({ userId, onClose }) => {
  const {
    loading: loadingExhibitions,
    error: errorExhibitions,
    data: dataExhibitions,
  } = useQuery(GET_EXHIBITIONS);

  const {
    loading: alumProfileLoading,
    error: alumProfileError,
    data: alumProfileData,
  } = useQuery(GET_ALUMPROFILE_BY_USER_ID, {
    variables: { getAlumProfileByUserIdId: userId },
    skip: !userId, // Don't run the query until we have a userId
  });

  const [selectedExhibitions, setSelectedExhibitions] = useState([]);
  const [success, setSuccess] = useState(false); // Success state for showing message

  const [updateAlumProfile] = useMutation(UPDATE_ALUMPROFILE);

  useEffect(() => {
    if (alumProfileData) {
      console.log(alumProfileData);
    }
  }, [alumProfileData]);

  // Load the alumProfileID
  // useEffect(() => {
  //   if (alumProfileData && alumProfileData.getAlumProfileByUserId) {
  //     setAlumProfileID(alumProfileData.getAlumProfileByUserId.id);
  //   }
  // }, [alumProfileData]);

  // Filter exhibitions to exclude the ones already added in alumProfile
  const availableExhibitions = dataExhibitions?.getExhibitions.filter(
    (exhibition) =>
      !alumProfileData?.getAlumProfileByUserId.exhibitions.some(
        (existingExhibition) => existingExhibition.id === exhibition.id
      )
  );

  const handleToggleExhibition = (exhibitionId) => {
    setSelectedExhibitions(
      (prevSelected) =>
        prevSelected.includes(exhibitionId)
          ? prevSelected.filter((id) => id !== exhibitionId) // Deselect if already selected
          : [...prevSelected, exhibitionId] // Add if not selected
    );
  };

  if (loadingExhibitions || alumProfileLoading) return <div>Loading Platforms...</div>;

  if (errorExhibitions || alumProfileError)
    return (
      <div>
        Error loading data: {errorExhibitions?.message || alumProfileError?.message}
      </div>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Collect all existing data from alumProfileData
      const {
        firstName,
        lastName,
        bio,
        public: isPublic,
        websiteLinks,
        socialMedia,
        exhibitionsReferences,
      } = alumProfileData.getAlumProfileByUserId;

      // Filter out __typename from websiteLinks
      const cleanWebsiteLinks = websiteLinks.map(({ __typename, ...rest }) => rest);

      // Combine current exhibitions with selected exhibitions
      const updatedExhibitions = [
        ...alumProfileData.getAlumProfileByUserId.exhibitions.map((ex) => ex.id),
        ...selectedExhibitions,
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
          socialMedia: socialMedia.map((sm) => sm.id),
          exhibitionsReferences: exhibitionsReferences.map((ref) => ref.id),
          exhibitions: updatedExhibitions,
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
      <div className="modal-overlay" onClick={onClose} id="exhibitionModal">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>ADD EXHIBITIONS</h2>
          <form id="addExhibitionForm" onSubmit={handleSubmit}>
            <div className="exhibition-list">
              {availableExhibitions?.map((exhibition) => (
                <div
                  key={exhibition.id}
                  className={`exhibition-item ${
                    selectedExhibitions.includes(exhibition.id) ? "selected" : ""
                  }`}
                  onClick={() => handleToggleExhibition(exhibition.id)}
                >
                  <img
                    src={`exhibition/${exhibition.poster}`}
                    alt={exhibition.name}
                    onError={(e) => (e.target.src = "exhibition/missing.webp")}
                  />
                  <label>{exhibition.name}</label>
                </div>
              ))}
            </div>
            <br></br>
            {success ? (
              <p className="successMessage">Successfully added!</p> // Display success message
            ) : (
              <button
                type="submit"
                disabled={loadingExhibitions || selectedExhibitions.length === 0}
                className={`button ${selectedExhibitions.length === 0 ? "disabled" : ""}`}
                onClick={() => console.log("Selected exhibitions:", selectedExhibitions)}
              >
                {loadingExhibitions ? "Adding..." : "Add Exhibition"}
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default AddExhibition;
