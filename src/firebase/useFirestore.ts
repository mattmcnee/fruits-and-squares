import app from "./config";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import SHA1 from "crypto-js/sha1";
import { MangoBoard } from "@utils/types";

export const useFirestore = () => {
  const db = getFirestore(app);

  const saveGameObject = async (type: string, board: MangoBoard) => {
    const boardString = JSON.stringify(board);
    const boardHash = SHA1(boardString).toString();

    // Check if the document already exists
    const docRef = doc(db, type, boardHash);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { isNew: false, ref: boardHash };
    }

    const newDoc = { board: boardString, players: [] }
    await setDoc(docRef, newDoc);
    return { isNew: true, ref: boardHash};
  };

  const getGameObject = async (type: string, boardHash: string) => {
    const docRef = doc(db, type, boardHash);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return { ...data, board: JSON.parse(data.board), ref: boardHash };
    }

    return null;
  }

  const addPlayerScoreToGame = async (type: string, boardHash: string, time: number, uid: string) => {
    const docRef = doc(db, type, boardHash);
    const docSnap = await getDoc(docRef);

    const userData = {
      uid,
      time,
    }

    if (docSnap.exists()) {
      const data = docSnap.data();
      const players = data.players || [];
      let totalPlayers = data.totalPlayers || 0;

      // Check if the player already exists
      const playerExists = players.some((player: { uid: string }) => player.uid === uid);
      if (!playerExists) {
        players.push(userData);
        totalPlayers += 1;
        await setDoc(docRef, { ...data, players, totalPlayers });
      } else {
        console.warn("User has already logged a time for this game");
      }
    }
  };

  return { saveGameObject, getGameObject, addPlayerScoreToGame };
};

export default useFirestore;
