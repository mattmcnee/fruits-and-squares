import { GameBoard, MangoBoard, MangoCell, BeansCell, BeansBoard } from "./types";

export const isMangoCell = (cell: any): cell is MangoCell => {
  return (
    cell &&
    ["hasBanana", "hasMango", "isFixed"].every(key => typeof cell[key] === "boolean") &&
    ["hasRight", "hasBottom"].every(
      key => typeof cell[key] === "object" && ["exists", "isEquals"].every(subKey => typeof cell[key][subKey] === "boolean")
    )
  );
};

export const isMangoBoard = (board: GameBoard): board is MangoBoard => {
  if (!Array.isArray(board)) return false;

  for (const row of board) {
    if (!Array.isArray(row)) return false;

    for (const cell of row) {
      if (!isMangoCell(cell)) return false;
    }
  }

  return true;
};

export const isBeansCell = (cell: any): cell is BeansCell => {
  return (
    cell &&
    typeof cell.color === "string" &&
    ["hasCross", "hasBean"].every(key => typeof cell[key] === "boolean" || cell[key] === null)
  );
}

export const isBeansBoard = (board: GameBoard): board is BeansBoard => {
  if (!Array.isArray(board)) return false;

  for (const row of board) {
    if (!Array.isArray(row)) return false;

    for (const cell of row) {
      if (!isBeansCell(cell)) return false;
    }
  }

  return true;
};
