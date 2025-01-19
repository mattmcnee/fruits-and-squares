import { useState, useEffect } from "react";
import { createEmptyBeansBoard, validateBoard } from "./beansUtils";
import { BeansBoard, GameState } from "@utils/types";
import refreshIcon from "@assets/refresh.svg";
import forwardsIcon from "@assets/skip-forward.svg";
import { TertiaryIconButton } from "@components/ui/Buttons";
import { formatTimer } from "@components/games/gameUtils";
import { useNavigate } from "react-router-dom";
import BeansSquare from "./BeansSquare";

interface BeansGameProps {
  board: BeansBoard | null;
  index: number;
  gameState: GameState;
  puzzleComplete: () => void;
  startPuzzle: () => void;
}

const BeansGame = ({ board, index, gameState, puzzleComplete, startPuzzle }: BeansGameProps)  => {
  const [playableBoard, setPlayableBoard] = useState<BeansBoard>(createEmptyBeansBoard());
  const [initialBoard, setInitialBoard] = useState<BeansBoard>(createEmptyBeansBoard());
  const [alertState, setAlertState] = useState({ valid: true, message: "" });

  const navigate = useNavigate();

  useEffect(() => {
    if (board) {
      setAlertState({ valid: true, message: "" });
      setPlayableBoard(board);
      setInitialBoard(JSON.parse(JSON.stringify(board))); // Create a deep copy of the board
    } 
  }, [board]);
  
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // Create a copy of the board to modify the clicked cell
    const newBoard = [...playableBoard];
    const clickedCell = newBoard[rowIndex][colIndex];

    // Update the cell based on the current state
    if (!clickedCell.hasCross && !clickedCell.hasBean) {
      clickedCell.hasCross = true;
    } else if (clickedCell.hasCross && !clickedCell.hasBean) {
      clickedCell.hasCross = false;
      clickedCell.hasBean = true;
    } else {
      clickedCell.hasBean = false;
    }

    const { valid, message } = validateBoard(newBoard);
    setAlertState({ valid, message });

    // Set the new board state
    setPlayableBoard(newBoard);
  };


  return (
    <div className="game-container">
      <div className="game-header">
        <TertiaryIconButton onClick={() => alert("Refresh")}>
          <img src={refreshIcon} alt="refresh" />
        </TertiaryIconButton>
        <h1 className="game-title">Beans {index ? `#${index}` : ""}</h1>
        <TertiaryIconButton onClick={() => navigate("/beans/new")}>
          <img src={forwardsIcon} alt="refresh" />
        </TertiaryIconButton>
      </div>
      <div className="game-timer">{formatTimer(gameState.timer)}</div>
      <div className="game-board bean">
        {playableBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <BeansSquare key={`${rowIndex}-${colIndex}`} cell={cell} rowIndex={rowIndex} colIndex={colIndex} handleCellClick={handleCellClick} />
          ))
        )}
      </div>
      {alertState.message ? (
        <div
          className="game-alert"
          style={{
            backgroundColor: alertState.valid ? "#d4edda" : "#f8d7da",
            color: alertState.valid ? "#155724" : "#721c24",
            border: `1px solid ${alertState.valid ? "#c3e6cb" : "#f5c6cb"}`,
          }}
        >
          {alertState.message}
        </div>
      ) : (
        <div
          className="game-alert"
        >
        One bean per row, column and colour
        </div>
      )}
    </div>
  );
};

export default BeansGame;
