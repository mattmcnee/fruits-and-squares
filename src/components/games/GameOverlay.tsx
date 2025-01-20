import { PrimaryButton } from "@components/ui/Buttons";
import BarChart from "@components/ui/BarChart";
import { GameState, GameScore } from "@utils/types";
import { useNavigate } from "react-router-dom";
import useAuth from "@firebase/useAuth";
import { useEffect, useState } from "react";
import { generatePerformanceGraph } from "@components/games/gameUtils";

interface GameOverlayProps {
  gameState: GameState;
  type: string;
  players: GameScore[];
  startPuzzle: () => void;
}

const GameOverlay = ({gameState, type, players, startPuzzle}: GameOverlayProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<any| null>(null);
  const [performance, setPerformance] = useState<string | null>(null);

  useEffect(() => {
    if (user && (gameState.timer > 0 || players.length > 0)) {
      // The players array contains the scores in Firestore
      // The user may have finished the game after these were loaded
      // In that case, we add their score to the array
      const userExists = players.some(player => player.uid === user.uid);
      if (!userExists) {
        players.push({
          time: gameState.timer,
          uid: user.uid,
          playedAt: new Date(),
        });
      }

      // Prcoess data to display in a bar chart
      const newData = generatePerformanceGraph(user.uid, players);
      setData(newData.graphData);
      setPerformance(newData.userPerformance);
    }
  }, [user, gameState, players, type]);






  return(

    <div className={`game-board-overlay ${gameState.playing ? "hidden" : ""}`}>
      {gameState.loading ? (
        <div className="overlay-menu">Loading</div>
      ) : (
        gameState.completed ? ( 
          <>
            <div className="overlay-bar-chart">
              {user && data && (
                <BarChart data={data}/>
              )}
            </div>
            <div className="overlay-menu">
              <div className="overlay-text">{performance}</div>
              <PrimaryButton onClick={() => navigate(`/${type}/new`)} className="overlay-button">Play another</PrimaryButton>
            </div>
          </>
        ) : (
          <div className="overlay-menu">
            <div className="overlay-text">Are you ready?</div>
            <PrimaryButton onClick={startPuzzle} className="overlay-button">Play Mango</PrimaryButton>
          </div>
        ))}
    </div>
  );
};

export default GameOverlay;