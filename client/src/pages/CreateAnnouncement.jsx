import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";
import AnnouncementCard from "../components/AnnouncementCard";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_LOGGED_IN_USER,
  GET_ALUMPROFILE_BY_USER_ID,
  GET_ANNOUNCEMENTS,
  GET_ANNOUNCEMENT_BY_ID,
} from "../utils/queries";
import { CREATE_ANNOUNCEMENT } from "../utils/mutations";

const styleOptions = [
  { name: "Default", value: "default", color: "#f8ec6a" },
  { name: "Newsprint", value: "newsprint", color: "#f8e6f8" },
];

const CreateAnnouncement = () => {
  // Get logged in user
  const {
    loading: loadingUser,
    error: errorUser,
    data: userData,
  } = useQuery(GET_LOGGED_IN_USER);

  if (loadingUser) {
    return <p>Loading...</p>;
  }

  if (errorUser) {
    return <div>Error loading user data: {errorUser?.message}</div>;
  }

  return <NewAnnouncement userData={userData} />;
};

const NewAnnouncement = ({ userData }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [isOngoing, setIsOngoing] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [style, setStyle] = useState(styleOptions[0].value);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Get alumProfileId for the logged in user
  const {
    loading: loadingProfile,
    error: errorProfile,
    data: profileData,
  } = useQuery(GET_ALUMPROFILE_BY_USER_ID, {
    variables: { getAlumProfileByUserIdId: userData?.getLoggedInUser?.id },
    skip: !userData?.getLoggedInUser?.id,
  });

  const [createAnnouncement, { loading: loadingCreate }] = useMutation(
    CREATE_ANNOUNCEMENT,
    {
      refetchQueries: [
        {
          query: GET_ANNOUNCEMENTS,
        },
      ],
    }
  );

  if (loadingProfile) {
    return <p>Loading...</p>;
  }
  if (errorProfile) {
    return <div>Error loading profile data: {errorProfile?.message}</div>;
  }

  const alumProfileId = profileData?.getAlumProfileByUserId?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!ctaLink.startsWith("https://")) {
      alert(
        "Please enter a URL that starts with 'https://' in the Button Link field"
      );
      return; // Prevent form submission if the URL is invalid
    }
    if (
      !title.trim() ||
      !subtitle.trim() ||
      (!isOngoing && !expiryDate) ||
      !ctaText.trim() ||
      !ctaLink.trim() ||
      !alumProfileId
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      const { data } = await createAnnouncement({
        variables: {
          title,
          subtitle,
          alumProfileId,
          expiryDate: isOngoing ? "2099-12-31" : expiryDate, // Use a far future date for ongoing
          isOnGoing: isOngoing,
          ctaLink,
          ctaText,
          style,
        },
      });

      setSuccess(true);
      navigate(`/ea/${data.createAnnouncement.id}`);
    } catch (err) {
      setError("Failed to create announcement. Please try again.");
    }
  };

  return (
    <div className="newAnnouncementPage">
      <form id="newAnnouncementForm" onSubmit={handleSubmit}>
        <h2>Create Announcement</h2>

        <table className="newAnnouncement-table">
          <tbody>
            <tr>
              <td>
                <h5>Title</h5>
              </td>
              <td>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 1 year Fine Arts Residency"
                />
              </td>
            </tr>
            <tr>
              <td>
                <h5>Subtitle</h5>
              </td>
              <td>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Paid - In Monterrey Mexico City - Flexible Schedule"
                />
              </td>
            </tr>
            <tr>
              <td>
                <h5>Type of event</h5>
              </td>
              <td>
                <select
                  value={isOngoing ? "ongoing" : "specific"}
                  onChange={(e) => setIsOngoing(e.target.value === "ongoing")}
                >
                  <option value="specific">Specific Date</option>
                  <option value="ongoing">Ongoing</option>
                </select>
              </td>
            </tr>
            {!isOngoing && (
              <>
                <tr>
                  <td>
                    <h5>Remove after</h5>
                  </td>
                  <td>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </td>
                </tr>
              </>
            )}

            <tr>
              <td>
                <h5>Button Text</h5>
              </td>
              <td>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Submit"
                />
              </td>
            </tr>
            <tr>
              <td>
                <h5>Button Link</h5>
              </td>
              <td>
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="e.g. https://www.google-forms.com"
                />
              </td>
            </tr>
            <tr>
              <td>
                <h5>Style</h5>
              </td>
              <td>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  {styleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="preview-container">
          <h3>Preview</h3>
          <AnnouncementCard
            announcement={{
              id: "preview",
              title: title || "Your Title",
              subtitle: subtitle || "Your Subtitle",
              expiryDate: expiryDate
                ? new Date(expiryDate).getTime().toString()
                : new Date().getTime().toString(),
              style: style,
              ctaText: ctaText || "Button Text",
              ctaLink: ctaLink || "#",
              alumProfile: {
                firstName: profileData?.getAlumProfileByUserId?.firstName,
                lastName: profileData?.getAlumProfileByUserId?.lastName,
                user: {
                  id: profileData?.getAlumProfileByUserId?.user?.id,
                },
              },
            }}
            userId="000"
          />
        </div>

        {error && <div style={{ color: "red", fontWeight: 700 }}>{error}</div>}
        {success && (
          <div style={{ color: "green", fontWeight: 700 }}>
            Announcement posted!
          </div>
        )}
        <button type="submit" disabled={loadingCreate}>
          {loadingCreate ? "Posting..." : "POST ANNOUNCEMENT"}
        </button>
      </form>
    </div>
  );
};

export default CreateAnnouncement;
