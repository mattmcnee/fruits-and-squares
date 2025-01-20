import { generateMangoBoard, createEmptyMangoBoard } from "@components/games/mango/mangoUtils";
import { generateBeansBoard, createEmptyBeansBoard } from "@components/games/beans/beansUtils";
import { GameBoard, GameDoc, GameScore } from "@utils/types";
import { useFirestore } from "@firebase/useFirestore";
import { User } from "firebase/auth";


export const generateNewGameBoard = async (type: string, save = true): Promise<GameDoc | null> => {
  const { saveGameObject } = useFirestore();
  let board: GameBoard | null = null;

  if (type === "mango") {
    board = generateMangoBoard();
  } else if (type === "beans") {
    board = generateBeansBoard();
  } else{
    console.warn("Invalid game type in generateNewGameBoard, returning null");
    board = null;
  }

  if (!board) {
    console.error("Failed to generate new game board");
    
    return null;
  }

  if (!save) {
    return { ref: "unsaved", board } as GameDoc;
  }

  const doc = await saveGameObject(type, board);

  return doc as GameDoc;
};

export const getGameBoard = async (type: string, ref: string, user: User | null) => {
  const { getGameObject, getNextGameForUser } = useFirestore();
  if (ref === "new") {
    if (!user) {
      const game = await generateNewGameBoard(type, false);
      
      return game;
    } else {
      // This will create a game using generateNewGameBoard if:
      // the user's previous game reference is the most recent game created
      const game = await getNextGameForUser(type, user.uid);
      
      return game;

    }

  } else {
    const game = await getGameObject(type, ref);

    return game;
  }
};

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
  if (type == "mango") return createEmptyMangoBoard();
  if (type == "beans") return createEmptyBeansBoard();
    
  console.warn ("Invalid game type, creating empty mango board");
  
  return createEmptyMangoBoard();
};

export const generatePerformanceGraph = (userId: string, scoresData: GameScore[]) => {

  const MAX_GRAPH_TIME = 300; // 5 minutes
  const RESOLUTION = 24;

  const times = scoresData.map(item => item.time);
  const minTime = Math.min(...times);
  let maxTime = Math.min(Math.max(...times), MAX_GRAPH_TIME); // Cap maxTime to 5 minutes (300 seconds)

  // Display a maximum of 5 minutes on the graph
  if (maxTime - minTime < RESOLUTION) {
    maxTime = minTime + RESOLUTION;
  }

  const interval = (maxTime - minTime) / RESOLUTION;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const labels = Array.from({ length: RESOLUTION }, (_, i) => formatTime(Math.round(minTime + i * interval)));

  const totalDataCount = scoresData.length;
  const dataCounts = Array(RESOLUTION).fill(0);
  const userBarIndex = new Set<number>();
  let userTime = 0;

  scoresData.forEach(item => {
    let index;
    if (item.time >= MAX_GRAPH_TIME) {
      index = RESOLUTION - 1;
    } else {
      index = Math.min(Math.floor((item.time - minTime) / interval), RESOLUTION - 1);
    }
    dataCounts[index]++;
    if (item.uid === userId) {
      userBarIndex.add(index);
      userTime = item.time;
    }
  });

  const percentageDataCounts = dataCounts.map(count => (count / totalDataCount) * 100);
  const userPercentage = (scoresData.filter(item => item.time < userTime).length / totalDataCount) * 100;
  const userRoundedPercentage = Math.max(Math.round(userPercentage / 5) * 5, 5); // Round to nearest 5, with a minimum of 5

  let userPerformance = `You are in the top ${userRoundedPercentage}% of players`;

  const graphData = {
    labels,
    datasets: [
      {
        label: "Time Intervals",
        data: percentageDataCounts,
        backgroundColor: percentageDataCounts.map((_, index) =>
          userBarIndex.has(index) ? "rgba(54, 162, 235, 1)" : "rgba(255, 99, 132, 1)"
        ),
        borderRadius: 12,
        order: 1,
      },
    ],
  };

  if (scoresData.length === 1) {
    userPerformance = "You are the first to play this game";
  }

  return { graphData, userPerformance };
};


