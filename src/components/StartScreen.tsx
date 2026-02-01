type StartScreenProps = {
  onStart: () => void;
};

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="bg-gray-800 p-8 rounded-lg max-w-md text-center">
      <h2 className="text-2xl font-bold text-white mb-4">How to Play</h2>

      <div className="text-left space-y-4 mb-6">
        <p className="text-gray-300">
          <span className="text-blue-400 font-medium">Rotatetris</span> is Tetris with a twist:
          the entire board can rotate!
        </p>

        <div className="space-y-2">
          <h3 className="text-white font-medium">Objective</h3>
          <p className="text-gray-400 text-sm">
            Place pieces on the 10x10 grid and clear lines (horizontally OR vertically) to score points.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-white font-medium">The Twist</h3>
          <p className="text-gray-400 text-sm">
            Rotate the board 90 degrees left (Q) or right (E). After rotation, all pieces
            fall due to gravity. Use this to your advantage!
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-white font-medium">Scoring</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>1 line = 10 points</li>
            <li>2 lines = 20 points</li>
            <li>3 lines = 50 points</li>
            <li>4 lines = 100 points</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-white font-medium">Game Over</h3>
          <p className="text-gray-400 text-sm">
            The game ends when no valid placement exists, even after trying board rotations.
          </p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-lg transition-colors"
      >
        Start Game
      </button>
    </div>
  );
}
