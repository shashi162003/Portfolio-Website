import { useState, useCallback } from 'react';
import { Play, RotateCcw, Grid3X3, Shuffle, Settings } from 'lucide-react';
import { solveSudoku, generateSudoku } from '../../algorithms/sudoku';

/**
 * Sudoku Solver Visualizer Component
 *
 * Interactive visualization of the backtracking algorithm for solving Sudoku puzzles.
 * Features:
 * - Interactive 9×9 Sudoku grid
 * - Backtracking algorithm visualization
 * - Puzzle generation with difficulty levels
 * - Step-by-step solving animation
 * - Manual input and editing
 */
function SudokuVisualizer() {
  const [grid, setGrid] = useState(() => generateSudoku(2));
  const [originalGrid, setOriginalGrid] = useState(() => generateSudoku(2));
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [stepCount, setStepCount] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [highlightedCell, setHighlightedCell] = useState(null);
  const [affectedCells, setAffectedCells] = useState([]);
  const [difficulty, setDifficulty] = useState(2);
  const [speed, setSpeed] = useState(300);
  const [message, setMessage] = useState('Click "Start Solving" to begin the Sudoku solver');

  // Step callback for algorithm visualization
  const onStep = useCallback(async (step, stepIndex, total) => {
    setGrid(step.grid);
    setStepCount(stepIndex + 1);
    setTotalSteps(total);
    setMessage(step.message);

    if (step.row !== undefined && step.col !== undefined) {
      setHighlightedCell([step.row, step.col]);
    }

    if (step.affectedCells) {
      setAffectedCells(step.affectedCells);
    } else {
      setAffectedCells([]);
    }
  }, []);

  // Start solving
  const startSolving = async () => {
    setIsRunning(true);
    setHighlightedCell(null);
    setAffectedCells([]);

    // Create a copy of the grid for solving
    const gridCopy = grid.map(row => [...row]);

    try {
      await solveSudoku(gridCopy, onStep);
      setMessage('Sudoku solved successfully!');
    } catch (error) {
      setMessage('Algorithm encountered an error');
    }

    setIsRunning(false);
  };



  // Reset to original puzzle
  const reset = () => {
    setIsRunning(false);
    setGrid(originalGrid.map(row => [...row]));
    setHighlightedCell(null);
    setAffectedCells([]);
    setStepCount(0);
    setTotalSteps(0);
    setMessage('Puzzle reset. Click "Start Solving" to begin');
  };

  // Generate new puzzle
  const generateNewPuzzle = () => {
    const newGrid = generateSudoku(difficulty);
    setGrid(newGrid.map(row => [...row]));
    setOriginalGrid(newGrid.map(row => [...row]));
    setHighlightedCell(null);
    setAffectedCells([]);
    setStepCount(0);
    setTotalSteps(0);
    setMessage('New puzzle generated. Click "Start Solving" to begin');
  };

  // Handle cell input
  const handleCellChange = (row, col, value) => {
    if (isRunning) return;

    const newValue = parseInt(value) || 0;
    if (newValue < 0 || newValue > 9) return;

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = newValue;
    setGrid(newGrid);
  };



  // Check if cell is highlighted
  const isCellHighlighted = (row, col) => {
    return highlightedCell && highlightedCell[0] === row && highlightedCell[1] === col;
  };

  // Get cell class based on state
  const getCellClass = (row, col) => {
    const baseClass = 'sudoku-cell';
    const isOriginal = originalGrid[row][col] !== 0;

    let stateClass = '';
    if (isOriginal) {
      stateClass = 'given';
    } else if (isCellHighlighted(row, col)) {
      stateClass = 'solving';
    } else if (grid[row][col] !== 0 && !isOriginal) {
      stateClass = 'solved';
    }

    // Add thick borders for 3x3 boxes
    let borderClass = '';
    if (row % 3 === 0) borderClass += ' border-t-2 border-t-gray-800';
    if (col % 3 === 0) borderClass += ' border-l-2 border-l-gray-800';
    if (row === 8) borderClass += ' border-b-2 border-b-gray-800';
    if (col === 8) borderClass += ' border-r-2 border-r-gray-800';

    return `${baseClass} ${stateClass} ${borderClass}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Grid3X3 className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Sudoku Solver</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Watch the backtracking algorithm solve Sudoku puzzles step by step.
          Generate new puzzles or input your own to see the solving process.
        </p>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Difficulty:</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                disabled={isRunning}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>Easy</option>
                <option value={2}>Medium</option>
                <option value={3}>Hard</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Speed:</label>
              <select
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                disabled={isRunning}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={100}>Fast</option>
                <option value={300}>Normal</option>
                <option value={600}>Slow</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={startSolving}
              disabled={isRunning}
              className="btn-primary flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'Solving...' : 'Start Solving'}</span>
            </button>

            <button
              onClick={generateNewPuzzle}
              disabled={isRunning}
              className="btn-secondary flex items-center space-x-2"
            >
              <Shuffle className="w-4 h-4" />
              <span>New Puzzle</span>
            </button>

            <button
              onClick={reset}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="text-gray-700">
            <span className="font-medium">Status:</span> {message}
          </div>
          {totalSteps > 0 && (
            <div className="text-sm text-gray-600">
              Step {stepCount} of {totalSteps}
            </div>
          )}
        </div>
      </div>

      {/* Sudoku Grid */}
      <div className="flex justify-center">
        <div className="visualizer-container">
          <div className="grid grid-cols-9 gap-0 p-4 bg-white border-2 border-gray-800">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  value={cell === 0 ? '' : cell}
                  onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                  disabled={isRunning || originalGrid[rowIndex][colIndex] !== 0}
                  className={getCellClass(rowIndex, colIndex)}
                  maxLength="1"
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="sudoku-cell given w-8 h-8 text-xs">5</div>
            <span className="text-sm text-gray-600">Given Numbers</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="sudoku-cell solving w-8 h-8 text-xs">3</div>
            <span className="text-sm text-gray-600">Currently Trying</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="sudoku-cell solved w-8 h-8 text-xs">7</div>
            <span className="text-sm text-gray-600">Algorithm Placed</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="sudoku-cell w-8 h-8"></div>
            <span className="text-sm text-gray-600">Empty Cell</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SudokuVisualizer;
