import { useState, useCallback, useRef } from 'react';
import { Play, RotateCcw, Route, Shuffle, MousePointer, Square } from 'lucide-react';
import { dijkstra, aStar, generateMaze } from '../../algorithms/pathfinding';

/**
 * Path Finding Visualizer Component
 *
 * Interactive visualization of shortest path algorithms including Dijkstra's and A*.
 * Features:
 * - Interactive grid for creating mazes and obstacles
 * - Draggable start and end points
 * - Wall placement and removal
 * - Algorithm comparison with statistics
 * - Real-time pathfinding visualization
 */
function PathFindingVisualizer() {
  const GRID_ROWS = 20;
  const GRID_COLS = 40;

  const [grid, setGrid] = useState(() => {
    const initialGrid = Array(GRID_ROWS).fill().map(() => Array(GRID_COLS).fill(0));
    return initialGrid;
  });

  const [start, setStart] = useState([5, 5]);
  const [end, setEnd] = useState([15, 35]);
  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [mode, setMode] = useState('wall'); // 'wall', 'start', 'end'
  const [isDrawing, setIsDrawing] = useState(false);
  const [visitedCells, setVisitedCells] = useState([]);
  const [path, setPath] = useState([]);
  const [message, setMessage] = useState('Click and drag to draw walls, then start pathfinding!');
  const [stats, setStats] = useState(null);
  const gridRef = useRef(null);

  // Step callback for algorithm visualization
  const onStep = useCallback(async (step) => {
    setMessage(step.message);

    if (step.visited) {
      setVisitedCells(step.visited);
    }

    if (step.path) {
      setPath(step.path);
    }
  }, []);

  // Start pathfinding
  const startPathfinding = async () => {
    setIsRunning(true);
    setVisitedCells([]);
    setPath([]);
    setStats(null);

    try {
      let result;
      if (algorithm === 'dijkstra') {
        result = await dijkstra(grid, start, end, onStep);
      } else {
        result = await aStar(grid, start, end, onStep);
      }

      setStats(result);
      if (result.success) {
        setMessage(`${algorithm.toUpperCase()} completed! Path length: ${result.distance}, Nodes visited: ${result.nodesVisited}`);
      } else {
        setMessage(`${algorithm.toUpperCase()} completed. No path found.`);
      }
    } catch (error) {
      if (error.message === 'Algorithm stopped') {
        setMessage('Algorithm stopped by user');
      } else {
        setMessage('Algorithm encountered an error');
      }
    }

    setIsRunning(false);
  };



  // Clear visualization
  const clearPath = () => {
    setVisitedCells([]);
    setPath([]);
    setStats(null);
    setMessage('Visualization cleared. Ready to start pathfinding!');
  };

  // Clear walls
  const clearWalls = () => {
    const newGrid = Array(GRID_ROWS).fill().map(() => Array(GRID_COLS).fill(0));
    setGrid(newGrid);
    setVisitedCells([]);
    setPath([]);
    setStats(null);
    setMessage('Walls cleared. Draw new obstacles and start pathfinding!');
  };

  // Generate maze
  const generateRandomMaze = () => {
    const maze = generateMaze(GRID_ROWS, GRID_COLS);
    setGrid(maze);
    setVisitedCells([]);
    setPath([]);
    setStats(null);
    setMessage('Random maze generated. Start pathfinding to find the optimal path!');
  };

  // Handle mouse events for drawing
  const handleMouseDown = (row, col) => {
    if (isRunning) return;

    setIsDrawing(true);
    handleCellInteraction(row, col);
  };

  const handleMouseEnter = (row, col) => {
    if (isRunning || !isDrawing) return;

    handleCellInteraction(row, col);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleCellInteraction = (row, col) => {
    if (mode === 'start') {
      setStart([row, col]);
      setMode('wall');
    } else if (mode === 'end') {
      setEnd([row, col]);
      setMode('wall');
    } else if (mode === 'wall') {
      // Don't place walls on start or end
      if ((row === start[0] && col === start[1]) || (row === end[0] && col === end[1])) {
        return;
      }

      const newGrid = [...grid];
      newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;
      setGrid(newGrid);
    }
  };

  // Get cell type
  const getCellType = (row, col) => {
    if (row === start[0] && col === start[1]) return 'start';
    if (row === end[0] && col === end[1]) return 'end';
    if (grid[row][col] === 1) return 'wall';
    if (path.some(([r, c]) => r === row && c === col)) return 'path';
    if (visitedCells.some(([r, c]) => r === row && c === col)) return 'visited';
    return 'empty';
  };

  // Get cell class
  const getCellClass = (row, col) => {
    const type = getCellType(row, col);
    const baseClass = 'path-node';

    switch (type) {
      case 'start': return `${baseClass} path-start`;
      case 'end': return `${baseClass} path-end`;
      case 'wall': return `${baseClass} path-wall`;
      case 'visited': return `${baseClass} path-visited`;
      case 'path': return `${baseClass} path-shortest`;
      default: return baseClass;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Route className="w-8 h-8 text-orange-600" />
          <h1 className="text-4xl font-bold text-gray-900">Path Finding Algorithms</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Visualize Dijkstra's and A* pathfinding algorithms. Create mazes and watch
          algorithms find the optimal path between start and end points.
        </p>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Algorithm:</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                disabled={isRunning}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="dijkstra">Dijkstra's Algorithm</option>
                <option value="astar">A* Search</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Mode:</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setMode('wall')}
                  disabled={isRunning}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${mode === 'wall' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  <Square className="w-4 h-4 inline mr-1" />
                  Wall
                </button>
                <button
                  onClick={() => setMode('start')}
                  disabled={isRunning}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${mode === 'start' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  <MousePointer className="w-4 h-4 inline mr-1" />
                  Start
                </button>
                <button
                  onClick={() => setMode('end')}
                  disabled={isRunning}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${mode === 'end' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  <MousePointer className="w-4 h-4 inline mr-1" />
                  End
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={startPathfinding}
              disabled={isRunning}
              className="btn-primary flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'Finding Path...' : 'Start Pathfinding'}</span>
            </button>

            <button
              onClick={generateRandomMaze}
              disabled={isRunning}
              className="btn-secondary flex items-center space-x-2"
            >
              <Shuffle className="w-4 h-4" />
              <span>Generate Maze</span>
            </button>

            <button
              onClick={clearWalls}
              disabled={isRunning}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Walls</span>
            </button>

            <button
              onClick={clearPath}
              disabled={isRunning}
              className="btn-secondary"
            >
              Clear Path
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
          {stats && (
            <div className="text-sm text-gray-600">
              Path Length: {stats.distance} | Nodes Visited: {stats.nodesVisited} | Steps: {stats.steps}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="flex justify-center">
        <div className="visualizer-container">
          <div
            ref={gridRef}
            className="grid gap-0 p-4 select-none"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
              maxWidth: '1000px'
            }}
            onMouseLeave={handleMouseUp}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClass(rowIndex, colIndex)}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  onMouseUp={handleMouseUp}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="path-node path-start w-6 h-6"></div>
            <span className="text-sm text-gray-600">Start</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="path-node path-end w-6 h-6"></div>
            <span className="text-sm text-gray-600">End</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="path-node path-wall w-6 h-6"></div>
            <span className="text-sm text-gray-600">Wall</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="path-node path-visited w-6 h-6"></div>
            <span className="text-sm text-gray-600">Visited</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="path-node path-shortest w-6 h-6"></div>
            <span className="text-sm text-gray-600">Shortest Path</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="path-node w-6 h-6"></div>
            <span className="text-sm text-gray-600">Empty</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PathFindingVisualizer;
