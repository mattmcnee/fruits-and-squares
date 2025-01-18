import app from "./config";
import { doc, setDoc, getFirestore, getDoc, serverTimestamp, collection, query, orderBy, limit, getDocs, startAfter, runTransaction } from "firebase/firestore";
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

    const index = await incrementDocumentCount(type);

    const newDoc = { board: boardString, players: [], createdAt: serverTimestamp(), index };
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

  const getNextGameForUser = async (type: string, uid: string) => {
    // Get the user's document reference
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.warn("User document does not exist");
      return null;
    }

    // Get the user's last game type and reference
    const userData = userDocSnap.data();
    const lastGameRef = userData.previous?.[type];
    let nextGame;

    if (lastGameRef) {
      console.log(`User's last game reference: ${lastGameRef}`);
      nextGame = await getNextOldestGame(type, lastGameRef);
    } else {
      console.warn("User has no last game reference");
      nextGame =  await getNextOldestGame(type);
    }

    // Update the user's last game reference
    if (nextGame) {
      await setDoc(userDocRef, { ...userData, previous: { ...userData.previous, [type]: nextGame.ref } });
    }

    return nextGame;
  }

  const addPlayerScoreToGame = async (type: string, boardHash: string, time: number, uid: string) => {
    const docRef = doc(db, type, boardHash);
    const docSnap = await getDoc(docRef);

    const userData = {
      time,
    }

    if (docSnap.exists()) {
      const data = docSnap.data();
      const players = data.players || {};
      let totalPlayers = data.totalPlayers || 0;

      // Check if the player already exists
      if (!players[uid]) {
        players[uid] = userData;
        totalPlayers += 1;
        await setDoc(docRef, { ...data, players, totalPlayers });
      } else {
        console.warn("User has already logged a time for this game");
      }
    }
  };

  const getNextOldestGame = async (type: string, ref?: string) => {
    const gamesRef = collection(db, type);
    let q;

    if (ref) {
      const docRef = doc(db, type, ref);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.warn("Document does not exist");
        return null;
      }
      q = query(gamesRef, orderBy("createdAt", "asc"), limit(1), startAfter(docSnap));
    } else {
      q = query(gamesRef, orderBy("createdAt", "asc"), limit(1));
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("No more games found");
      return null;
    }

    const nextOldestGame = querySnapshot.docs[0];
    return { ...nextOldestGame.data(), ref: nextOldestGame.id };
  }


  const incrementDocumentCount = async (type: string): Promise<number> => {
    if (type !== 'mango' && type !== 'beans') {
      console.error('Invalid type. Type must be either "mango" or "beans".');
      throw new Error('Invalid type');
    }
  
    const countRef = doc(db, 'counts', type);
    
    try {
      let newTotal = 0;
      await runTransaction(db, async (transaction) => {
        const countDoc = await transaction.get(countRef);
        
        if (!countDoc.exists()) {
          newTotal = 1;
          transaction.set(countRef, { total: newTotal });
        } else {
          const currentTotal = countDoc.data().total || 0;
          newTotal = currentTotal + 1;
          transaction.update(countRef, { total: newTotal });
        }
      });
      
      console.log(`${type} count incremented successfully to ${newTotal}`);
      return newTotal;
    } catch (error) {
      console.error('Error updating document count:', error);
      return -1;
    }
  };

  return { saveGameObject, getGameObject, addPlayerScoreToGame, getNextOldestGame, getNextGameForUser };
};

export default useFirestore;
