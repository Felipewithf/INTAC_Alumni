import { useQuery } from '@apollo/client';
import { GET_USERS,GET_LOGGED_IN_USER } from '../utils/queries';


const UserAdmin = () => {

  const { loading, error, data } = useQuery(GET_USERS);
  const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_LOGGED_IN_USER);

  if (loading || loadingUser) {
    return <p>Loading users...</p>;
  }

  if (error || errorUser) {
    return (
      <p>
        Error loading users: {error ? error.message : ''} or error verifying user: {errorUser ? errorUser.message : ''}
      </p>
    );
  }

  const users = data?.users || [];
  const loggedInUser = userData?.getLoggedInUser || null;

  return (
    <div>
      <h3>User Admin - Complete list of users</h3>
      
      {loggedInUser && (
        <div>
          <h1>Welcome, {loggedInUser.email}</h1>
          <p>Your ID: {loggedInUser.id}</p>
        </div>
      )}

      {users.length > 0 ? (
        <div>
          <h2>Users List:</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.email} - {user.school?.name || 'No school info'}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
   
};

export default UserAdmin;