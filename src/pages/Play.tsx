import { useEffect, useState, useRef } from 'react';
import MangoGame from '@components/games/mango/MangoGame';
import Navbar from '@components/ui/Navbar'
import '@components/games/Games.scss'
import { generateNewGameBoard, formatTimer } from '@components/games/gameUtils';
import { useNavigate, useParams } from 'react-router-dom';
import { MangoBoard } from '@utils/types';

interface PlayProps {
  type: string;
}

const Play = ({ type }: PlayProps) => {
  const { ref } = useParams();
  const hasFetched = useRef(false);

  const navigate = useNavigate();

  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const gameList = ["beans", "mango"];
  
  const [gameObject, setGameObject] = useState<MangoBoard | null>(null);

  const fetchGame = async (): Promise<void> => {
    const game = await generateNewGameBoard(type);
    if (!game) {
      console.warn("Game not found");
      return;
    }

    setGameObject(game.board);
    setPlaying(false);
    setCompleted(false);

    // Reset and start the timer
    if (timerRef.current) {
      clearInterval(timerRef.current as NodeJS.Timeout);
    }
    setTimer(0);
  };

  const startPuzzle = () => {
    setPlaying(true);

    if (timerRef.current) {
      clearInterval(timerRef.current as NodeJS.Timeout);
    }
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  }

  const puzzleComplete = () => {

    clearInterval(timerRef.current as NodeJS.Timeout);
    setCompleted(true);
    setPlaying(false);
  }

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    fetchGame();
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
    <div>
      <Navbar />
      {type === "mango" && <MangoGame board={gameObject} playing={playing} completed={completed} timer={formatTimer(timer)} puzzleComplete={puzzleComplete} startPuzzle={startPuzzle}/>}
    </div>
  );
};

export default Play;