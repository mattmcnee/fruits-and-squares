import { generateMangoBoard, createEmptyBoard } from "@components/games/mango/mangoUtils";
import { MangoBoard, MangoDoc } from "@utils/types";
import { useFirestore } from "@firebase/useFirestore";
import { User } from "firebase/auth";


export const generateNewGameBoard = async (type: string, save = true): Promise<MangoDoc | null> => {
  const { saveGameObject } = useFirestore();
  let board: MangoBoard | null = null;

  if (type === "mango") {
    board = generateMangoBoard();
  } else {
    board = null;
  }

  if (!board) {
    console.error("Failed to generate new game board");
    return null;
  }

  if (!save) {
    return { ref: "unsaved", board } as MangoDoc;
  }

  const doc = await saveGameObject(type, board);

  return doc as MangoDoc;
};

export const getGameBoard = async (type: string, ref: string, user: User | null) => {
  const { getGameObject, getNextGameForUser } = useFirestore();
  if (ref === "new") {
    if (!user) {
      const game = await generateNewGameBoard(type, false);
      console.log("Generated game without saving:", game);
      return game;
    } else {
      // This will create a game using generateNewGameBoard if:
      // the user's previous game reference is the most recent game created
      const game = await getNextGameForUser(type, user.uid);
      console.log("Retrieved game or generated and saved:", game);
      return game;

    }

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

export const createEmptyGameBoard = (type: string) => {
  if (type !== "mango") console.warn ("Invalid game type");
  return createEmptyBoard();
}


