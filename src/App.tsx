import { useState } from "react";
import { StartScreen } from "./components/StartScreen";
import { GameBoard } from "./components/GameBoard";
import "./App.css";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center py-4">
      <header className="flex flex-col items-center mb-6">
        <h1 className="text-4xl font-bold text-white">Rotatetris</h1>
        <nav className="flex gap-4 mt-2">
          {gameStarted && (
            <button
              onClick={() => setGameStarted(false)}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Instructions
            </button>
          )}
        </nav>
      </header>

      <main className="flex-1 flex items-start justify-center">
        {gameStarted ? (
          <GameBoard />
        ) : (
          <StartScreen onStart={() => setGameStarted(true)} />
        )}
      </main>

      <footer className="mt-6 text-gray-500 text-sm">
        <p>
          Built by <a href="https://github.com/Albadylic" className="text-gray-400 hover:text-white">Albadylic</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
