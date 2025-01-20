import { useState, useEffect, useCallback } from "react";
import { createEmptyBeansBoard, validateBoard } from "./beansUtils";
import { BeansBoard, GameState, GameScore } from "@utils/types";
import refreshIcon from "@assets/refresh.svg";
import forwardsIcon from "@assets/skip-forward.svg";
import timerIcon from "@assets/timer.svg";
import { TertiaryIconButton } from "@components/ui/Buttons";
import { formatTimer } from "@components/games/gameUtils";
import BeansSquare from "./BeansSquare";
import GameOverlay from "../GameOverlay";

interface BeansGameProps {
  board: BeansBoard | null;
  index: number;
  players: GameScore[];
  gameState: GameState;
  puzzleComplete: () => void;
  startPuzzle: () => void;
  skipPuzzle: () => void;

}

const BeansGame = ({ board, index, players, gameState, puzzleComplete, startPuzzle, skipPuzzle }: BeansGameProps)  => {
  const [playableBoard, setPlayableBoard] = useState<BeansBoard>(createEmptyBeansBoard());
  const [initialBoard, setInitialBoard] = useState<BeansBoard>(createEmptyBeansBoard());
  const [alertState, setAlertState] = useState({ valid: true, message: "" });

  const resetBoard = useCallback(() => {
    setPlayableBoard(JSON.parse(JSON.stringify(initialBoard)));

    const isValid = validateBoard(initialBoard);
    setAlertState({ valid: isValid.valid, message: isValid.message });
  }, [initialBoard]);

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

    const { valid, message, completed } = validateBoard(newBoard);
    setAlertState({ valid, message });

    if (completed) {
      puzzleComplete();
    }

    // Set the new board state
    setPlayableBoard(newBoard);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <TertiaryIconButton onClick={resetBoard}>
          <img src={refreshIcon} alt="refresh" />
        </TertiaryIconButton>
        <h1 className="game-title">Beans {index ? `#${index}` : ""}</h1>
        <TertiaryIconButton onClick={skipPuzzle}>
          <img src={forwardsIcon} alt="refresh" />
        </TertiaryIconButton>
      </div>
      <div className="game-timer">
        <img src={timerIcon} alt="timer" className="game-timer-icon"/>
        <div className="game-timer-text">
          {formatTimer(gameState.timer)}
        </div>
      </div>
      <div className="game-board bean">
        <GameOverlay players={players} type="beans" gameState={gameState} startPuzzle={startPuzzle}/>
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
