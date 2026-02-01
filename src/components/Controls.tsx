export function Controls() {
  const controls = [
    { keys: ['↑', '↓', '←', '→'], action: 'Move piece' },
    { keys: ['R'], action: 'Rotate piece' },
    { keys: ['Q'], action: 'Rotate board left' },
    { keys: ['E'], action: 'Rotate board right' },
    { keys: ['Space'], action: 'Place piece' },
    { keys: ['N'], action: 'New game (when game over)' },
  ];

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="text-sm text-gray-400 mb-2">Controls</h3>
      <div className="space-y-2">
        {controls.map(({ keys, action }) => (
          <div key={action} className="flex items-center gap-2 text-xs">
            <div className="flex gap-1">
              {keys.map((key) => (
                <kbd
                  key={key}
                  className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-300 font-mono min-w-[24px] text-center"
                >
                  {key}
                </kbd>
              ))}
            </div>
            <span className="text-gray-400">{action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
