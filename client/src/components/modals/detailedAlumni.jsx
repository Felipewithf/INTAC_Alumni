const AlumniModal = ({
  onClose,
  alumProfileID,
  firstName,
  lastName,
  bio,
  socials,
  personalLinks,
  exhibitions,
  exhibitionsReferences,
  user,
  color,
}) => {
  // Convert the bio value to HTML with line breaks
  const renderBioWithLineBreaks = (text) => {
    return text.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-alumni-content"
          onClick={(e) => e.stopPropagation()}
          style={{ borderColor: color }}
        >
          <div className="school">
            <div className="schoolName">{user.school.name}</div>
            <div className="designation">{user.designationRole}</div>
            <div className="years">{user.years.join(", ")}</div>
          </div>
          <div className="info-holder">
            <div className="detailsHolder">
              <div className="name">
                <div>{firstName}</div>
                <div>{lastName}</div>
              </div>
              <div className="socials">
                {socials &&
                  socials.length > 0 &&
                  socials.map((s) => (
                    <a
                      key={s.id}
                      href={s.urlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`socials/${s.socialMediaPlatform.logo}`}
                        alt={s.socialMediaPlatform.name}
                      />
                    </a>
                  ))}
              </div>
            </div>

            <div className="about">
              <div className="bio">{renderBioWithLineBreaks(bio)}</div>
              <div className="personalLinks">
                {personalLinks &&
                  personalLinks.length > 0 &&
                  personalLinks.map((l, index) => (
                    <a
                      key={index}
                      href={l.urlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p>{l.description}</p>
                    </a>
                  ))}
              </div>
            </div>
          </div>

          {exhibitions && exhibitions.length > 0 && (
            <h3 className="pastExTitle">Exhibitions</h3>
          )}
          <div className="exhibition-holder">
            {exhibitions &&
              exhibitions.length > 0 &&
              exhibitions.map((e) => (
                <>
                  <div className="exhibition-card" key={e.id}>
                    <img
                      src={`/exhibition/${e.poster}`}
                      alt={e.name}
                      onError={(e) =>
                        (e.target.src = "exhibition/missing.webp")
                      }
                    />
                    <h4 className="exhibitionName">{e.name}</h4>
                    <p>
                      {e.location} / {e.country}
                    </p>
                    {/* {exhibitionsReferences && exhibitionsReferences.length > 0 && (
                      <div className="refTitle">Artist References</div>
                    )} */}
                    {exhibitionsReferences &&
                      exhibitionsReferences.length > 0 && (
                        <div className="referenceHolder">
                          {exhibitionsReferences
                            .filter((ref) => ref.exhibition.id === e.id)
                            .map((ref, index) => (
                              <a
                                key={ref.id}
                                href={ref.referenceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                [{index + 1}]
                              </a>
                            ))}
                        </div>
                      )}
                  </div>
                </>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniModal;
