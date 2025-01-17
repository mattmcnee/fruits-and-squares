import { useEffect } from "react";
import { useAuth } from "@firebase/useAuth";
import { useNavigate } from "react-router-dom";
import Navbar from "@components/ui/Navbar";
import AuthButton from "@components/ui/AuthButton";
import "./Page.scss";

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
        <AuthButton onClick={authenticateWithLinkedIn} />
      </div>
    </>
  );
};

export default LinkedInLogin;