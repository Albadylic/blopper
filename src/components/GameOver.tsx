type GameOverProps = {
  score: number;
  linesCleared: number;
  onRestart: () => void;
};

export function GameOver({ score, linesCleared, onRestart }: GameOverProps) {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded">
      <div className="bg-gray-800 p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Game Over</h2>
        <div className="space-y-2 mb-6">
          <p className="text-gray-300">
            Final Score: <span className="text-white font-bold text-xl">{score}</span>
          </p>
          <p className="text-gray-300">
            Lines Cleared: <span className="text-white font-bold">{linesCleared}</span>
          </p>
        </div>
        <button
          onClick={onRestart}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
        >
          Play Again (N)
        </button>
      </div>
    </div>
  );
}
