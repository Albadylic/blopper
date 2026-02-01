type ScoreDisplayProps = {
  score: number;
  linesCleared: number;
};

export function ScoreDisplay({ score, linesCleared }: ScoreDisplayProps) {
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="text-sm text-gray-400 mb-2">Score</h3>
      <p className="text-3xl font-bold text-white">{score}</p>
      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-sm text-gray-400">Lines</p>
        <p className="text-xl text-white">{linesCleared}</p>
      </div>
    </div>
  );
}
