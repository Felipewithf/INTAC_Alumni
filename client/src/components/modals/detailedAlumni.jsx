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
}) => {
  console.log(personalLinks);
  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-alumni-content" onClick={(e) => e.stopPropagation()}>
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
              <div className="bio">{bio}</div>
              <div className="personalLinks">
                {personalLinks &&
                  personalLinks.length > 0 &&
                  personalLinks.map((l) => (
                    <a
                      key={l.id}
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
          <h3 className="pastExTitle">Exhibitions</h3>
          <div className="exhibition-holder">
            {exhibitions &&
              exhibitions.length > 0 &&
              exhibitions.map((e) => (
                <>
                  <div className="exhibition-card" key={e.id}>
                    <img src={`/studentExhibition/${e.poster}`} alt={e.name} />
                    <div>Artist References</div>
                    <div className="referenceHolder">
                      {exhibitionsReferences
                        .filter((ref) => ref.exhibition.id === e.id)
                        .map((ref, index) => (
                          <a
                            key={ref.exhibition.id}
                            href={ref.referenceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            [{index + 1}]
                          </a>
                        ))}
                    </div>
                  </div>
                </>
              ))}
          </div>
          <div className="school">
            <div className="schoolName">{user.school.name}</div>
            <div className="designation">{user.designationRole}</div>
            <div className="years">{user.years.join(", ")}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniModal;
