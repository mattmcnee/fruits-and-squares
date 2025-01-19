import app from "./config";
import { doc, setDoc, getFirestore, getDoc, serverTimestamp, collection, query, orderBy, limit, getDocs, startAfter, runTransaction } from "firebase/firestore";
import SHA1 from "crypto-js/sha1";
import { GameDoc, GameBoard } from "@utils/types";
import { generateNewGameBoard } from "@components/games/gameUtils";

export const useFirestore = () => {
  const db = getFirestore(app);

  const saveGameObject = async (type: string, board: GameBoard) => {
    const boardString = JSON.stringify(board);
    const boardHash = SHA1(boardString).toString();

    // Check if the document already exists
    const docRef = doc(db, type, boardHash);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      return { 
        isNew: false, 
        ref: boardHash, 
        board: JSON.parse(data.board), 
        players: data.players, 
        createdAt: data.createdAt, 
        index: data.index 
      } as GameDoc;
    }

    const index = await incrementDocumentCount(type);

    const newDoc = { board: boardString, players: [], createdAt: serverTimestamp(), index };
    await setDoc(docRef, newDoc);

    return { isNew: true, ref: boardHash, doc: newDoc};
  };

  const getGameObject = async (type: string, boardHash: string) => {
    const docRef = doc(db, type, boardHash);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      return { 
        board: JSON.parse(data.board), 
        ref: boardHash, 
        players: data.players, 
        createdAt: data.createdAt, 
        index: data.index 
      } as GameDoc;
    }

    return null;
  };

  const getNextGameForUser = async (type: string, uid: string) => {
    // Get the user's document reference
    const userDocRef = doc(db, "users", uid);
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
    // if (nextGame) {
    //   await setDoc(userDocRef, { ...userData, previous: { ...userData.previous, [type]: nextGame.ref } });
    // }

    return nextGame;
  };

  const updateUserLastGame = async (type: string, uid: string, ref: string) => {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.warn("User document does not exist");
      
      return;
    }

    const userData = userDocSnap.data();
    await setDoc(userDocRef, { ...userData, previous: { ...userData.previous, [type]: ref } });
  };

  const addPlayerScoreToGame = async (type: string, boardHash: string, time: number, uid: string) => {
    const docRef = doc(db, type, boardHash);
    const docSnap = await getDoc(docRef);

    const userData = {
      uid,
      time,
      playedAt: new Date(),
    };

    if (docSnap.exists()) {
      const data = docSnap.data();
      const players = data.players || [];
      const playerExists = players.some((player: { uid: string }) => player.uid === uid);

      if (!playerExists) {
        players.push(userData);
        await setDoc(docRef, { ...data, players });
      } else {
        console.warn("User has already logged a time for this game");
      }
    }
  };

  const getNextOldestGame = async (type: string, ref?: string): Promise<GameDoc | null> => {
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
      const newGame = await generateNewGameBoard(type);
      if (!newGame) {
        console.error("Failed to generate new game board");
        
        return null;
      }
      const doc = await saveGameObject(type, newGame.board);
      
      return doc as GameDoc;
    }

    const nextOldestGame = querySnapshot.docs[0];
    const data = nextOldestGame.data();
    
    return { 
      board: JSON.parse(data.board), 
      ref: nextOldestGame.id, 
      players: data.players, 
      createdAt: data.createdAt, 
      index: data.index 
    } as GameDoc;
  };


  const incrementDocumentCount = async (type: string): Promise<number> => {
    if (type !== "mango" && type !== "beans") {
      console.error("Invalid type. Type must be either \"mango\" or \"beans\".");
      throw new Error("Invalid type");
    }
  
    const countRef = doc(db, "counts", type);
    
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
      console.error("Error updating document count:", error);
      
      return -1;
    }
  };

  return { saveGameObject, getGameObject, addPlayerScoreToGame, getNextOldestGame, getNextGameForUser, updateUserLastGame };
};

export default useFirestore;
