/**
 * Pathfinding Algorithms Implementation
 * 
 * This module implements Dijkstra's algorithm and A* search for finding
 * the shortest path between two points on a grid with obstacles.
 * 
 * Grid representation:
 * - 0: Empty cell (walkable)
 * - 1: Wall/obstacle (not walkable)
 * - 2: Start position
 * - 3: End position
 */

/**
 * Priority Queue implementation for pathfinding algorithms
 */
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    const queueElement = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(queueElement);
    }
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

/**
 * Get valid neighbors of a cell
 * @param {number} row - Current row
 * @param {number} col - Current column
 * @param {number[][]} grid - Grid representation
 * @returns {Array} - Array of valid neighbor coordinates
 */
export function getNeighbors(row, col, grid) {
  const neighbors = [];
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1] // Up, Down, Left, Right
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (
      newRow >= 0 && 
      newRow < grid.length && 
      newCol >= 0 && 
      newCol < grid[0].length &&
      grid[newRow][newCol] !== 1 // Not a wall
    ) {
      neighbors.push([newRow, newCol]);
    }
  }

  return neighbors;
}

/**
 * Calculate Manhattan distance (heuristic for A*)
 * @param {number} row1 - Start row
 * @param {number} col1 - Start column
 * @param {number} row2 - End row
 * @param {number} col2 - End column
 * @returns {number} - Manhattan distance
 */
export function manhattanDistance(row1, col1, row2, col2) {
  return Math.abs(row1 - row2) + Math.abs(col1 - col2);
}

/**
 * Reconstruct path from end to start using parent tracking
 * @param {Map} parents - Parent tracking map
 * @param {Array} start - Start coordinates [row, col]
 * @param {Array} end - End coordinates [row, col]
 * @returns {Array} - Path coordinates
 */
export function reconstructPath(parents, start, end) {
  const path = [];
  let current = `${end[0]},${end[1]}`;
  const startKey = `${start[0]},${start[1]}`;

  while (current !== startKey) {
    const [row, col] = current.split(',').map(Number);
    path.unshift([row, col]);
    current = parents.get(current);
    if (!current) break;
  }

  path.unshift(start);
  return path;
}

/**
 * Dijkstra's Algorithm implementation with visualization
 * @param {number[][]} grid - Grid representation
 * @param {Array} start - Start coordinates [row, col]
 * @param {Array} end - End coordinates [row, col]
 * @param {Function} onStep - Callback for visualization steps
 * @returns {Promise<Object>} - Result with path and statistics
 */
