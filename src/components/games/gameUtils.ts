import { generateMangoBoard } from '@components/games/mango/mangoUtils';
import { MangoBoard } from '@utils/types';


export const generateNewGameBoard = async (type: string) => {
  let board: MangoBoard | null = null;

  if (type === "mango") {
    const generatedBoard = generateMangoBoard();
    if (generatedBoard !== false) {
      board = generatedBoard;
    } else {
      return { board: null };
    }
  } else {
    return { board: null };
  }

  return { board };

}

export const formatTimer = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  if (hours > 0) {
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  } else {
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }
}
