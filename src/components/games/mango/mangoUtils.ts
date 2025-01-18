import { MangoBoard, MangoKey } from "@utils/types";

const size = 6;
const maxAttempts = 1000;

export const createEmptyBoard = (): MangoBoard =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      hasBanana: false,
      hasMango: false,
      hasRight: { exists: false, isEquals: false },
      hasBottom: { exists: false, isEquals: false },
      isFixed: false,
    }))
  );

const generateAllCells = () =>
  Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => [row, col])
  ).flat();

const countFruit = (board: MangoBoard, index: number, isRow: boolean, fruitKey: MangoKey) =>
  Array.from({ length: size }).reduce(
    (count: number, _, i) =>
      count +
      (isRow
        ? (board[index][i][fruitKey] ? 1 : 0)
        : (board[i][index][fruitKey] ? 1 : 0)),
    0
  );

const checkConsecutive = (board: MangoBoard, row: number, col: number, fruitKey: MangoKey) => {
  const tempBoard = JSON.parse(JSON.stringify(board));
  tempBoard[row][col][fruitKey] = true;

  // Check horizontally
  for (let r = 0; r < size; r++) {
    let consecutive = 0;
    for (let c = 0; c < size; c++) {
      if (r === row && c === col ? true : tempBoard[r][c][fruitKey]) {
        consecutive++;
        if (consecutive > 2) return true;
      } else {
        consecutive = 0;
      }
    }
  }

  // Check vertically
  for (let c = 0; c < size; c++) {
    let consecutive = 0;
    for (let r = 0; r < size; r++) {
      if (r === row && c === col ? true : tempBoard[r][c][fruitKey]) {
        consecutive++;
        if (consecutive > 2) return true;
      } else {
        consecutive = 0;
      }
    }
  }

  return false;
};

const chooseFruit = (board: MangoBoard, row: number, col: number) => {
  const bananaCountRow = countFruit(board, row, true, "hasBanana");
  const mangoCountRow = countFruit(board, row, true, "hasMango");
  const bananaCountCol = countFruit(board, col, false, "hasBanana");
  const mangoCountCol = countFruit(board, col, false, "hasMango");

  const canPlaceBanana = 
    bananaCountRow < 3 && 
    bananaCountCol < 3 && 
    !checkConsecutive(board, row, col, "hasBanana");

  const canPlaceMango = 
    mangoCountRow < 3 && 
    mangoCountCol < 3 && 
    !checkConsecutive(board, row, col, "hasMango");

  if (canPlaceBanana && canPlaceMango) {
    const bananaTotal = bananaCountRow + bananaCountCol;
    const mangoTotal = mangoCountRow + mangoCountCol;
    
    return bananaTotal < mangoTotal ? "hasBanana" : "hasMango";
  }

  if (canPlaceBanana) return "hasBanana";
  if (canPlaceMango) return "hasMango";
  
  return null;
};

const tryGenerateBoard = () => {
  const board = createEmptyBoard();
  let unfilledCells = generateAllCells();

  while (unfilledCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * unfilledCells.length);
    const [row, col] = unfilledCells.splice(randomIndex, 1)[0];

    const fruitKey = chooseFruit(board, row, col);
    if (!fruitKey) return false;

    board[row][col][fruitKey] = true;
  }

  return board;
};

const addRightAndBottom = (board: MangoBoard) => {
  const randomCount = Math.floor(Math.random() * 4) + 2;
  const randomCells = generateAllCells()
    .filter(([row, col]) => !(row === size - 1 && col === size - 1))
    .sort(() => 0.5 - Math.random())
    .slice(0, randomCount);

  randomCells.forEach(([row, col]) => {
    let isRight = Math.random() < 0.5;
    if (row === size - 1) isRight = true;
    if (col === size - 1) isRight = false;
    
    if (isRight) {
      board[row][col].hasRight.exists = true;
      // Check if either fruit matches
      board[row][col].hasRight.isEquals = 
        (board[row][col].hasBanana && board[row][col + 1].hasBanana) ||
        (board[row][col].hasMango && board[row][col + 1].hasMango);
    } else {
      board[row][col].hasBottom.exists = true;
      // Check if either fruit matches
      board[row][col].hasBottom.isEquals = 
        (board[row][col].hasBanana && board[row + 1][col].hasBanana) ||
        (board[row][col].hasMango && board[row + 1][col].hasMango);
    }
  });

  return board;
};

