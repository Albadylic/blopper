import { useState } from "react";
import "./App.css";

type StartScreenProps = {
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
};

type GameBoardProps = {
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
};

const GameBoard: React.FC<GameBoardProps> = ({ setGameStarted }) => {
  const [currentTetromino, setCurrentTetromino] = useState("1111");

  return (
    <div>
      <div id="new-tetromino" className="flex justify-center">
        <p>{currentTetromino}</p>
      </div>
      <div id="controls" className="flex justify-around">
        <p className="p-6">left</p>
        <p className="p-6">down</p>
        <p className="p-6">right</p>
      </div>
      <div id="play-grid" className="grid grid-rows-10 grid-cols-10">
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
        <p>0</p>
      </div>
    </div>
  );
};

const StartScreen: React.FC<StartScreenProps> = ({ setGameStarted }) => {
  return (
    <div>
      <p>
        Rotate the board. Place a tetramino. Clear lines to score points. Can't
        place the tetramino and you lose.
      </p>
      <button onClick={() => setGameStarted(true)}>Play</button>
    </div>
  );
};

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-between w-screen m-2">
        <header className="flex flex-col items-center">
          <h1 className="text-4xl">Rotatetris</h1>
          <nav className="flex justify-around">
            <p className="p-2 cursor-pointer">Restart</p>
            <p className="p-2 cursor-pointer">Instructions</p>
            <p className="p-2 cursor-pointer">High Scores</p>
          </nav>
        </header>
        <div className="p-8">
          {gameStarted ? (
            <GameBoard setGameStarted={setGameStarted} />
          ) : (
            <StartScreen setGameStarted={setGameStarted} />
          )}
        </div>

        <footer>
          <p>
            Built by <a href="https://github.com/Albadylic">Albadylic</a>
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
