/**
 * N-Queens Algorithm Implementation
 * 
 * The N-Queens problem is a classic backtracking algorithm that places N queens
 * on an N×N chessboard such that no two queens attack each other.
 * 
 * Algorithm Steps:
 * 1. Start with the first row
 * 2. For each column in the current row, try placing a queen
 * 3. Check if the placement is safe (no conflicts with existing queens)
 * 4. If safe, place the queen and recursively solve for the next row
 * 5. If no safe position exists, backtrack to the previous row
 * 6. Continue until all queens are placed or no solution exists
 */

/**
 * Check if placing a queen at (row, col) is safe
 * @param {number[][]} board - Current board state
 * @param {number} row - Row to place queen
 * @param {number} col - Column to place queen
 * @param {number} n - Board size
 * @returns {boolean} - True if placement is safe
 */
export function isSafe(board, row, col, n) {
  // Check column for existing queens
  for (let i = 0; i < row; i++) {
    if (board[i][col] === 1) {
      return false;
    }
  }

  // Check upper diagonal on left side
  for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] === 1) {
      return false;
    }
  }

  // Check upper diagonal on right side
  for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
    if (board[i][j] === 1) {
      return false;
    }
  }

  return true;
}

/**
 * Get all cells that would be attacked by a queen at (row, col)
 * @param {number} row - Queen's row
 * @param {number} col - Queen's column
 * @param {number} n - Board size
 * @returns {Array} - Array of attacked positions
 */
export function getAttackedCells(row, col, n) {
  const attacked = [];

  // Add all cells in the same row
  for (let j = 0; j < n; j++) {
    if (j !== col) {
      attacked.push([row, j]);
    }
  }

  // Add all cells in the same column
  for (let i = 0; i < n; i++) {
    if (i !== row) {
      attacked.push([i, col]);
    }
  }

  // Add all cells in diagonals
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== row && j !== col) {
        // Check if on diagonal
        if (Math.abs(i - row) === Math.abs(j - col)) {
          attacked.push([i, j]);
        }
      }
    }
  }

  return attacked;
}

/**
 * Solve N-Queens problem with step-by-step visualization
 * @param {number} n - Board size
 * @param {Function} onStep - Callback for each step
 * @returns {Promise<boolean>} - True if solution found
 */
export async function solveNQueens(n, onStep) {
  const board = Array(n).fill().map(() => Array(n).fill(0));
  const steps = [];

  /**
   * Recursive backtracking function
   * @param {number} row - Current row to place queen
   * @returns {boolean} - True if solution found
   */
  async function solve(row) {
    // Base case: all queens placed
    if (row >= n) {
      steps.push({
        type: 'solution',
        board: board.map(row => [...row]),
        message: `Solution found! All ${n} queens placed successfully.`
      });
      return true;
    }

    // Try placing queen in each column of current row
    for (let col = 0; col < n; col++) {
      steps.push({
        type: 'trying',
        board: board.map(row => [...row]),
        row,
        col,
        message: `Trying to place queen at position (${row + 1}, ${col + 1})`
      });

      if (isSafe(board, row, col, n)) {
        // Place queen
        board[row][col] = 1;
        const attackedCells = getAttackedCells(row, col, n);

        steps.push({
          type: 'placed',
          board: board.map(row => [...row]),
          row,
          col,
          attackedCells,
          message: `Queen placed at (${row + 1}, ${col + 1}). Checking next row...`
        });

        // Recursively place queens in remaining rows
        if (await solve(row + 1)) {
          return true;
        }

        // Backtrack: remove queen
        board[row][col] = 0;
        steps.push({
          type: 'backtrack',
          board: board.map(row => [...row]),
          row,
          col,
          message: `Backtracking: Removing queen from (${row + 1}, ${col + 1})`
        });
      } else {
        steps.push({
          type: 'conflict',
          board: board.map(row => [...row]),
          row,
          col,
          message: `Conflict detected at (${row + 1}, ${col + 1}). Trying next position...`
        });
      }
    }

    return false;
  }

  // Start solving
  const solutionExists = await solve(0);

  if (!solutionExists) {
    steps.push({
      type: 'no_solution',
      board: board.map(row => [...row]),
      message: `No solution exists for ${n}-Queens problem.`
    });
  }

  // Play back steps with visualization
  for (let i = 0; i < steps.length; i++) {
    try {
      await onStep(steps[i], i, steps.length);
      await new Promise(resolve => setTimeout(resolve, 800)); // Delay for visualization
    } catch (error) {
      if (error.message === 'Algorithm stopped') {
        break;
      }
      throw error;
    }
  }

  return solutionExists;
}

/**
 * Generate all solutions for N-Queens problem
 * @param {number} n - Board size
 * @returns {Array} - Array of all solutions
 */
export function getAllSolutions(n) {
  const solutions = [];
  const board = Array(n).fill().map(() => Array(n).fill(0));

  function solve(row) {
    if (row >= n) {
      solutions.push(board.map(row => [...row]));
      return;
    }

    for (let col = 0; col < n; col++) {
      if (isSafe(board, row, col, n)) {
        board[row][col] = 1;
        solve(row + 1);
        board[row][col] = 0;
      }
    }
  }

  solve(0);
  return solutions;
}
