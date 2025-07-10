import React from "react";

const AnnouncementCard = ({ announcement, onDelete, userId }) => {
  // Handle cases where alumProfile might be null or undefined
  const authorName = announcement.alumProfile
    ? `${announcement.alumProfile.firstName || ""} ${(announcement.alumProfile.lastName || "")[0] || ""}.`
    : "Author";

  const handleDeleteClick = () => {
    onDelete(announcement.id);
  };

  const handleCtaClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // For preview mode, we might want to open in new tab or just log
    if (announcement.id === "preview") {
      window.open(announcement.ctaLink, "_blank");
    } else {
      window.open(announcement.ctaLink, "_blank");
    }
  };

  return (
    <div key={announcement.id} className={`event-card ${announcement.style}`}>
      <div className="event-card-header">
        <h1>{announcement.title}</h1>
        {announcement.alumProfile.user.id === userId && (
          <button
            type="button"
            className="delete-btn"
            onClick={handleDeleteClick}
          >
            DELETE
          </button>
        )}
      </div>
      <p className="event-card-subtitle">{announcement.subtitle}</p>
      {userId == null ? (
        <div className="event-card-footer login-required">
          <p>
            <a href="/login">Login</a> to view details
          </p>
        </div>
      ) : (
        <div className="event-card-footer">
          <span className="event-card-expiry">
            <i>
              {new Date(parseInt(announcement.expiryDate)).getFullYear() ===
              2099
                ? "Post expires on: Ongoing"
                : `Post expires on: ${new Date(parseInt(announcement.expiryDate)).toLocaleDateString()}`}
            </i>
          </span>
          <span className="event-card-author">
            <i>by: {authorName}</i>
          </span>
          <button type="button" className="cta-btn" onClick={handleCtaClick}>
            {announcement.ctaText}
          </button>
        </div>
      )}
    </div>
  );
};

export default AnnouncementCard;
