import { useEffect, useState, useCallback } from "react";
import refreshIcon from "/src/assets/refresh.svg";
import forwardsIcon from "/src/assets/skip-forward.svg";
import timerIcon from "/src/assets/timer.svg";

import { createEmptyMangoBoard, validateBoard } from "./mangoUtils";
import { TertiaryIconButton } from "@components/ui/Buttons";

import { MangoBoard, GameState, GameScore } from "@utils/types";
import { formatTimer } from "@components/games/gameUtils";
import MangoSquare from "./MangoSquare";
import GameOverlay from "../GameOverlay";

interface MangoGameProps {
  board: MangoBoard | null;
  index: number;
  players: GameScore[];
  gameState: GameState;
  puzzleComplete: () => void;
  startPuzzle: () => void;
  skipPuzzle: () => void;
}

const MangoGame = ({ board, index, players, gameState, puzzleComplete, startPuzzle, skipPuzzle }: MangoGameProps) => {
  const [playableBoard, setPlayableBoard] = useState<MangoBoard>(createEmptyMangoBoard());
  const [initialBoard, setInitialBoard] = useState<MangoBoard>(createEmptyMangoBoard());

  useEffect(() => {
    if (board) {
      setAlertState({ valid: true, message: "" });
      setPlayableBoard(board);
      setInitialBoard(JSON.parse(JSON.stringify(board))); // Create a deep copy of the board
    } 
  }, [board]);

  const [alertState, setAlertState] = useState({
    valid: true,
    message: "",
  });

  const resetBoard = useCallback(() => {
    setPlayableBoard(JSON.parse(JSON.stringify(initialBoard)));

    const isValid = validateBoard(initialBoard);
    setAlertState({ valid: isValid.valid, message: isValid.message });
  }, [initialBoard]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const newBoard = [...playableBoard];
    const clickedCell = newBoard[rowIndex][colIndex];

    if (clickedCell.isFixed) return;

    // Toggle between states for hasBanana and hasMango
    if (!clickedCell.hasBanana && !clickedCell.hasMango) {
      clickedCell.hasMango = true;
    } else if (clickedCell.hasMango && !clickedCell.hasBanana) {
      clickedCell.hasBanana = true;
      clickedCell.hasMango = false;
    } else {
      clickedCell.hasBanana = false;
    }

    const isValid = validateBoard(newBoard);
    setAlertState({ valid: isValid.valid, message: isValid.message });

    if (isValid.completed) {
      puzzleComplete();
    }

    setPlayableBoard(newBoard);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <TertiaryIconButton onClick={resetBoard} className="no-select">
          <img src={refreshIcon} alt="refresh" />
        </TertiaryIconButton>
        <h1 className="game-title">Mango {index ? `#${index}` : ""}</h1>
        <TertiaryIconButton onClick={skipPuzzle} className="no-select">
          <img src={forwardsIcon} alt="refresh" />
        </TertiaryIconButton>
      </div>
      <div className="game-timer">
        <img src={timerIcon} alt="timer" className="game-timer-icon"/>
        <div className="game-timer-text">
          {formatTimer(gameState.timer)}
        </div>
      </div>
      <div className="game-board mango">
        <GameOverlay players={players} type="mango" gameState={gameState} startPuzzle={startPuzzle}/>
        {playableBoard && playableBoard.map((row: typeof playableBoard[0], rowIndex) =>
          row.map((cell, colIndex) => (
            <MangoSquare
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              rowIndex={rowIndex}
              colIndex={colIndex}
              handleCellClick={handleCellClick}
            />
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
        Three of each per row and column
        </div>
      )}
    </div>
  );
};

export default MangoGame;
