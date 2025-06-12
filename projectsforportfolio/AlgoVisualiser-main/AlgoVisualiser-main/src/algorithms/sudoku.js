/**
 * Sudoku Solver Algorithm Implementation
 * 
 * The Sudoku solver uses backtracking to fill a 9×9 grid with digits 1-9
 * such that each row, column, and 3×3 subgrid contains all digits exactly once.
 * 
 * Algorithm Steps:
 * 1. Find an empty cell (containing 0)
 * 2. Try digits 1-9 in that cell
 * 3. Check if the digit is valid (no conflicts in row, column, or 3×3 box)
 * 4. If valid, place the digit and recursively solve the rest
 * 5. If no valid digit works, backtrack and try the next possibility
 * 6. Continue until the grid is completely filled
 */

/**
 * Check if placing a number at (row, col) is valid
 * @param {number[][]} grid - Current Sudoku grid
 * @param {number} row - Row index (0-8)
 * @param {number} col - Column index (0-8)
 * @param {number} num - Number to place (1-9)
 * @returns {boolean} - True if placement is valid
 */
export function isValidMove(grid, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) {
      return false;
    }
  }

  // Check 3×3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Find the next empty cell in the grid
 * @param {number[][]} grid - Current Sudoku grid
 * @returns {Array|null} - [row, col] of empty cell or null if none found
 */
export function findEmptyCell(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null;
}

/**
 * Get all cells that would be affected by placing a number
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {Array} - Array of affected cell positions
 */
export function getAffectedCells(row, col) {
  const affected = [];

  // Add all cells in the same row
  for (let j = 0; j < 9; j++) {
    if (j !== col) {
      affected.push([row, j]);
    }
  }

  // Add all cells in the same column
  for (let i = 0; i < 9; i++) {
    if (i !== row) {
      affected.push([i, col]);
    }
  }

  // Add all cells in the same 3×3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const boxRow = i + startRow;
      const boxCol = j + startCol;
      if (boxRow !== row && boxCol !== col) {
        affected.push([boxRow, boxCol]);
      }
    }
  }

  return affected;
}

/**
 * Solve Sudoku puzzle with step-by-step visualization
 * @param {number[][]} grid - Initial Sudoku grid
 * @param {Function} onStep - Callback for each step
 * @returns {Promise<boolean>} - True if solution found
 */
