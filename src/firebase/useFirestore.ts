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

  return { saveGameObject, getGameObject };
};

export default useFirestore;
