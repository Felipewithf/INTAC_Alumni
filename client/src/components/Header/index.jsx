import { Link, useLocation } from "react-router-dom";
import Auth from "../../utils/auth";

const Header = () => {
  const location = useLocation(); // Get the current location

  return (
    <header className="">
      <div>logo</div>
      <div id="centerLinks">
        <div>
          <Link className={location.pathname === "/" ? "underscore" : ""} to="/">
            Community
          </Link>
        </div>
        <div>
          <Link className={location.pathname === "/a" ? "underscore" : ""} to="/">
            Announcements
          </Link>
        </div>
      </div>
      <div>
        {Auth.loggedIn() ? (
          <>
            <Link
              className={`alumInitials ${
                location.pathname === "/alum" || location.pathname === "/newAlum"
                  ? "active"
                  : ""
              }`}
              to="/alum"
            >
              🛂
            </Link>
          </>
        ) : (
          <>
            <Link className="" to="/login">
              Login
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
