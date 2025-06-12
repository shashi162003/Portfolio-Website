import { Link } from 'react-router-dom';
import { Crown, TreePine, Grid3X3, Route, BarChart3, Play, BookOpen } from 'lucide-react';

/**
 * Home page component showcasing all available algorithm visualizers
 * 
 * Features:
 * - Hero section with introduction
 * - Grid of algorithm visualizer cards
 * - Interactive hover effects
 * - Responsive design
 */
function Home() {
  const algorithms = [
    {
      path: '/nqueens',
      title: 'N-Queens Problem',
      description: 'Visualize the classic N-Queens backtracking algorithm. Watch as the algorithm places queens on a chessboard without conflicts.',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      features: ['Backtracking Algorithm', 'Interactive Board Size', 'Step-by-step Visualization']
    },
    {
      path: '/binary-tree',
      title: 'Binary Tree Operations',
      description: 'Explore binary tree data structure with insertion, deletion, and traversal algorithms visualized in real-time.',
      icon: TreePine,
      color: 'from-green-500 to-emerald-500',
      features: ['Tree Traversals', 'Insert/Delete Operations', 'Balanced Tree Visualization']
    },
    {
      path: '/sudoku',
      title: 'Sudoku Solver',
      description: 'Watch the backtracking algorithm solve Sudoku puzzles step by step. Generate new puzzles or input your own.',
      icon: Grid3X3,
      color: 'from-blue-500 to-cyan-500',
      features: ['Backtracking Solver', 'Puzzle Generation', 'Custom Input Support']
    },
    {
      path: '/pathfinding',
      title: 'Shortest Path Algorithms',
      description: 'Visualize Dijkstra\'s and A* pathfinding algorithms. Create mazes and watch algorithms find the optimal path.',
      icon: Route,
      color: 'from-orange-500 to-red-500',
      features: ['Dijkstra\'s Algorithm', 'A* Search', 'Interactive Grid Editor']
    },
    {
      path: '/sorting',
      title: 'Sorting Algorithms',
      description: 'Compare different sorting algorithms including bubble, merge, quick, heap, insertion, and selection sort.',
      icon: BarChart3,
      color: 'from-indigo-500 to-purple-500',
      features: ['6 Sorting Algorithms', 'Performance Comparison', 'Customizable Array Size']
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Algorithm
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Visualizer
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Interactive visualizations of classic computer science algorithms. 
            Learn how algorithms work through step-by-step animations and hands-on exploration.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center space-x-2 text-gray-600">
            <BookOpen className="w-5 h-5" />
            <span>Educational & Interactive</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Play className="w-5 h-5" />
            <span>Real-time Visualization</span>
          </div>
        </div>
      </section>

      {/* Algorithms Grid */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Algorithms
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose an algorithm to visualize and learn how it works through interactive demonstrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {algorithms.map((algorithm) => {
            const Icon = algorithm.icon;
            return (
              <Link
                key={algorithm.path}
                to={algorithm.path}
                className="group block"
              >
                <div className="card hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${algorithm.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {algorithm.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {algorithm.description}
                  </p>
                  
                  <div className="space-y-2">
                    {algorithm.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                    <span>Explore Algorithm</span>
                    <Play className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Home;
