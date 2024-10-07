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

  console.log(data);
  return (
    <div>
      <div className="constructionBanner">
        <h3>Admin Dashboard</h3>
      </div>
      {users.length > 0 ? (
      <>
      <h2>ADMINS</h2>

      <table class="user-table" id='adminUserTable'>
        
        <thead>
          <tr>
            <th>Email</th>
            <th>Designation</th>
            <th>Year(s)</th>
            <th>Community Role</th>
            <th>School</th>
            <th>Register</th>
          </tr>
        </thead>
        <tbody>
        {users.map((user) => (
          user.isAdmin && (
          <tr className={user.email === loggedInUser.email? "highlightUser":"" } key={user.id}>
            <td>{user.email}</td>
            <td>
            <select defaultValue={user.designationRole}> 
                  <option value="Alumni">Alumni</option>
                  <option value="Collaborator">Collaborator</option>
                  <option value="Faculty">Faculty</option>
             </select>
            </td>
            <td>
              <input type="text" value={user.years.join(', ')} />
            </td>
            <td>
            <select defaultValue={user.isAdmin? "Admin": "User"}>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            </td>
            <td>
            <select defaultValue={user.school.name}>
                <option value="Intac Academy">Intac Academy</option>
                <option value="Artisan University">Artisan University</option>
                <option value="CAMH">CAMH</option>
            </select>
            </td>
            <td>
            
            </td>
          </tr>
          )
          ))}

          </tbody>
          </table>

        <h2>USERS</h2>

        <table class="user-table" id='usersTable'>
        
        <thead>
          <tr>
            <th>Email</th>
            <th>Designation</th>
            <th>Year(s)</th>
            <th>Community Role</th>
            <th>School</th>
            <th>Register</th>
          </tr>
        </thead>
        <tbody>
        {users.map((user) => (
          !user.isAdmin && (
          <tr key={user.id}>
            <td>{user.email}</td>
            <td>
            <select defaultValue={user.designationRole}>
                  <option value="Alumni">Alumni</option>
                  <option value="Collaborator">Collaborator</option>
                  <option value="Faculty">Faculty</option>
             </select>
            </td>
            <td>
              <input type="text" value={user.years.join(', ')} />
            </td>
            <td>
            <select defaultValue={user.isAdmin? "Admin": "User"}>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            </td>
            <td>
            <select defaultValue={user.school.name}>
                <option value="Intac Academy">Intac Academy</option>
                <option value="Artisan University">Artisan University</option>
                <option value="CAMH">CAMH</option>
            </select>
            </td>
            <td>
              <div className={`register-circle ${user.register ? 'check' : ''}`}></div>
            </td>
          </tr>
          )
          ))}

          </tbody>
          </table>

          </>
      ) : (
        <p>No users found.</p>
      )}

      
      {loggedInUser && (
        <div>
          <h1>Welcome, {loggedInUser.email}</h1>
          <p>Your ID: {loggedInUser.id}</p>
        </div>
      )}

    </div>
  );
   
};

export default UserAdmin;