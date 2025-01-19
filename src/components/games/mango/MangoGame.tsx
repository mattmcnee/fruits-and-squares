import { useEffect, useState, useCallback } from "react";
import bananaIcon from "/src/assets/banana.svg";
import mangoIcon from "/src/assets/mango.svg";
import crossIcon from "/src/assets/tiny-cross.svg";
import equalsIcon from "/src/assets/tiny-equals.svg";
import refreshIcon from "/src/assets/refresh.svg";
import forwardsIcon from "/src/assets/skip-forward.svg";

import { createEmptyBoard, validateBoard } from "./mangoUtils";
import { TertiaryIconButton, PrimaryButton } from "@components/ui/Buttons";

import { useNavigate } from "react-router-dom";
import { MangoBoard, GameState } from "@utils/types";
import { formatTimer } from "@components/games/gameUtils";

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
          {gameState.completed ? ( 
            <>
              <div className="overlay-text">Completed in {formatTimer(gameState.timer)}</div>
              <PrimaryButton onClick={() => navigate("/mango/new")}>Play another</PrimaryButton>
            </>
          ) : (
            <>
              <div className="overlay-text">Are you ready?</div>
              <PrimaryButton onClick={startPuzzle} className="overlay-button">Play Mango</PrimaryButton>
            </>
          )}
        </div>
        {playableBoard && playableBoard.map((row: typeof playableBoard[0], rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className="game-cell mango"
              style={{
                backgroundColor: cell.isFixed ? "#e5e5e5" : "#fff",
                borderBottom: rowIndex === 5 ? "1px solid #000" : "none",
                borderRight: colIndex === 5 ? "1px solid #000" : "none",
                borderTopRightRadius: rowIndex === 0 && colIndex === 5 ? "5px" : "0",
                borderBottomRightRadius: rowIndex === 5 && colIndex === 5 ? "5px" : "0",
                borderTopLeftRadius: rowIndex === 0 && colIndex === 0 ? "5px" : "0",
                borderBottomLeftRadius: rowIndex === 5 && colIndex === 0 ? "5px" : "0",
              }}
            >
              {cell.hasBanana && (
                <div
                  className="cell-marker"
                >
                  <img className="cell-img" src={bananaIcon} alt="banana" />
                </div>
              )}
              {cell.hasMango && (
                <div
                  className="cell-marker"
                >
                  <img className="cell-img" src={mangoIcon} alt="mango" />
                </div>
              )}
              {cell.hasRight.exists && (
                <div
                  className="line-marker right"
                >
                  <img
                    className="line-marker-img"
                    src={cell.hasRight.isEquals ? equalsIcon : crossIcon}
                    alt={cell.hasRight.isEquals ? "equals" : "cross"}
                  />
                </div>
              )}
              {cell.hasBottom.exists && (
                <div
                  className="line-marker bottom"
                >
                  <img
                    className="line-marker-img"
                    src={cell.hasBottom.isEquals ? equalsIcon : crossIcon}
                    alt={cell.hasBottom.isEquals ? "equals" : "cross"}
                  />
                </div>
              )}
            </div>
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
