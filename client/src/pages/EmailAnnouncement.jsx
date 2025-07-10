import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Auth from "../utils/auth";
import { useLazyQuery } from "@apollo/client";
import {
  GET_LOGGED_IN_USER,
  GET_ALUMPROFILE_BY_USER_ID,
  GET_ANNOUNCEMENT_BY_ID,
} from "../utils/queries";
import { CREATE_ANNOUNCEMENT } from "../utils/mutations";

const EmailAnnouncement = () => {
  const navigate = useNavigate();
  const { aid } = useParams(); // Read the route parameter
  const [emailsSent, setEmailsSent] = useState(false);

  // Use lazy query to fetch announcement data only when needed
  const [
    getAnnouncement,
    {
      loading: loadingAnnouncement,
      error: errorAnnouncement,
      data: announcementData,
    },
  ] = useLazyQuery(GET_ANNOUNCEMENT_BY_ID);

  const handleSendEmail = async () => {
    try {
      const { data } = await getAnnouncement({
        variables: { getAnnouncementByIdId: aid },
      });

      if (data) {
        setEmailsSent(true);
        setTimeout(() => {
          navigate("/a");
        }, 3000);
      }
    } catch (error) {
      console.error("Error fetching announcement:", error);
    }
  };

  return (
    <>
      {emailsSent !== true ? (
        <div className="emailAnnouncementPage">
          <h2>Your announcement has been posted!</h2>
          <p>Notify the community with an email?</p>
          <div className="emailAnnouncementPage-buttons">
            <button onClick={handleSendEmail} disabled={loadingAnnouncement}>
              {loadingAnnouncement ? "Loading..." : "Yes - Send Email"}
            </button>
            <button
              onClick={() => {
                navigate("/a");
              }}
            >
              No
            </button>
          </div>
          {errorAnnouncement && (
            <div style={{ color: "red", marginTop: "10px" }}>
              Error: {errorAnnouncement.message}
            </div>
          )}
        </div>
      ) : (
        <div className="emailAnnouncementPage">
          <h2>Emails have been sent!</h2>
          <p>redirecting to announcements page...</p>
        </div>
      )}
    </>
  );
};

export default EmailAnnouncement;
