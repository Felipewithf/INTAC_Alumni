import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALUMPROFILE_BY_USER_ID } from "../../utils/queries";
import { UPDATE_ALUMPROFILE } from "../../utils/mutations";

const EditProfile = ({ userId, onClose }) => {
  const {
    loading: alumProfileLoading,
    error: alumProfileError,
    data: alumProfileData,
  } = useQuery(GET_ALUMPROFILE_BY_USER_ID, {
    variables: { getAlumProfileByUserIdId: userId },
    skip: !userId, // Don't run the query until we have a userId
  });

  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");
  const [bioValue, setBioValue] = useState("");
  const [isPublicValue, setIsPublicValue] = useState(true);

  const [success, setSuccess] = useState(false); // Success state for showing message
  const [error, setError] = useState(""); // State to hold error message

  const [updateAlumProfile] = useMutation(UPDATE_ALUMPROFILE);

  //load the content into the use state
  useEffect(() => {
    if (alumProfileData && alumProfileData.getAlumProfileByUserId) {
      setFirstNameValue(alumProfileData.getAlumProfileByUserId.firstName);
      setLastNameValue(alumProfileData.getAlumProfileByUserId.lastName);
      setBioValue(alumProfileData.getAlumProfileByUserId.bio);
      setIsPublicValue(alumProfileData.getAlumProfileByUserId.public);
    }
  }, [alumProfileData]);

  if (alumProfileLoading) return <div>Loading Platforms...</div>;

  if (alumProfileError)
    return <div>Error loading data: {alumProfileError?.message}</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstNameValue.trim()) {
      setError("First name is required"); // Show error if input is empty
      return;
    }

    setError(""); // Clear any previous error if input is not empty

    try {
      // Collect all existing data from alumProfileData
      const { websiteLinks, exhibitions, socialMedia, exhibitionsReferences } =
        alumProfileData.getAlumProfileByUserId;

      // Filter out __typename from websiteLinks
      const cleanWebsiteLinks = [
        ...websiteLinks.map(({ __typename, ...rest }) => rest),
      ];
      // Call the update mutation
      await updateAlumProfile({
        variables: {
          updateAlumProfileId: alumProfileData.getAlumProfileByUserId.id,
          firstName: firstNameValue,
          lastName: lastNameValue,
          bio: bioValue,
          public: isPublicValue,
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
          <h2>EDIT PROFILE</h2>
          <form id="updateProfileForm" onSubmit={handleSubmit}>
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
                      onChange={(e) =>
                        setIsPublicValue(e.target.value === "true")
                      }
                    >
                      <option value="true">Public</option>
                      <option value="false">Private</option>
                    </select>
                    <label>
                      Private profile will be hidden to the public, but will be
                      visible to INTAC users when they are logged in.
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>

            <br></br>
            <br></br>
            {success ? (
              <p className="successMessage">Successfully Updated!</p> // Display success message
            ) : (
              <>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button
                  type="submit"
                  disabled={
                    firstNameValue === "" ||
                    lastNameValue === "" ||
                    bioValue === ""
                  }
                  className={`button ${
                    firstNameValue === "" ||
                    lastNameValue === "" ||
                    bioValue === ""
                      ? "disabled"
                      : ""
                  }`}
                  onClick={() => console.log("isPublicValue:", isPublicValue)}
                >
                  Update
                </button>
                <div>
                  <p style={{ textAlign: "start" }}>
                    <a href="./changeemail">Change sign-in email</a>
                  </p>
                  <p style={{ textAlign: "start" }}>
                    <a href="./changeyears">Change years</a>
                  </p>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
