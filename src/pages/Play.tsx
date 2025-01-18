import { useEffect, useState, useRef, useCallback } from "react";
import MangoGame from "@components/games/mango/MangoGame";
import Navbar from "@components/ui/Navbar";
import "@components/games/Games.scss";
import { getGameBoard } from "@components/games/gameUtils";
import { useNavigate, useParams } from "react-router-dom";
import { GameState, MangoBoard } from "@utils/types";
import useAuth from "@firebase/useAuth";
import useFirestore from "@firebase/useFirestore";

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
  
  const [gameObject, setGameObject] = useState<MangoBoard | null>(null);

  const { user } = useAuth();
  const { addPlayerScoreToGame } = useFirestore();

  const fetchGame = async (ref: string) => {
    const game = await getGameBoard(type, ref);
    if (!game) {
      console.warn("Game not found");
      return;
    }

    setGameObject(game.board);

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
    } else{
      console.warn(user, ref);
    }
  }, [user, ref]);

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
    const noRefresh = (!ref || (hasFetched.current && !(prevRef.current != "new" && ref == "new")));
    prevRef.current = ref || null;
    if (noRefresh) return;

    hasFetched.current = true;
    fetchGame(ref);
  }, [ref, navigate, hasFetched, type]);

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
      {type === "mango" && <MangoGame board={gameObject} gameState={gameState} puzzleComplete={puzzleComplete} startPuzzle={startPuzzle}/>}
    </div>
  );
};

export default Play;