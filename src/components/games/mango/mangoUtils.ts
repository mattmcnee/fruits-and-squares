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

export const generateMangoBoard = () => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    let board = tryGenerateBoard();
    if (board) {
      return board;
    } 
    attempts++;
  }



  return false;
};

