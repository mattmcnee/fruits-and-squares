import LinkedInIcon from "/src/assets/linkedin-white.png";
import "./AuthButton.scss";

interface AuthButtonProps {
  onClick: () => void;
}

const AuthButton = ({ onClick }: AuthButtonProps) => {
  return (
    <button className='auth-button' onClick={onClick}>
      <img className='auth-icon' src={LinkedInIcon} alt="LinkedIn logo" />
      <span className='auth-text'>Continue with LinkedIn</span>
    </button>
  );
};

export default AuthButton;