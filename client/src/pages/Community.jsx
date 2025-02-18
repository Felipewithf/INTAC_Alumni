import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALUMPROFILES } from "../utils/queries";
import { intacYears, truncate } from "../utils/staticSettings";
import Auth from "../utils/auth";

import AlumniModal from "../components/modals/detailedAlumni";

const Community = () => {
  const { loading, error, data } = useQuery(GET_ALUMPROFILES);

  const [filterValue, setFilterValue] = useState(null);
  const [activeYear, setActiveYear] = useState(null);
  const [selectedAlumnus, setSelectedAlumnus] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);

  const alumni = data?.getAlumProfiles || [];

    // Create a shallow copy of the alumni array before sorting
  const sortedAlumni = [...alumni].sort((a, b) => {
    const nameA = a.firstName.toLowerCase();
    const nameB = b.firstName.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0; // If names are the same, return 0
  });

  const filteredAlumni = sortedAlumni.filter((person) =>
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
    setFilterValue(year === activeYear ? null : year); // Set to null if the same year is clicked
    setActiveYear(year === activeYear ? null : year); // Set to null if the same year is clicked
  };

  // Prevent body scroll when modal is active
  useEffect(() => {
    if (isModalVisible) {
      document.body.style.overflow = "hidden"; // Disable body scroll
    } else {
      document.body.style.overflow = "auto"; // Re-enable body scroll
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup when the modal is removed
    };
  }, [isModalVisible]);

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
            alumnus?.public || Auth.loggedIn() ? (
              <div
                className="alumniCard"
                style={{ borderColor: alumnus.user.school.color }}
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
                      <img src={`/schools/${alumnus.user.school.logo}`}></img>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div key={alumnus.id} className="alumniCardPrivate">
                <h3>LOGIN TO VIEW MEMBER</h3>
                <div className="schoolLogo">
                  <img src={`/schools/${alumnus.user.school.logo}`}></img>
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
          color={selectedAlumnus.user.school.color}
        />
      )}
    </>
  );
};

export default Community;