const addFixedCells = (board: MangoBoard) => {
  const fixedCount = 12;
  const maxInline = 2;
  const randomCells = generateAllCells().sort(() => 0.5 - Math.random());

  let fixedCells = 0;
  const rowFixedCounts = Array(size).fill(0);
  const colFixedCounts = Array(size).fill(0);

  for (let i = 0; i < randomCells.length && fixedCells < fixedCount; i++) {
    const [row, col] = randomCells[i];
    const cellAbove = row > 0 ? board[row - 1][col] : null;
    const cellLeft = col > 0 ? board[row][col - 1] : null;

    if (
      rowFixedCounts[row] < maxInline &&
      colFixedCounts[col] < maxInline &&
      (!cellAbove || !cellAbove.hasBottom.exists) &&
      (!cellLeft || !cellLeft.hasRight.exists) &&
      !board[row][col].hasBottom.exists &&
      !board[row][col].hasRight.exists
    ) {
      board[row][col].isFixed = true;
      fixedCells++;
      rowFixedCounts[row]++;
      colFixedCounts[col]++;
    }
  }

  return board;
};

const clearNonFixedCells = (board: MangoBoard) => {
  board = board.map(row =>
    row.map(cell => ({
      ...cell,
      hasMango: cell.isFixed ? cell.hasMango : false,
      hasBanana: cell.isFixed ? cell.hasBanana : false,
    }))
  );

  return board;
};

export const generateMangoBoard = () => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    let board = tryGenerateBoard();
    if (board) {
      board = addRightAndBottom(board);
      board = addFixedCells(board);
      board = clearNonFixedCells(board);
      
      return board;
    } 
    attempts++;
  }

  return false;
};


// Validate a give board state

const validateBanana = (board: MangoBoard, row: number, col: number) => {
  const bananaCountRow = countFruit(board, row, true, "hasBanana");
  const bananaCountCol = countFruit(board, col, false, "hasBanana");

  return bananaCountRow <= 3 && 
    bananaCountCol <= 3 && 
    !checkConsecutive(board, row, col, "hasBanana");
};

const validateMango = (board: MangoBoard, row: number, col:number ) => {
  const mangoCountRow = countFruit(board, row, true, "hasMango");
  const mangoCountCol = countFruit(board, col, false, "hasMango");

  return mangoCountRow <= 3 && 
    mangoCountCol <= 3 && 
    !checkConsecutive(board, row, col, "hasMango");
};

export const validateBoard = (board: MangoBoard) => {
  // for each cell, check if it has a fruit and if it has a fruit, check if it is valid
  let valid = true;
  let filled = true;
  let completed = false;
  let message = "";

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col].hasBanana && !validateBanana(board, row, col)) {
        valid = false;
        message = `Invalid banana at (${col + 1}, ${row + 1})`;
        break;
      }
      if (board[row][col].hasMango && !validateMango(board, row, col)) {
        valid = false;
        message = `Invalid mango at (${col + 1}, ${row + 1})`;
        break;
      }
      if (board[row][col].hasRight.exists) {
        const notFilled = !board[row][col].hasBanana && !board[row][col].hasMango 
          || !board[row][col + 1].hasBanana && !board[row][col + 1].hasMango;

        if (!notFilled) {
          const isEquals = board[row][col].hasBanana == board[row][col + 1].hasBanana 
            && board[row][col].hasMango == board[row][col + 1].hasMango;

          if (isEquals != board[row][col].hasRight.isEquals) {
            valid = false;
            message = `Invalid evaluation to the right of (${col + 1}, ${row + 1})`;
            break;
          }
        }
      }
      if (board[row][col].hasBottom.exists) {
        const notFilled = !board[row][col].hasBanana && !board[row][col].hasMango
          || !board[row + 1][col].hasBanana && !board[row + 1][col].hasMango;
        
        if (!notFilled) {
          const isEquals = board[row][col].hasBanana == board[row + 1][col].hasBanana
            && board[row][col].hasMango == board[row + 1][col].hasMango;

          if (isEquals != board[row][col].hasBottom.isEquals) {
            valid = false;
            message = `Invalid evaluation at the bottom of (${col + 1}, ${row + 1})`;
            break;
          }
        }
      }

      if (!board[row][col].hasBanana && !board[row][col].hasMango) {
        filled = false;
      }

    }
  }

  if (filled && valid) {
    message = "Congratulations! You have solved the puzzle!";
    completed = true;
  }

  return {valid, message, completed};
};