export async function solveSudoku(grid, onStep) {
  const steps = [];
  let stepCount = 0;

  /**
   * Recursive backtracking function
   * @param {number[][]} currentGrid - Current state of the grid
   * @returns {boolean} - True if solution found
   */
  async function solve(currentGrid) {
    const emptyCell = findEmptyCell(currentGrid);

    if (!emptyCell) {
      // No empty cells left - puzzle solved!
      steps.push({
        type: 'solution',
        grid: currentGrid.map(row => [...row]),
        message: 'Sudoku solved successfully!',
        step: ++stepCount
      });
      return true;
    }

    const [row, col] = emptyCell;
    const affectedCells = getAffectedCells(row, col);

    steps.push({
      type: 'trying_cell',
      grid: currentGrid.map(row => [...row]),
      row,
      col,
      affectedCells,
      message: `Trying to fill cell (${row + 1}, ${col + 1})`,
      step: ++stepCount
    });

    // Try numbers 1-9
    for (let num = 1; num <= 9; num++) {
      steps.push({
        type: 'trying_number',
        grid: currentGrid.map(row => [...row]),
        row,
        col,
        num,
        affectedCells,
        message: `Trying number ${num} at (${row + 1}, ${col + 1})`,
        step: ++stepCount
      });

      if (isValidMove(currentGrid, row, col, num)) {
        // Place the number
        currentGrid[row][col] = num;

        steps.push({
          type: 'placed',
          grid: currentGrid.map(row => [...row]),
          row,
          col,
          num,
          affectedCells,
          message: `Placed ${num} at (${row + 1}, ${col + 1})`,
          step: ++stepCount
        });

        // Recursively solve the rest
        if (await solve(currentGrid)) {
          return true;
        }

        // Backtrack: remove the number
        currentGrid[row][col] = 0;

        steps.push({
          type: 'backtrack',
          grid: currentGrid.map(row => [...row]),
          row,
          col,
          num,
          message: `Backtracking: Removing ${num} from (${row + 1}, ${col + 1})`,
          step: ++stepCount
        });
      } else {
        steps.push({
          type: 'invalid',
          grid: currentGrid.map(row => [...row]),
          row,
          col,
          num,
          affectedCells,
          message: `${num} is invalid at (${row + 1}, ${col + 1}) - conflicts detected`,
          step: ++stepCount
        });
      }
    }

    return false;
  }

  // Start solving
  const solutionExists = await solve(grid);

  if (!solutionExists) {
    steps.push({
      type: 'no_solution',
      grid: grid.map(row => [...row]),
      message: 'No solution exists for this Sudoku puzzle.',
      step: ++stepCount
    });
  }

  // Play back steps with visualization
  for (let i = 0; i < steps.length; i++) {
    try {
      await onStep(steps[i], i, steps.length);
      await new Promise(resolve => setTimeout(resolve, 300)); // Delay for visualization
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
 * Generate a valid Sudoku puzzle
 * @param {number} difficulty - Difficulty level (1-3, where 3 is hardest)
 * @returns {number[][]} - Generated Sudoku grid
 */
export function generateSudoku(difficulty = 2) {
  // Start with empty grid
  const grid = Array(9).fill().map(() => Array(9).fill(0));

  // Fill diagonal 3×3 boxes first (they don't affect each other)
  fillDiagonalBoxes(grid);

  // Fill remaining cells
  fillRemaining(grid, 0, 3);

  // Remove numbers based on difficulty
  const cellsToRemove = difficulty === 1 ? 40 : difficulty === 2 ? 50 : 60;
  removeNumbers(grid, cellsToRemove);

  return grid;
}

/**
 * Fill the diagonal 3×3 boxes
 * @param {number[][]} grid - Sudoku grid to fill
 */
function fillDiagonalBoxes(grid) {
  for (let i = 0; i < 9; i += 3) {
    fillBox(grid, i, i);
  }
}

/**
 * Fill a 3×3 box with random valid numbers
 * @param {number[][]} grid - Sudoku grid
 * @param {number} row - Starting row of the box
 * @param {number} col - Starting column of the box
 */
function fillBox(grid, row, col) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Shuffle numbers
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  let numIndex = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      grid[row + i][col + j] = numbers[numIndex++];
    }
  }
}

/**
 * Fill remaining cells using backtracking
 * @param {number[][]} grid - Sudoku grid
 * @param {number} i - Current row
 * @param {number} j - Current column
 * @returns {boolean} - True if successfully filled
 */
function fillRemaining(grid, i, j) {
  if (j >= 9 && i < 8) {
    i++;
    j = 0;
  }
  if (i >= 9 && j >= 9) {
    return true;
  }

  if (i < 3) {
    if (j < 3) {
      j = 3;
    }
  } else if (i < 6) {
    if (j === Math.floor(i / 3) * 3) {
      j += 3;
    }
  } else {
    if (j === 6) {
      i++;
      j = 0;
      if (i >= 9) {
        return true;
      }
    }
  }

  for (let num = 1; num <= 9; num++) {
    if (isValidMove(grid, i, j, num)) {
      grid[i][j] = num;
      if (fillRemaining(grid, i, j + 1)) {
        return true;
      }
      grid[i][j] = 0;
    }
  }

  return false;
}

/**
 * Remove numbers from completed grid to create puzzle
 * @param {number[][]} grid - Completed Sudoku grid
 * @param {number} count - Number of cells to remove
 */
function removeNumbers(grid, count) {
  while (count > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (grid[row][col] !== 0) {
      grid[row][col] = 0;
      count--;
    }
  }
}
