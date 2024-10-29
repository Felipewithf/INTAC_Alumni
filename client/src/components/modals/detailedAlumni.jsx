import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { designationRoles } from "../../utils/staticSettings";

// import designation names from one place that will not change (utils?)

const AlumniModal = ({
  onClose,
  firstName,
  lastName,
  bio,
  socials,
  personalLinks,
  studentExhibitions,
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
                {socials.map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer">
                    <img src={`socials/${s.logo}`} alt={s.platform} />
                  </a>
                ))}
              </div>
            </div>

            <div className="about">
              <div className="bio">{bio}</div>
              <div className="personalLinks">
                {personalLinks.map((l) => (
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
            {studentExhibitions.map((e) => (
              <>
                <div className="exhibition-card" key={e.id}>
                  <img
                    src={`/studentExhibition/${e.exhibition.poster}`}
                    alt={e.exhibition.name}
                  />
                  <div>Artist References</div>
                  <div className="referenceHolder">
                    {e.references.map((ref, index) => (
                      <a key={index} href={ref} target="_blank" rel="noopener noreferrer">
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
