import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALUMPROFILES } from "../utils/queries";
import { intacYears, schoolColors, truncate } from "../utils/staticSettings";

import AlumniModal from "../components/modals/detailedAlumni";

const Community = () => {
  const { loading, error, data } = useQuery(GET_ALUMPROFILES);

  const [filterValue, setFilterValue] = useState(2019);
  const [activeYear, setActiveYear] = useState(2019);
  const [selectedAlumnus, setSelectedAlumnus] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);

  const alumni = data?.getAlumProfiles || [];

  const filteredAlumni = alumni.filter((person) =>
    filterValue ? person.user.years.includes(filterValue) : true
  );

  // Function to toggle modal visibility
  const showModal = (alumnus) => {
    setSelectedAlumnus(alumnus);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleYearClick = (year) => {
    setFilterValue(year);
    setActiveYear(year); // Set the clicked year as active
  };

  return (
    <>
      <div id="community">
        {loading && <p>Loading users...</p>}

        {error && <p>Error loading users: {error.message}</p>}

        <h1>Community</h1>
        <h4>
          The INTAC community connects individuals, professionals, and organisations who
          share a passion for creating positive change on a global scale. Our
          international network of designers, educators, researchers and industry leaders
          participate in meaningful projects, engage in thought-provoking discussions, and
          collectively shape how we might live in the future.
        </h4>

        <div className="separatingLine"></div>

        <div className="filterByYear">
          <h3> filter by INTAC Year</h3>
          <ol>
            {intacYears.map((year) => (
              <li
                className={activeYear === year ? "active" : ""}
                key={year}
                onClick={() => handleYearClick(year)}
              >
                {year}
              </li>
            ))}
          </ol>
        </div>
        <div className="cardHolder">
          {filteredAlumni.map((alumnus) =>
            alumnus?.public ? (
              <div
                className="alumniCard"
                style={{ borderColor: schoolColors(alumnus.user.school.name) }}
                key={alumnus.id}
                onClick={() => showModal(alumnus)}
              >
                <div className="name">
                  <div className="truncate">{alumnus.firstName}</div>
                  <div className="truncate">{alumnus.lastName}</div>
                </div>
                <div className="bio">{truncate(alumnus.bio, 150)}</div>
                <div className="footer">
                  <div className="left">
                    <div className="designation">{alumnus.user.designationRole}</div>
                    <div className="years">
                      {" "}
                      {truncate(alumnus.user.years.join(", "), 24)}
                    </div>
                  </div>
                  <div className="rigth">
                    <div className="schoolLogo">
                      <img src="vite.svg"></img>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div key={alumnus.id} className="alumniCardPrivate">
                <h3>LOGIN TO VIEW USER</h3>
                <div className="schoolLogo">
                  <img src="vite.svg"></img>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      {isModalVisible && (
        <AlumniModal
          onClose={hideModal}
          alumProfileID={selectedAlumnus.id}
          firstName={selectedAlumnus.firstName}
          lastName={selectedAlumnus.lastName}
          bio={selectedAlumnus.bio}
          socials={selectedAlumnus.socialMedia}
          personalLinks={selectedAlumnus.websiteLinks}
          exhibitions={selectedAlumnus.exhibitions}
          exhibitionsReferences={selectedAlumnus.exhibitionsReferences}
          user={selectedAlumnus.user}
        />
      )}
    </>
  );
};

export default Community;
