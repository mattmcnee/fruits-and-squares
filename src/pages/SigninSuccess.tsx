import { useEffect, useRef } from 'react';
import { useAuth } from '@firebase/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@components/ui/Navbar';

const LinkedInCallback = () => {
  const hasFetched = useRef(false);
  const { user, loading, signInWithCode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
    if (hasFetched.current || loading) return;

    hasFetched.current = true;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      signInWithCode(code);
    }
  }, [user, loading, navigate]);

  return (
    <div>
      <Navbar />
      <div className="page-body centered">
        Authenticating...
      </div>
    </div>
  );
};

export default LinkedInCallback;