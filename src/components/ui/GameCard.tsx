import mangoIcon from "@assets/mango.svg";
import beansIcon from "@assets/bean.svg";
import "./GameCard.scss";
import { Link } from "react-router-dom";

interface GameCardProps {
  type: string;
}

const GameCard = ({ type }: GameCardProps) => {
  const gameName = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <Link to={`/${type}/new`}>
      <div className="game-card">
        <img className={`game-card-img ${type}`} src={type === "mango" ? mangoIcon : beansIcon} alt={`${type} Icon`} />
        <div className="game-card-details">
          <h2>{gameName}</h2>
          {type === "mango" ? (
            <p>Place the same number of mangoes and bananas in every row and column</p>
          ) : (
            <p>Place ten beans with only one in each row, column, and coloured region</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GameCard;