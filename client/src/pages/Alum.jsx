import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";

import { useQuery, useMutation } from "@apollo/client";
import { GET_LOGGED_IN_USER, GET_ALUMPROFILE_BY_USER_ID } from "../utils/queries";
import { DELETE_REFERENCE, DELETE_SOCIAL, UPDATE_ALUMPROFILE } from "../utils/mutations";

import AddSocialMediaLink from "../components/modals/addSocialMediaLink";
import AddExhibition from "../components/modals/addExhibition";
import AddWebsiteLinks from "../components/modals/addWebsiteLinks";
import AddExhibitionReference from "../components/modals/addExhibitionReference";
import EditProfile from "../components/modals/editProfile";

const Alum = () => {
  const navigate = useNavigate();
  const { loading, error, data: userData } = useQuery(GET_LOGGED_IN_USER);

  // Single state to control which modal is visible
  const [activeModal, setActiveModal] = useState(null);
  const [currentExhibitionId, setCurrentExhibitionId] = useState(null); // New state to store exhibitionId

  // Function to show a specific modal
  const showModal = (modalName, exhibitionId = null) => {
    setActiveModal(modalName);
    setCurrentExhibitionId(exhibitionId); // Store exhibitionId when opening reference modal
  };

  // Function to hide the modal
  const hideModal = () => {
    setActiveModal(null);
    setCurrentExhibitionId(null);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  const handleAdminDashboard = () => {
    navigate("/admin");
  };

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error fetching user data: {error.message}</p>;

  return (
    <div>
      <div className="alumPage">
        <div className="topNavigation">
          <button onClick={() => showModal("editProfile")}>Edit Profile</button>
          <div className="rightGroup">
            {userData.getLoggedInUser.isAdmin && (
              <button onClick={handleAdminDashboard}>Admin Dashboard</button>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        {userData?.getLoggedInUser?.id && (
          <AlumProfile userId={userData.getLoggedInUser.id} showModal={showModal} />
        )}
      </div>
      {activeModal === "social" && (
        <AddSocialMediaLink userId={userData.getLoggedInUser.id} onClose={hideModal} />
      )}
      {activeModal === "exhibition" && (
        <AddExhibition userId={userData.getLoggedInUser.id} onClose={hideModal} />
      )}
      {activeModal === "link" && (
        <AddWebsiteLinks userId={userData.getLoggedInUser.id} onClose={hideModal} />
      )}
      {activeModal === "reference" && currentExhibitionId && (
        <AddExhibitionReference
          userId={userData.getLoggedInUser.id}
          exhibitionId={currentExhibitionId}
          onClose={hideModal}
        />
      )}
      {activeModal === "editProfile" && (
        <EditProfile userId={userData.getLoggedInUser.id} onClose={hideModal} />
      )}
    </div>
  );
};

const AlumProfile = ({ userId, showModal }) => {
  const { loading, error, data } = useQuery(GET_ALUMPROFILE_BY_USER_ID, {
    variables: { getAlumProfileByUserIdId: userId },
    skip: !userId, // Don't run the query until we have a userId
  });
  const [deleteSocialMediaLink] = useMutation(DELETE_SOCIAL);
  const [deleteReferenceLink] = useMutation(DELETE_REFERENCE);
  const [updateAlumProfile] = useMutation(UPDATE_ALUMPROFILE);

  const deleteSocial = async (id) => {
    try {
      await deleteSocialMediaLink({
        variables: {
          deleteSocialMediaLinkId: id,
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 500); // Wait half a second before reloading
    } catch (error) {
      console.error("Error deleting social media link:", error);
    }
  };

  const deleteReference = async (id) => {
    console.log(id);
    try {
      await deleteReferenceLink({
        variables: {
          deleteExhibitionReferenceId: id,
        },
      });
      setTimeout(() => {
        window.location.reload();
      }, 500); // Wait half a second before reloading
    } catch (error) {
      console.error("Error deleting reference link:", error);
    }
  };

  const deleteWebsitelink = async (urlLink, description) => {
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
      } = data.getAlumProfileByUserId;

      // Filter out __typename from websiteLinks
      const updatedWebsiteLinks = websiteLinks
        .filter((link) => link.urlLink !== urlLink && link.description !== description)
        .map(({ __typename, ...rest }) => rest); // Remove __typename field

      // Call the update mutation
      await updateAlumProfile({
        variables: {
          updateAlumProfileId: data.getAlumProfileByUserId.id,
          firstName,
          lastName,
          bio,
          public: isPublic,
          websiteLinks: updatedWebsiteLinks,
          exhibitions: exhibitions.map((ex) => ex.id),
          socialMedia: socialMedia.map((sm) => sm.id),
          exhibitionsReferences: exhibitionsReferences.map((ref) => ref.id),
        },
      });
    } catch (error) {
      console.error("Error updating alum profile:", error);
    }
  };

  if (loading) return <p>Loading alum profile...</p>;
  if (error) return <p>Error fetching alum profile: {error.message}</p>;

  return (
    <>
      <div className="alumData">
        <div className="personal">
          <div className="name">
            <div>{data.getAlumProfileByUserId.firstName}</div>
            <div>{data.getAlumProfileByUserId.lastName}</div>
          </div>
          <p className="bio">{data.getAlumProfileByUserId.bio}</p>
          <div className="permission">
            <p>
              Your profile is:{" "}
              {data.getAlumProfileByUserId.public ? (
                <strong>Public</strong>
              ) : (
                <strong>Private</strong>
              )}
            </p>
          </div>
          <div className="separatingLine"></div>
          <h4>Links</h4>
          <p className="description">
            Add any type of links you want to link to your profile like website,
            portfolios, awards, galleries, companies, etc.
          </p>
          <div className="links">
            {data.getAlumProfileByUserId.websiteLinks.length > 0 &&
              data.getAlumProfileByUserId.websiteLinks.map((link, index) => {
                return (
                  <div className="linkItem" key={index}>
                    <div className="linkInfo">
                      <p>{link.description}:</p>
                      <a href={link.urlLink}>
                        <p>{link.urlLink}</p>
                      </a>
                    </div>
                    <button
                      onClick={() => deleteWebsitelink(link.urlLink, link.description)}
                      className="deleteIcon"
                    ></button>
                  </div>
                );
              })}

            <br></br>
            <button onClick={() => showModal("link")}>+ Add Link</button>
            <div className="separatingLine"></div>
          </div>
          <h4>Socials</h4>
          <p className="description">
            Add your social medias to keep in touch with your fellow INTAC Members.
          </p>
          <div className="socials">
            {data.getAlumProfileByUserId.socialMedia.length > 0 &&
              data.getAlumProfileByUserId.socialMedia.map((social) => {
                return (
                  <div className="socialItem" key={social.id}>
                    <div className="socialInfo">
                      <img src={`socials/${social.socialMediaPlatform.logo}`}></img>
                      <p>{social.socialMediaPlatform.name}</p>
                      <a href={social.urlLink}>
                        <p>{social.urlLink}</p>
                      </a>
                    </div>

                    <button
                      onClick={() => deleteSocial(social.id)}
                      className="deleteIcon"
                    ></button>
                  </div>
                );
              })}

            <br></br>
            <button onClick={() => showModal("social")}>+ Add Social</button>
            <div className="separatingLine"></div>
          </div>
        </div>
        <div className="exhibitions">
          <div className="separatingLine"></div>
          <h4>Exhibitions & References</h4>
          <p className="description">
            Showcase your INTAC exhibitons, if you have external links for a particular
            exhibition please add the links as references.
          </p>

          {data.getAlumProfileByUserId.exhibitions.length > 0 &&
            data.getAlumProfileByUserId.exhibitions.map((e) => {
              return (
                <div className="exhibitionItem" key={e.id}>
                  <img src={`exhibition/${e.poster}`} alt={e.name}></img>
                  <div className="references">
                    <button onClick={() => showModal("reference", e.id)}>
                      + Add Reference
                    </button>
                    {data.getAlumProfileByUserId.exhibitionsReferences
                      .filter((ref) => ref.exhibition.id === e.id)
                      .map((ref, index) => (
                        <div className="referenceItem" key={ref.id}>
                          <div className="referenceInfo">
                            <p>[{index + 1}]</p>
                            <a
                              href={ref.referenceLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {ref.referenceLink}
                            </a>
                          </div>
                          <button
                            onClick={() => deleteReference(ref.id)}
                            className="deleteIcon"
                          ></button>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}

          <br></br>
          <button onClick={() => showModal("exhibition")}>+ Add Exhibition</button>
          <div className="separatingLine"></div>
        </div>
      </div>
    </>
  );
};

export default Alum;