export async function dijkstra(grid, start, end, onStep) {
  const distances = new Map();
  const parents = new Map();
  const visited = new Set();
  const pq = new PriorityQueue();
  
  const startKey = `${start[0]},${start[1]}`;
  const endKey = `${end[0]},${end[1]}`;
  
  // Initialize distances
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      distances.set(`${row},${col}`, Infinity);
    }
  }
  
  distances.set(startKey, 0);
  pq.enqueue(start, 0);
  
  let stepCount = 0;
  let nodesVisited = 0;

  while (!pq.isEmpty()) {
    const { element: current } = pq.dequeue();
    const [row, col] = current;
    const currentKey = `${row},${col}`;
    
    if (visited.has(currentKey)) continue;
    
    visited.add(currentKey);
    nodesVisited++;
    
    await onStep({
      type: 'visiting',
      current: [row, col],
      visited: Array.from(visited).map(key => key.split(',').map(Number)),
      distances: Object.fromEntries(distances),
      message: `Visiting cell (${row + 1}, ${col + 1}) - Distance: ${distances.get(currentKey)}`,
      step: ++stepCount,
      algorithm: 'Dijkstra'
    });
    
    // Found the end
    if (currentKey === endKey) {
      const path = reconstructPath(parents, start, end);
      
      await onStep({
        type: 'path_found',
        path,
        visited: Array.from(visited).map(key => key.split(',').map(Number)),
        message: `Path found! Length: ${path.length - 1}, Nodes visited: ${nodesVisited}`,
        step: ++stepCount,
        algorithm: 'Dijkstra'
      });
      
      return {
        success: true,
        path,
        distance: distances.get(endKey),
        nodesVisited,
        steps: stepCount
      };
    }
    
    // Check neighbors
    const neighbors = getNeighbors(row, col, grid);
    
    for (const [nRow, nCol] of neighbors) {
      const neighborKey = `${nRow},${nCol}`;
      
      if (visited.has(neighborKey)) continue;
      
      const newDistance = distances.get(currentKey) + 1;
      
      if (newDistance < distances.get(neighborKey)) {
        distances.set(neighborKey, newDistance);
        parents.set(neighborKey, currentKey);
        pq.enqueue([nRow, nCol], newDistance);
        
        await onStep({
          type: 'updating',
          current: [row, col],
          neighbor: [nRow, nCol],
          newDistance,
          visited: Array.from(visited).map(key => key.split(',').map(Number)),
          message: `Updated distance to (${nRow + 1}, ${nCol + 1}): ${newDistance}`,
          step: ++stepCount,
          algorithm: 'Dijkstra'
        });
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  await onStep({
    type: 'no_path',
    visited: Array.from(visited).map(key => key.split(',').map(Number)),
    message: 'No path found to the destination',
    step: ++stepCount,
    algorithm: 'Dijkstra'
  });
  
  return {
    success: false,
    path: [],
    distance: Infinity,
    nodesVisited,
    steps: stepCount
  };
}

/**
 * A* Algorithm implementation with visualization
 * @param {number[][]} grid - Grid representation
 * @param {Array} start - Start coordinates [row, col]
 * @param {Array} end - End coordinates [row, col]
 * @param {Function} onStep - Callback for visualization steps
 * @returns {Promise<Object>} - Result with path and statistics
 */
export async function aStar(grid, start, end, onStep) {
  const gScore = new Map(); // Cost from start to node
  const fScore = new Map(); // gScore + heuristic
  const parents = new Map();
  const visited = new Set();
  const openSet = new PriorityQueue();
  
  const startKey = `${start[0]},${start[1]}`;
  const endKey = `${end[0]},${end[1]}`;
  
  // Initialize scores
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      gScore.set(`${row},${col}`, Infinity);
      fScore.set(`${row},${col}`, Infinity);
    }
  }
  
  gScore.set(startKey, 0);
  fScore.set(startKey, manhattanDistance(start[0], start[1], end[0], end[1]));
  openSet.enqueue(start, fScore.get(startKey));
  
  let stepCount = 0;
  let nodesVisited = 0;

  while (!openSet.isEmpty()) {
    const { element: current } = openSet.dequeue();
    const [row, col] = current;
    const currentKey = `${row},${col}`;
    
    if (visited.has(currentKey)) continue;
    
    visited.add(currentKey);
    nodesVisited++;
    
    await onStep({
      type: 'visiting',
      current: [row, col],
      visited: Array.from(visited).map(key => key.split(',').map(Number)),
      gScore: Object.fromEntries(gScore),
      fScore: Object.fromEntries(fScore),
      message: `Visiting cell (${row + 1}, ${col + 1}) - f(n): ${fScore.get(currentKey).toFixed(1)}`,
      step: ++stepCount,
      algorithm: 'A*'
    });
    
    // Found the end
    if (currentKey === endKey) {
      const path = reconstructPath(parents, start, end);
      
      await onStep({
        type: 'path_found',
        path,
        visited: Array.from(visited).map(key => key.split(',').map(Number)),
        message: `Path found! Length: ${path.length - 1}, Nodes visited: ${nodesVisited}`,
        step: ++stepCount,
        algorithm: 'A*'
      });
      
      return {
        success: true,
        path,
        distance: gScore.get(endKey),
        nodesVisited,
        steps: stepCount
      };
    }
    
    // Check neighbors
    const neighbors = getNeighbors(row, col, grid);
    
    for (const [nRow, nCol] of neighbors) {
      const neighborKey = `${nRow},${nCol}`;
      
      if (visited.has(neighborKey)) continue;
      
      const tentativeGScore = gScore.get(currentKey) + 1;
      
      if (tentativeGScore < gScore.get(neighborKey)) {
        parents.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeGScore);
        const heuristic = manhattanDistance(nRow, nCol, end[0], end[1]);
        fScore.set(neighborKey, tentativeGScore + heuristic);
        
        openSet.enqueue([nRow, nCol], fScore.get(neighborKey));
        
        await onStep({
          type: 'updating',
          current: [row, col],
          neighbor: [nRow, nCol],
          gScore: tentativeGScore,
          fScore: fScore.get(neighborKey),
          visited: Array.from(visited).map(key => key.split(',').map(Number)),
          message: `Updated f(n) for (${nRow + 1}, ${nCol + 1}): ${fScore.get(neighborKey).toFixed(1)}`,
          step: ++stepCount,
          algorithm: 'A*'
        });
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  await onStep({
    type: 'no_path',
    visited: Array.from(visited).map(key => key.split(',').map(Number)),
    message: 'No path found to the destination',
    step: ++stepCount,
    algorithm: 'A*'
  });
  
  return {
    success: false,
    path: [],
    distance: Infinity,
    nodesVisited,
    steps: stepCount
  };
}

/**
 * Generate a random maze using recursive backtracking
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @returns {number[][]} - Generated maze grid
 */
export function generateMaze(rows, cols) {
  // Start with all walls
  const grid = Array(rows).fill().map(() => Array(cols).fill(1));
  
  // Recursive backtracking maze generation
  const stack = [];
  const visited = new Set();
  
  // Start from top-left corner
  const start = [1, 1];
  stack.push(start);
  visited.add(`${start[0]},${start[1]}`);
  grid[start[0]][start[1]] = 0;
  
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const [row, col] = current;
    
    // Get unvisited neighbors (2 cells away)
    const neighbors = [];
    const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]];
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (
        newRow > 0 && newRow < rows - 1 &&
        newCol > 0 && newCol < cols - 1 &&
        !visited.has(`${newRow},${newCol}`)
      ) {
        neighbors.push([newRow, newCol]);
      }
    }
    
    if (neighbors.length > 0) {
      // Choose random neighbor
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      const [nextRow, nextCol] = next;
      
      // Remove wall between current and next
      const wallRow = row + (nextRow - row) / 2;
      const wallCol = col + (nextCol - col) / 2;
      
      grid[wallRow][wallCol] = 0;
      grid[nextRow][nextCol] = 0;
      
      visited.add(`${nextRow},${nextCol}`);
      stack.push(next);
    } else {
      stack.pop();
    }
  }
  
  return grid;
}
