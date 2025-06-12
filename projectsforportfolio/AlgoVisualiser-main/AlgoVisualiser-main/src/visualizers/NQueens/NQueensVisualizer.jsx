import { useState, useCallback } from 'react';
import { Play, RotateCcw, Settings, Crown, Info } from 'lucide-react';
import { solveNQueens, getAllSolutions } from '../../algorithms/nQueens';

/**
 * N-Queens Visualizer Component
 * 
 * Interactive visualization of the N-Queens backtracking algorithm.
 * Features:
 * - Adjustable board size (4-12 queens)
 * - Step-by-step algorithm visualization
 * - Real-time conflict highlighting
 * - Solution counter and statistics
 */
function NQueensVisualizer() {
  const [boardSize, setBoardSize] = useState(8);
  const [board, setBoard] = useState(Array(8).fill().map(() => Array(8).fill(0)));
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [stepCount, setStepCount] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [attackedCells, setAttackedCells] = useState([]);
  const [solutionCount, setSolutionCount] = useState(0);
  const [message, setMessage] = useState('Click "Start Solving" to begin the N-Queens algorithm');

  // Initialize board when size changes
  const initializeBoard = useCallback((size) => {
    const newBoard = Array(size).fill().map(() => Array(size).fill(0));
    setBoard(newBoard);
    setCurrentStep(null);
    setStepCount(0);
    setTotalSteps(0);
    setAttackedCells([]);
    setMessage(`Board initialized with ${size}×${size} grid. Ready to solve!`);
  }, []);

  // Handle board size change
  const handleBoardSizeChange = (newSize) => {
    setBoardSize(newSize);
    initializeBoard(newSize);

    // Calculate solution count for the new size
    const solutions = getAllSolutions(newSize);
    setSolutionCount(solutions.length);
  };

  // Step callback for algorithm visualization
  const onStep = useCallback(async (step, stepIndex, total) => {
    setCurrentStep(step);
    setBoard(step.board);
    setStepCount(stepIndex + 1);
    setTotalSteps(total);
    setMessage(step.message);

    if (step.attackedCells) {
      setAttackedCells(step.attackedCells);
    } else {
      setAttackedCells([]);
    }
  }, []);

  // Start solving
  const startSolving = async () => {
    setIsRunning(true);
    initializeBoard(boardSize);

    try {
      await solveNQueens(boardSize, onStep);
      setMessage('N-Queens algorithm completed!');
    } catch (error) {
      setMessage('Algorithm encountered an error');
    }

    setIsRunning(false);
  };

  // Reset visualization
  const reset = () => {
    setIsRunning(false);
    initializeBoard(boardSize);
  };

  // Check if cell is attacked
  const isCellAttacked = (row, col) => {
    return attackedCells.some(([r, c]) => r === row && c === col);
  };

  // Get cell class based on state
  const getCellClass = (row, col) => {
    const baseClass = 'queens-cell';
    const isLight = (row + col) % 2 === 0;
    const colorClass = isLight ? 'light' : 'dark';

    let stateClass = '';
    if (board[row][col] === 1) {
      stateClass = 'queen';
    } else if (isCellAttacked(row, col)) {
      stateClass = 'attacking';
    }

    return `${baseClass} ${colorClass} ${stateClass}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Crown className="w-8 h-8 text-purple-600" />
          <h1 className="text-4xl font-bold text-gray-900">N-Queens Visualizer</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Watch the backtracking algorithm solve the classic N-Queens problem.
          The goal is to place N queens on an N×N chessboard so that no two queens attack each other.
        </p>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Board Size:</label>
              <select
                value={boardSize}
                onChange={(e) => handleBoardSizeChange(parseInt(e.target.value))}
                disabled={isRunning}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[4, 5, 6, 7, 8, 9, 10, 11, 12].map(size => (
                  <option key={size} value={size}>{size}×{size}</option>
                ))}
              </select>
            </div>

            {solutionCount > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Info className="w-4 h-4" />
                <span>{solutionCount} solution{solutionCount !== 1 ? 's' : ''} exist</span>
              </div>
            )}
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
              onClick={reset}
              disabled={isRunning}
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

      {/* Chessboard */}
      <div className="flex justify-center">
        <div className="visualizer-container">
          <div
            className="grid gap-1 p-4"
            style={{
              gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
              maxWidth: `${Math.min(600, boardSize * 50)}px`
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClass(rowIndex, colIndex)}
                >
                  {cell === 1 && <Crown className="w-6 h-6 text-red-600" />}
                </div>
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
            <div className="queens-cell light w-8 h-8"></div>
            <span className="text-sm text-gray-600">Empty (Light)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="queens-cell dark w-8 h-8"></div>
            <span className="text-sm text-gray-600">Empty (Dark)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="queens-cell queen w-8 h-8 flex items-center justify-center">
              <Crown className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm text-gray-600">Queen Placed</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="queens-cell attacking w-8 h-8"></div>
            <span className="text-sm text-gray-600">Under Attack</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NQueensVisualizer;
