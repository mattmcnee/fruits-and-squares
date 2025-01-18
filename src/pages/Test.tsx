import useFirestore from "@firebase/useFirestore";
import { useState, useEffect } from "react";

const Test = () => {
  const { getNextOldestGame, getNextGameForUser } = useFirestore();
  
  const [gameData, setGameData] = useState<any | null>(null);

  useEffect(() => {
    getNextGameForUser("mango", "fIr3kVTu2L").then(data => setGameData(data));
  }, []);

  return (
    <div>
      <h1>Test</h1>
      {gameData && <pre>{JSON.stringify(gameData, null, 2)}</pre>}
    </div>
  );
}

export default Test;