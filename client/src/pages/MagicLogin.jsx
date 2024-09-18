import { useEffect,useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const MagicLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  const backURL = import.meta.env.VITE_BACKEND_URL;
  console.log(backURL);

  useEffect(() => {
    const token = searchParams.get('token');
    console.log("retrieve token from url");
    console.log(token);

    if (token) {
      // Send the token to your backend for verification
      axios
        .get(`${backURL}/magic-login-v?token=${token}`)
        .then((response) => {
          const { token: jwtToken } = response.data;

          // Store the JWT token in localStorage (or cookie)
          localStorage.setItem('id_token', jwtToken);

          // Redirect to another page
          setStatus('success');
          navigate('/admin');
        })
        .catch((error) => {
          console.error('Error verifying magic link', error);
          setStatus('error');
        });
    }
  }, [searchParams, navigate]);

  return (
    <div>
        {status === 'loading' && <p>Verifying your magic link...</p>}
        {status === 'error' && <p>Invalid or expired magic link. Please try again.</p>}
    </div>
  );
};

export default MagicLogin;
