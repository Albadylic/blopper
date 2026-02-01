import type { Tetromino, ScoreMap } from '../types/game';

// Standard Tetris tetrominos with all 4 rotation variants
// Each shape is a 2D boolean array where true = filled cell

export const TETROMINOS: Tetromino[] = [
  // I piece (cyan)
  {
    name: 'I',
    color: '#00f0f0',
    shapes: [
      // Rotation 0 (horizontal)
      [
        [true, true, true, true],
      ],
      // Rotation 1 (vertical)
      [
        [true],
        [true],
        [true],
        [true],
      ],
      // Rotation 2 (horizontal)
      [
        [true, true, true, true],
      ],
      // Rotation 3 (vertical)
      [
        [true],
        [true],
        [true],
        [true],
      ],
    ],
  },
  // O piece (yellow) - same in all rotations
  {
    name: 'O',
    color: '#f0f000',
    shapes: [
      [
        [true, true],
        [true, true],
      ],
      [
        [true, true],
        [true, true],
      ],
      [
        [true, true],
        [true, true],
      ],
      [
        [true, true],
        [true, true],
      ],
    ],
  },
  // T piece (purple)
  {
    name: 'T',
    color: '#a000f0',
    shapes: [
      // Rotation 0
      [
        [false, true, false],
        [true, true, true],
      ],
      // Rotation 1
      [
        [true, false],
        [true, true],
        [true, false],
      ],
      // Rotation 2
      [
        [true, true, true],
        [false, true, false],
      ],
      // Rotation 3
      [
        [false, true],
        [true, true],
        [false, true],
      ],
    ],
  },
  // S piece (green)
  {
    name: 'S',
    color: '#00f000',
    shapes: [
      // Rotation 0
      [
        [false, true, true],
        [true, true, false],
      ],
      // Rotation 1
      [
        [true, false],
        [true, true],
        [false, true],
      ],
      // Rotation 2
      [
        [false, true, true],
        [true, true, false],
      ],
      // Rotation 3
      [
        [true, false],
        [true, true],
        [false, true],
      ],
    ],
  },
  // Z piece (red)
  {
    name: 'Z',
    color: '#f00000',
    shapes: [
      // Rotation 0
      [
        [true, true, false],
        [false, true, true],
      ],
      // Rotation 1
      [
        [false, true],
        [true, true],
        [true, false],
      ],
      // Rotation 2
      [
        [true, true, false],
        [false, true, true],
      ],
      // Rotation 3
      [
        [false, true],
        [true, true],
        [true, false],
      ],
    ],
  },
  // J piece (blue)
  {
    name: 'J',
    color: '#0000f0',
    shapes: [
      // Rotation 0
      [
        [true, false, false],
        [true, true, true],
      ],
      // Rotation 1
      [
        [true, true],
        [true, false],
        [true, false],
      ],
      // Rotation 2
      [
        [true, true, true],
        [false, false, true],
      ],
      // Rotation 3
      [
        [false, true],
        [false, true],
        [true, true],
      ],
    ],
  },
  // L piece (orange)
  {
    name: 'L',
    color: '#f0a000',
    shapes: [
      // Rotation 0
      [
        [false, false, true],
        [true, true, true],
      ],
      // Rotation 1
      [
        [true, false],
        [true, false],
        [true, true],
      ],
      // Rotation 2
      [
        [true, true, true],
        [true, false, false],
      ],
      // Rotation 3
      [
        [true, true],
        [false, true],
        [false, true],
      ],
    ],
  },
];

// Grid size
export const GRID_SIZE = 10;

// Scoring: lines cleared -> points
export const SCORE_MAP: ScoreMap = {
  1: 10,
  2: 20,
  3: 50,
  4: 100,
};

// Get a random tetromino
export function getRandomTetromino(): Tetromino {
  const index = Math.floor(Math.random() * TETROMINOS.length);
  return TETROMINOS[index];
}
