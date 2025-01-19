import { BeansBoard } from "@utils/types";

const size = 10;
const maxAttempts = 1000;

export const colors = [
  { color: '#96beff', name: 'Blue' },
  { color: '#b3dfa0', name: 'Green' },
  { color: '#dfdfdf', name: 'Grey' },
  { color: '#dfa0bf', name: 'Pink' },
  { color: '#ff7b60', name: 'Red' },
  { color: '#e6f388', name: 'Yellow' },
  { color: '#b9b29e', name: 'Dark grey' },
  { color: '#a3d2d8', name: 'Turquoise' },
  { color: '#ffc992', name: 'Salmon' },
  { color: '#bba3e2', name: 'Purple' }
];

export const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const gridDirections = [
  [-1, 0], [1, 0], // Up, Down
  [0, -1], [0, 1], // Left, Right
];

// Empty board where each cell is #fff (white)
export const createEmptyBeansBoard = () =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      color: "#fff",
      hasCross: false,
      hasBean: false,
    }))
  );

const isSafeToPlaceCross = (board: BeansBoard, row: number, col:number) => {
  return directions.every(([dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;
    return (
      newRow < 0 || newRow >= size || // Out of bounds
      newCol < 0 || newCol >= size || // Out of bounds
      !board[newRow][newCol].hasCross // No cross in this cell
    );
  });
};

const findAdjacentSquares = (board: BeansBoard, row: number, col: number) => {
  return gridDirections
    .map(([dx, dy]) => [row + dx, col + dy])
    .filter(
      ([newRow, newCol]) =>
        newRow >= 0 &&
        newRow < size &&
        newCol >= 0 &&
        newCol < size &&
        !board[newRow][newCol].hasCross && // No cross
        board[newRow][newCol].color === "#fff" // Empty square
    );
};

const colorAdjacentSquares = (board: BeansBoard): BeansBoard => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));

  newBoard.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell.hasCross) {
        const adjacent = findAdjacentSquares(newBoard, rowIndex, colIndex);
        if (adjacent.length > 0) {
          const [randomRow, randomCol] =
            adjacent[Math.floor(Math.random() * adjacent.length)];
          newBoard[randomRow][randomCol].color = cell.color;
        }
      }
    });
  });

  return newBoard;
};

const fillBoardWithColor = (board: BeansBoard): BeansBoard => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  let filled = false;

  while (!filled) {
    filled = true; // Assume the board will be filled
    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      for (let colIndex = 0; colIndex < size; colIndex++) {
        const cell = newBoard[rowIndex][colIndex];

        // If the square has no color, skip it
        if (!cell.color) continue;

        // Check if any adjacent square is empty
        const adjacent = findAdjacentSquares(newBoard, rowIndex, colIndex);
        if (adjacent.length > 0) {
          // Pick a random adjacent square to color
          const [randomRow, randomCol] =
            adjacent[Math.floor(Math.random() * adjacent.length)];
          newBoard[randomRow][randomCol].color = cell.color;
          filled = false; // The board is not yet fully filled
        }
      }
    }
  }

  return newBoard;
};

const removeCrosses = (board: BeansBoard) => {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      hasCross: false,
    }))
  );
};


export const tryGenerateBoard = () => {
  const board = createEmptyBeansBoard();

  const usedColumns = new Set();
  let isValid = true;

  for (let rowIndex = 0; rowIndex < size; rowIndex++) {
    let colIndex = 0;
    let foundValidSpot = false;

    for (let tries = 0; tries < size; tries++) { // Try at most 10 columns
      colIndex = Math.floor(Math.random() * size);
      if (
        !usedColumns.has(colIndex) && // Ensure the column is unique
        isSafeToPlaceCross(board, rowIndex, colIndex) // Ensure no adjacent crosses
      ) {
        foundValidSpot = true;
        break;
      }
    }

    if (!foundValidSpot) {
      isValid = false; // Restart placement if no valid spot found
      break;
    }

    usedColumns.add(colIndex);
    board[rowIndex][colIndex].hasCross = true;
    board[rowIndex][colIndex].color = colors[rowIndex].color;
  }

  if (isValid) {
    return board;
  }

  return board;
}

export const generateBeansBoard = () => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    let board = tryGenerateBoard();
    if (board) {
      board = colorAdjacentSquares(board);
      board = fillBoardWithColor(board);
      board = removeCrosses(board);
      return board;
    }
    attempts++;
  }

  return null;
}

  