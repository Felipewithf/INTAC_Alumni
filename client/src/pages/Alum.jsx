import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";

import { useQuery, useMutation } from "@apollo/client";
import { GET_LOGGED_IN_USER, GET_ALUMPROFILE_BY_ID } from "../utils/queries";

const Alum = () => {
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  const handleAdminDashboard = () => {
    navigate("/admin");
  };
  return (
    <>
      <div className="alumPage">
        <div className="topNavigation">
          <button>Edit</button>
          <div className="rightGroup">
            <button onClick={handleAdminDashboard}>Admin Dashboard</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div className="alumData">
          <div className="personal">
            <div className="name">
              <div></div>
              <div>Sarmiento</div>
            </div>
            <p className="bio">
              I am a multifaceted professional based in Toronto with a passion for design,
              technology, and innovation. With a Master's in Inclusive Design, focused on
              using design to transform lives through digital and physical experiences. I
              have an extensive experience in the startup ecosystem, scaling teams, and
              managing product design, branding, and marketing efforts.
            </p>
            <div className="permission">
              <p>
                Your profile is: <strong>Public</strong>
              </p>
            </div>
            <div className="separatingLine"></div>
            <div className="links">
              <div className="linkItem">
                <div className="linkInfo">
                  <p>Portfolio:</p>
                  <a href="https://felipewithf.com">
                    <p>https://felipewithf.com</p>
                  </a>
                </div>
                <button className="deleteIcon"></button>
              </div>
              <br></br>
              <button>+ Add Links</button>
              <div className="separatingLine"></div>
            </div>
            <div className="socials">
              <div className="socialItem">
                <div className="socialInfo">
                  <img src="socials/i_in.svg"></img>
                  <p>Instagram:</p>
                  <a href="https://university.alchemy.com/hackathons/shapecraft">
                    <p>https://university.alchemy.com/hackathons/shapecraft</p>
                  </a>
                </div>

                <button className="deleteIcon"></button>
              </div>
              <div className="socialItem">
                <div className="socialInfo">
                  <img src="socials/i_dribble.svg"></img>
                  <p>Dribble:</p>
                  <a href="https://university.alchemy.com/hackathons/shapecraft">
                    <p>https://university.alchemy.com/hackathons/shapecraft</p>
                  </a>
                </div>

                <button className="deleteIcon"></button>
              </div>
              <br></br>
              <button>+ Add Socials</button>
              <div className="separatingLine"></div>
            </div>
          </div>
          <div className="exhibitions">
            <h3>Exhibitions & References</h3>
            <div className="separatingLine"></div>
            <div className="exhibitionItem">
              <img src="studentExhibition/winter_art_expo.png" alt=""></img>
              <div className="references">
                <div className="referenceItem">
                  <div className="referenceInfo">
                    <p>[1]</p>
                    <a href="https:/google.com/testintesting">
                      https:/google.com/testintesting
                    </a>
                  </div>
                  <button className="deleteIcon"></button>
                </div>
                <button>+ Add Reference</button>
              </div>
            </div>
            <div className="separatingLine"></div>
            <button>+ Add Exhibition</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Alum;
