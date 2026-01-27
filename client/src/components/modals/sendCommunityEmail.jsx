import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { SEND_ANNOUNCEMENT_EMAIL } from "../../utils/mutations";

const SendCommunityEmailModal = ({ onClose }) => {
  const [sendAnnouncementEmail, { loading: sendingEmail, error: sendError }] =
    useMutation(SEND_ANNOUNCEMENT_EMAIL);

  const [formState, setFormState] = useState({
    title: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate URL
    if (formState.ctaLink && !formState.ctaLink.startsWith("https://")) {
      setError("Please enter a URL that starts with 'https://' in the Button Link field");
      return;
    }

    // Validate required fields
    if (
      !formState.title.trim() ||
      !formState.subtitle.trim() ||
      !formState.ctaText.trim() ||
      !formState.ctaLink.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const { data } = await sendAnnouncementEmail({
        variables: {
          title: formState.title.trim(),
          subtitle: formState.subtitle.trim(),
          ctaLink: formState.ctaLink.trim(),
          ctaText: formState.ctaText.trim(),
        },
      });
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError("Failed to send announcement email. Please try again.");
      console.error("Error sending announcement email:", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>SEND COMMUNITY EMAIL</h2>
        <p style={{ marginBottom: "20px", opacity: 0.7 }}>
          Send an email notification to the entire community
        </p>
        <form id="sendCommunityEmailForm" onSubmit={handleSubmit}>
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
                  <label htmlFor="title">Title *</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formState.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Invitation"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="subtitle">Subtitle *</label>
                </td>
                <td>
                  <textarea
                    id="subtitle"
                    name="subtitle"
                    value={formState.subtitle}
                    onChange={handleChange}
                    required
                    rows={3}
                    cols={40}
                    placeholder="e.g. gallery opening at OCAD University in Toronto, Canada"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="ctaText">Button Text *</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="ctaText"
                    name="ctaText"
                    value={formState.ctaText}
                    onChange={handleChange}
                    required
                    placeholder="e.g. View Details"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="ctaLink">Button Link *</label>
                </td>
                <td>
                  <input
                    type="url"
                    id="ctaLink"
                    name="ctaLink"
                    value={formState.ctaLink}
                    onChange={handleChange}
                    required
                    placeholder="https://www.example.com"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
          )}
          {sendError && (
            <p style={{ color: "red", marginTop: "10px" }}>
              Error: {sendError.message}
            </p>
          )}
          {success ? (
            <p className="successMessage">Community email sent successfully!</p>
          ) : (
            <button type="submit" disabled={sendingEmail}>
              {sendingEmail ? "Sending..." : "SEND COMMUNITY EMAIL"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SendCommunityEmailModal;
