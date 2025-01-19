import { useEffect, useState, useRef, useCallback } from "react";
import MangoGame from "@components/games/mango/MangoGame";
import Navbar from "@components/ui/Navbar";
import "@components/games/Games.scss";
import { getGameBoard, createEmptyGameBoard } from "@components/games/gameUtils";
import { useNavigate, useParams } from "react-router-dom";
import { GameState, MangoDoc } from "@utils/types";
import useAuth from "@firebase/useAuth";
import useFirestore from "@firebase/useFirestore";
import { User } from "firebase/auth";

interface PlayProps {
  type: string;
}

const Play = ({ type }: PlayProps) => {
  const { ref } = useParams();
  const hasFetched = useRef(false);
  const prevRef = useRef<string | null>(null);

  const navigate = useNavigate();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    timer: 0,
    playing: false,
    completed: false,
  });

  const gameList = ["beans", "mango"];
  
  const [gameObject, setGameObject] = useState<MangoDoc>({
    board: createEmptyGameBoard(type),
    players: [],
    createdAt: new Date(),
    index: 0,
  });

  const { user, loading } = useAuth();
  const { addPlayerScoreToGame, updateUserLastGame } = useFirestore();

  const fetchGame = async (ref: string, user: User | null) => {
    if (ref === "unsaved"){
      navigate(`/${type}/new`, { replace: true });
      return;
    } 

    const game = await getGameBoard(type, ref, user);
    if (!game) {
      console.warn("Game not found");
      return;
    }

    console.log("Game fetched:", game); 

    setGameObject(game);

    if (ref === "new") {
      navigate(`/${type}/${game.ref}`, { replace: true });
    }

    // Reset and start the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setGameState({
      timer: 0,
      playing: false,
      completed: false,
    });
  }

  const startPuzzle = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current as NodeJS.Timeout);
    }
    setGameState({
      timer: 0,
      playing: true,
      completed: false,
    });

    timerRef.current = setInterval(() => {
      setGameState(prev => ({ ...prev, timer: prev.timer + 1 }));
    }, 1000);
  };

  const puzzleComplete = useCallback(() => {
    clearInterval(timerRef.current as NodeJS.Timeout);
    setGameState(prev => ({
      ...prev,
      playing: false,
      completed: true,
    }));

    if (user && ref) {
      addPlayerScoreToGame(type, ref, gameState.timer, user.uid);
      updateUserLastGame(type, user.uid, ref);
    } else{
      console.warn(user, ref);
    }
  }, [user, ref, gameState]);

  // Set the grid size based on the window size
  useEffect(() => {
    const handleResize = () => {
      const scale = Math.min(Math.min(window.innerWidth, window.innerHeight - 190) - 60, 800);
      document.documentElement.style.setProperty("--grid-size", `${scale}px`);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Only refresh if ref is not null, and it's the first render or the ref has changed to "new"
    if (!ref || loading) return;
    const noRefresh = (hasFetched.current && !(prevRef.current != "new" && ref == "new"));
    prevRef.current = ref;
    if (noRefresh) return;

    hasFetched.current = true;
    fetchGame(ref, user);
  }, [ref, navigate, hasFetched, type, loading, user]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (!gameList.includes(type)) {
    return <h1>Game not found</h1>;
  }

  return (
    <div className='game-page'>
      <Navbar />
      {/* <button onClick={() => puzzleComplete()} className="back-button">Hello</button> */}
      {type === "mango" && <MangoGame 
        board={gameObject.board} 
        index={gameObject.index}
        gameState={gameState} 
        puzzleComplete={puzzleComplete} 
        startPuzzle={startPuzzle}
      />}
    </div>
  );
};

export default Play;