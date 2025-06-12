import { useState, useRef, useCallback } from 'react';
import { Play, Plus, Search, RotateCcw, TreePine, Trash2 } from 'lucide-react';
import { BinaryTree } from '../../algorithms/binaryTree';

/**
 * Binary Tree Visualizer Component
 * 
 * Interactive visualization of binary tree operations including:
 * - Node insertion with automatic positioning
 * - Tree traversals (inorder, preorder, postorder)
 * - Search operations with path highlighting
 * - Visual tree representation with SVG
 */
function BinaryTreeVisualizer() {
  const [tree] = useState(() => new BinaryTree());
  const [treeStructure, setTreeStructure] = useState({ nodes: [], edges: [] });
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [searchPath, setSearchPath] = useState([]);
  const [traversalResult, setTraversalResult] = useState([]);
  const [message, setMessage] = useState('Enter values to build your binary tree');
  const svgRef = useRef(null);

  // Step callback for algorithm visualization
  const onStep = useCallback(async (step, stepIndex, total) => {
    setCurrentStep(step);
    setMessage(step.message);
    setTreeStructure(step.tree);

    if (step.node) {
      setHighlightedNode(step.node.value);
    }

    if (step.path) {
      setSearchPath(step.path.map(node => node.value));
    }

    if (step.result) {
      setTraversalResult(step.result);
    }
  }, []);

  // Insert a new node
  const insertNode = async () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }

    setIsRunning(true);
    setHighlightedNode(null);
    setSearchPath([]);
    setTraversalResult([]);

    try {
      await tree.insert(value, onStep);
      setInputValue('');
      setMessage(`Successfully inserted ${value} into the tree`);
    } catch (error) {
      if (error.message === 'Operation stopped') {
        setMessage('Operation stopped by user');
      } else {
        setMessage('Error inserting node');
      }
    }

    setIsRunning(false);
    setHighlightedNode(null);
  };

  // Search for a value
  const searchNode = async () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number to search');
      return;
    }

    setIsRunning(true);
    setHighlightedNode(null);
    setSearchPath([]);
    setTraversalResult([]);

    try {
      await tree.search(value, onStep);
      setSearchValue('');
    } catch (error) {
      if (error.message === 'Operation stopped') {
        setMessage('Search stopped by user');
      } else {
        setMessage('Error searching for node');
      }
    }

    setIsRunning(false);
    setHighlightedNode(null);
    setSearchPath([]);
  };



  // Perform traversal
  const performTraversal = async (type) => {
    setIsRunning(true);
    setHighlightedNode(null);
    setSearchPath([]);
    setTraversalResult([]);

    try {
      let result;
      switch (type) {
        case 'inorder':
          result = await tree.inorderTraversal(onStep);
          break;
        case 'preorder':
          result = await tree.preorderTraversal(onStep);
          break;
        case 'postorder':
          result = await tree.postorderTraversal(onStep);
          break;
        default:
          return;
      }
      setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} traversal completed: [${result.join(', ')}]`);
    } catch (error) {
      if (error.message === 'Operation stopped') {
        setMessage('Traversal stopped by user');
      } else {
        setMessage('Error performing traversal');
      }
    }

    setIsRunning(false);
    setHighlightedNode(null);
  };

  // Clear the tree
  const clearTree = () => {
    tree.clear();
    setTreeStructure({ nodes: [], edges: [] });
    setHighlightedNode(null);
    setSearchPath([]);
    setTraversalResult([]);
    setMessage('Tree cleared. Enter values to build a new tree');
  };

  // Generate sample tree
  const generateSampleTree = async () => {
    clearTree();
    const values = [50, 30, 70, 20, 40, 60, 80];

    setIsRunning(true);
    for (const value of values) {
      await tree.insert(value, () => { });
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    tree.calculatePositions();
    setTreeStructure(tree.getTreeStructure());
    setMessage('Sample tree generated with values: [50, 30, 70, 20, 40, 60, 80]');
    setIsRunning(false);
  };

  // Handle key press for input
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter' && !isRunning) {
      action();
    }
  };

  // Get node style based on state
  const getNodeStyle = (nodeValue) => {
    if (highlightedNode === nodeValue) {
      return 'tree-node highlighted';
    } else if (searchPath.includes(nodeValue)) {
      return 'tree-node';
    }

    return 'tree-node';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <TreePine className="w-8 h-8 text-green-600" />
          <h1 className="text-4xl font-bold text-gray-900">Binary Tree Visualizer</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore binary tree operations including insertion, search, and traversals.
          Watch how the tree structure changes and see different traversal algorithms in action.
        </p>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Insert Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Insert Node</h3>
            <div className="flex space-x-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, insertNode)}
                placeholder="Enter value to insert"
                disabled={isRunning}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={insertNode}
                disabled={isRunning || !inputValue}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Insert</span>
              </button>
            </div>
          </div>

          {/* Search Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Search Node</h3>
            <div className="flex space-x-2">
              <input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, searchNode)}
                placeholder="Enter value to search"
                disabled={isRunning}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={searchNode}
                disabled={isRunning || !searchValue}
                className="btn-primary flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Traversal and Utility Buttons */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => performTraversal('inorder')}
              disabled={isRunning || treeStructure.nodes.length === 0}
              className="btn-secondary flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Inorder</span>
            </button>

            <button
              onClick={() => performTraversal('preorder')}
              disabled={isRunning || treeStructure.nodes.length === 0}
              className="btn-secondary flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Preorder</span>
            </button>

            <button
              onClick={() => performTraversal('postorder')}
              disabled={isRunning || treeStructure.nodes.length === 0}
              className="btn-secondary flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Postorder</span>
            </button>



            <button
              onClick={generateSampleTree}
              disabled={isRunning}
              className="btn-secondary flex items-center space-x-2"
            >
              <TreePine className="w-4 h-4" />
              <span>Sample Tree</span>
            </button>

            <button
              onClick={clearTree}
              disabled={isRunning}
              className="btn-danger flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
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
          {traversalResult.length > 0 && (
            <div className="text-sm text-gray-600">
              Result: [{traversalResult.join(', ')}]
            </div>
          )}
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tree Structure</h3>
        {treeStructure.nodes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <TreePine className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No nodes in the tree. Insert some values to get started!</p>
          </div>
        ) : (
          <div className="overflow-auto">
            <svg
              ref={svgRef}
              width="100%"
              height="400"
              viewBox="0 0 500 400"
              className="border border-gray-200 rounded-lg bg-gray-50"
              style={{ maxWidth: '800px' }}
            >
              {/* Render edges */}
              {treeStructure.edges.map((edge, index) => (
                <line
                  key={index}
                  x1={edge.from.x}
                  y1={edge.from.y}
                  x2={edge.to.x}
                  y2={edge.to.y}
                  className="tree-edge"
                />
              ))}

              {/* Render nodes */}
              {treeStructure.nodes.map((node, index) => (
                <g key={index}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="24"
                    className={getNodeStyle(node.value)}
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    className={`tree-node-text ${highlightedNode === node.value ? 'highlighted' : ''}`}
                  >
                    {node.value}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="tree-node w-8 h-8"></div>
            <span className="text-sm text-gray-600">Normal Node</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="tree-node highlighted w-8 h-8"></div>
            <span className="text-sm text-gray-600">Current Node</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="tree-node bg-blue-200 border-blue-400 w-8 h-8"></div>
            <span className="text-sm text-gray-600">Search Path</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BinaryTreeVisualizer;
