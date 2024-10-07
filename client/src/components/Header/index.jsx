import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header className="">
      <div>
        logo
      </div>
      <div id='centerLinks'>
        <div>
          <Link to="/">
            Community          
            </Link>
        </div>
        <div>
          <Link to="/">
            Announcements
          </Link>
        </div>
        </div>
        <div>
          {Auth.loggedIn() ? (
            <>
              <Link className="" to="/me">
                {/* Run the getProfile() method to get access to the unencrypted token value in order to retrieve the user's username  */}
                {/* {Auth.getProfile().authenticatedPerson.username}'s profile */}
              </Link>
              <div className="" onClick={logout}>
                Logout
              </div>
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
