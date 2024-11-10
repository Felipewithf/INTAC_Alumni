import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";

import { useQuery, useMutation } from "@apollo/client";
import { GET_LOGGED_IN_USER, GET_ALUMPROFILE_BY_ID } from "../utils/queries";

const NewAlum = () => {
  const navigate = useNavigate();

  const {
    loading: loadingUser,
    error: errorUser,
    data: userData,
  } = useQuery(GET_LOGGED_IN_USER);

  if (loadingUser) {
    return <p>Loading users...</p>;
  }

  const handleLogout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <>
      <div className="topNavigation">
        <button>SAVE</button>
        <div className="rightGroup">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      here goes the fields for new alumns
    </>
  );
};

export default NewAlum;
