import { useQuery } from '@apollo/client';
import { GET_ALUMNI } from '../utils/queries';


const Directory = () => {


  const { loading, error, data } = useQuery(GET_ALUMNI);

  const users = data?.alumni || [];

    return (
        <>
        <h3> Directory - Complete list of all users</h3>  
        
        
 {loading && <p>Loading users...</p>}     

 {error && <p>Error loading users: {error.message}</p>}

 {users.length > 0 && (
   <div>
     <h2>Users List:</h2>
     <ul>
       {users.map((user) => (
         <li key={user.id}>
           {user.firstName} - {user.bio} - Display in public: {user.public}
         </li>
       ))}
     </ul>
   </div>
 )} 
  </>

    );
   
};

export default Directory;