import GameCard from "@components/ui/GameCard";
import Navbar from "@components/ui/Navbar";
import { useAuth } from "@firebase/useAuth";
import { useNavigate } from "react-router-dom";
import { ClickableText } from "@components/ui/Buttons";


const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="page-body">
        {user ? (
        <>
          <h1>Welcome back {user.displayName}</h1>
          <p>We'll save your scores as you play</p>
        </>
        ) : (
        <>
          <h1>Welcome to Fruits & Squares</h1>
          <p>
            <ClickableText className="inline-text" onClick={() => navigate("/signin")}>Sign in </ClickableText>
            <span> to save your scores or play infinite random games without an account</span>
          </p>
        </>
        )}

        <br></br>

        <div className="cards-container">
          <GameCard type="mango" />
          <GameCard type="beans" />
        </div>
      </div>
    </div>
  );
};

export default Home;