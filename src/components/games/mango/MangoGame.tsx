import { useEffect, useState, useCallback } from "react";
import refreshIcon from "/src/assets/refresh.svg";
import forwardsIcon from "/src/assets/skip-forward.svg";

import { createEmptyBoard, validateBoard } from "./mangoUtils";
import { TertiaryIconButton, PrimaryButton } from "@components/ui/Buttons";

import { useNavigate } from "react-router-dom";
import { MangoBoard, GameState } from "@utils/types";
import { formatTimer } from "@components/games/gameUtils";
import MangoSquare from "./MangoSquare";

interface MangoGameProps {
  board: MangoBoard | null;
  index: number;
  gameState: GameState;
  puzzleComplete: () => void;
  startPuzzle: () => void;
}

const MangoGame = ({ board, index, gameState, puzzleComplete, startPuzzle }: MangoGameProps) => {
  const [playableBoard, setPlayableBoard] = useState<MangoBoard>(createEmptyBoard());
  const [initialBoard, setInitialBoard] = useState<MangoBoard>(createEmptyBoard());

  const navigate = useNavigate();

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
        <TertiaryIconButton onClick={resetBoard}>
          <img src={refreshIcon} alt="refresh" />
        </TertiaryIconButton>
        <h1 className="game-title">Mango {index ? `#${index}` : ""}</h1>
        <TertiaryIconButton onClick={() => navigate("/mango/new")}>
          <img src={forwardsIcon} alt="refresh" />
        </TertiaryIconButton>
      </div>
      <div className="game-timer">{formatTimer(gameState.timer)}</div>
      <div className="game-board mango">
        <div className={`game-board-overlay ${gameState.playing ? "hidden" : ""}`}>
          {gameState.loading ? (
            <div>Loading</div>
          ) : (
            gameState.completed ? ( 
              <>
                <div className="overlay-text">Completed in {formatTimer(gameState.timer)}</div>
                <PrimaryButton onClick={() => navigate("/mango/new")} className="overlay-button">Play another</PrimaryButton>
              </>
            ) : (
              <>
                <div className="overlay-text">Are you ready?</div>
                <PrimaryButton onClick={startPuzzle} className="overlay-button">Play Mango</PrimaryButton>
              </>
            ))}
        </div>
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
