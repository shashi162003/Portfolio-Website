
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NQueensVisualizer from './visualizers/NQueens/NQueensVisualizer';
import BinaryTreeVisualizer from './visualizers/BinaryTree/BinaryTreeVisualizer';
import SudokuVisualizer from './visualizers/Sudoku/SudokuVisualizer';
import PathFindingVisualizer from './visualizers/PathFinding/PathFindingVisualizer';
import SortingVisualizer from './visualizers/Sorting/SortingVisualizer';

/**
 * Main App component that sets up routing for the algorithm visualization website
 *
 * Features:
 * - React Router for navigation between different visualizers
 * - Layout component for consistent UI structure
 * - Individual visualizer components for each algorithm type
 */
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nqueens" element={<NQueensVisualizer />} />
          <Route path="/binary-tree" element={<BinaryTreeVisualizer />} />
          <Route path="/sudoku" element={<SudokuVisualizer />} />
          <Route path="/pathfinding" element={<PathFindingVisualizer />} />
          <Route path="/sorting" element={<SortingVisualizer />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
