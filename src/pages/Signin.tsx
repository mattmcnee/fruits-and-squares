import { useEffect } from "react";
import { useAuth } from "@firebase/useAuth";
import { useNavigate } from "react-router-dom";
import Navbar from "@components/ui/Navbar";
import { AuthLinkedInButton } from "@components/ui/Buttons";

const LinkedInLogin = () => {
  const { user, authenticateWithLinkedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <Navbar />
      <div className="page-body centered">
        <AuthLinkedInButton onClick={authenticateWithLinkedIn}>
          Continue with LinkedIn
        </AuthLinkedInButton>
      </div>
    </>
  );
};

export default LinkedInLogin;