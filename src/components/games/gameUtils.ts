import { generateMangoBoard } from "@components/games/mango/mangoUtils";
import { MangoBoard } from "@utils/types";
import { useFirestore } from "@firebase/useFirestore";


export const generateNewGameBoard = async (type: string) => {
  const { saveGameObject } = useFirestore();
  let board: MangoBoard | null = null;

  if (type === "mango") {
    board = generateMangoBoard();
  } else {
    board = null;
  }

  if (!board) {
    console.error("Failed to generate new game board");
    return;
  }

  const { ref } = await saveGameObject(type, board);

  return { ref, board };
};

export const getGameBoard = async (type: string, ref: string) => {
  const { getGameObject } = useFirestore();
  if (ref === "new") {
    const game = await generateNewGameBoard(type);
    console.log("Generated new game:", game);
    return game;
  } else {
    const game = await getGameObject(type, ref);
    console.log("Retrieved game:", game);
    return game;
  }
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
};
