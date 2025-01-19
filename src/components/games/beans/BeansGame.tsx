import { useState, useEffect } from 'react';
import { colors, createEmptyBeansBoard } from './beansUtils';
import { BeansBoard, GameState } from '@utils/types';
import beanIcon from '/src/assets/bean.svg';
import crossIcon from '/src/assets/tiny-cross.svg';
import { useNavigate } from "react-router-dom";

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
  const [alertState, setAlertState] = useState({ valid: true, message: '' });

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

    // Update the alert state based on the current board state
    updateAlertState(newBoard, rowIndex, colIndex, clickedCell.color);

    // Set the new board state
    setPlayableBoard(newBoard);
  };

  const updateAlertState = (board: BeansBoard, rowIndex: number, colIndex: number, color: string) => {
    const { valid, message } = {valid: true, message: ''};
    console.log(valid, message);
    setAlertState({ valid, message });

  };

  return (
    <div className="game-container">
      <h1 className="game-title">Beans</h1>
      <div className="game-board bean">
        {playableBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className="game-cell bean"
              style={{
                backgroundColor: cell.color || '#000',
                borderBottom: rowIndex === 9 ? '1px solid #000' : 'none',
                borderRight: colIndex === 9 ? '1px solid #000' : 'none',
                borderTopRightRadius: rowIndex === 0 && colIndex === 9 ? '5px' : '0',
                borderBottomRightRadius: rowIndex === 9 && colIndex === 9 ? '5px' : '0',
                borderTopLeftRadius: rowIndex === 0 && colIndex === 0 ? '5px' : '0',
                borderBottomLeftRadius: rowIndex === 9 && colIndex === 0 ? '5px' : '0',
              }}
            >
              {cell.hasCross && (
                <div
                  className="cell-marker"
                >
                  <img className="cell-img" src={crossIcon}></img>
                </div>
              )}
              {cell.hasBean && (
                <div
                  className="cell-marker"
                >
                  <img className="cell-img" src={beanIcon}></img>
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
            backgroundColor: alertState.valid ? '#d4edda' : '#f8d7da',
            color: alertState.valid ? '#155724' : '#721c24',
            border: `1px solid ${alertState.valid ? '#c3e6cb' : '#f5c6cb'}`,
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
