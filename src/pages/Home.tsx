import GameCard from "@components/ui/GameCard";
import Navbar from "@components/ui/Navbar";
import { useAuth } from "@firebase/useAuth";
import { Link, useNavigate } from "react-router-dom";
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

        <br/>

        <div className="cards-container">
          <GameCard type="mango" />
          <GameCard type="beans" />
        </div>

        <br/>
        <br/>

        <h2>Mango rules</h2>

        <p>To finish the game, every square must contain either a mango or a banana.</p>
        <p>There must be the same number of mangoes and bananas in each row and column.</p>
        <p>No more than 2 mangoes or bananas may be next to each other, either vertically or horizontally.</p>
        <p>Cells separated by an = sign must be of the same type and cells separated by an x sign must be of the opposite type.</p>
        <p>There may be more than one valid answer and the game will accept any valid solution.</p>

        <h2>Beans rules</h2>
        <p>To finish the game, ten beans must be placed, each in their own row, column and colour.</p>
        <p>Beans cannot be directly next to other beans, either vertically, horizontally or diagonally.</p>
        <p>Places where a bean cannot be placed may be marked with and x.</p>
        <p>There may be more than one valid answer and the game will accept any valid solution.</p>

        <h2>About This Application</h2>
        <p>This is an open source project that accepts community contributions. The code is available <Link to="https://github.com/mattmcnee/fruits-and-squares">here</Link>.</p>
        <p>Fruits & Squares is an independent product and is not affiliated with, nor has it been authorized, sponsored, or otherwise approved by LinkedIn Corporation.</p>
        <p>Users are encouraged to play the games these puzzles are inspired by, namely <Link to="https://www.linkedin.com/showcase/tango-game/">Tango</Link> and <Link to="https://www.linkedin.com/showcase/queens-game/">Queens</Link>.</p>



      </div>
    </div>
  );
};

export default Home;