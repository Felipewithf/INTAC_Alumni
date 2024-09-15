import { useQuery } from '@apollo/client';
import { GET_USERS } from '../utils/queries';


const UserAdmin = () => {


  const { loading, error, data } = useQuery(GET_USERS);

  const users = data?.users || [];

    return (
        <>
        <h3> User Admin - Complete list of users</h3>  
        
        
 {loading && <p>Loading users...</p>}     

 {error && <p>Error loading users: {error.message}</p>}

 {users.length > 0 && (
   <div>
     <h2>Users List:</h2>
     <ul>
       {users.map((user) => (
         <li key={user.id}>
           {user.email} - {user.school.name}
         </li>
       ))}
     </ul>
   </div>
 )} 
  </>

    );
   
};

export default UserAdmin;