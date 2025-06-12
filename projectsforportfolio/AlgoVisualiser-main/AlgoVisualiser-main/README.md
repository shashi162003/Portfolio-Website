# 🎯 Algorithm Visualizer - Interactive Learning Platform

A comprehensive, interactive web application for visualizing and understanding fundamental computer science algorithms through beautiful, real-time animations and step-by-step breakdowns.

![Algorithm Visualizer](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-cyan?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

- **Interactive Visualizations**: Real-time algorithm execution with step-by-step animations
- **Multiple Algorithm Categories**: Sorting, Pathfinding, Tree Traversal, and Backtracking
- **Educational Focus**: Detailed explanations and performance metrics for each algorithm
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface built with React and Tailwind CSS
- **Performance Analytics**: Compare algorithm efficiency with real-time statistics

## 🚀 Live Demo

Visit the live application: **[Algorithm Visualizer](https://shashi162003.github.io/AlgoVisualiser/)**

## 📋 Table of Contents

- [Algorithms Implemented](#algorithms-implemented)
- [Installation](#installation)
- [Usage](#usage)
- [Algorithm Details](#algorithm-details)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## 🧮 Algorithms Implemented

### 🔄 Sorting Algorithms (6 Algorithms)

| Algorithm          | Time Complexity | Space Complexity | Stability | Description                               |
| ------------------ | --------------- | ---------------- | --------- | ----------------------------------------- |
| **Bubble Sort**    | O(n²)           | O(1)             | Stable    | Simple comparison-based algorithm         |
| **Selection Sort** | O(n²)           | O(1)             | Unstable  | Finds minimum element repeatedly          |
| **Insertion Sort** | O(n²)           | O(1)             | Stable    | Builds sorted array one element at a time |
| **Merge Sort**     | O(n log n)      | O(n)             | Stable    | Divide-and-conquer approach               |
| **Quick Sort**     | O(n log n) avg  | O(log n)         | Unstable  | Efficient divide-and-conquer              |
| **Heap Sort**      | O(n log n)      | O(1)             | Unstable  | Uses binary heap data structure           |

### 🗺️ Pathfinding Algorithms (2 Algorithms)

| Algorithm                | Time Complexity  | Space Complexity | Optimal | Description                            |
| ------------------------ | ---------------- | ---------------- | ------- | -------------------------------------- |
| **Dijkstra's Algorithm** | O((V + E) log V) | O(V)             | Yes     | Finds shortest path in weighted graphs |
| **A\* Search**           | O(b^d)           | O(b^d)           | Yes\*   | Heuristic-based pathfinding algorithm  |

### 🌳 Binary Tree Operations (3 Traversals)

| Traversal     | Time Complexity | Space Complexity | Description         |
| ------------- | --------------- | ---------------- | ------------------- |
| **Inorder**   | O(n)            | O(h)             | Left → Root → Right |
| **Preorder**  | O(n)            | O(h)             | Root → Left → Right |
| **Postorder** | O(n)            | O(h)             | Left → Right → Root |

### 🔙 Backtracking Algorithms (2 Problems)

| Problem           | Time Complexity | Space Complexity | Description                      |
| ----------------- | --------------- | ---------------- | -------------------------------- |
| **N-Queens**      | O(N!)           | O(N)             | Place N queens on N×N chessboard |
| **Sudoku Solver** | O(9^(n\*n))     | O(n\*n)          | Solve 9×9 Sudoku puzzles         |

## 🛠️ Installation

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm or yarn package manager

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/shashi162003/AlgoVisualiser.git
   cd AlgoVisualiser
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Deployment

To deploy to GitHub Pages:

```bash
npm run deploy
```

This will build the project and deploy it to the `gh-pages` branch automatically.

## 🎮 Usage

### Sorting Algorithms

1. Select array size (50-300 elements)
2. Click "Generate Array" to create random data
3. Click "Start Sorting" to watch all 6 algorithms compete
4. Compare performance metrics in real-time

### Pathfinding

1. Draw walls by clicking and dragging on the grid
2. Set start and end points using the mode buttons
3. Choose between Dijkstra's or A\* algorithm
4. Watch the algorithm explore and find the optimal path

### Binary Tree

1. Insert values to build your tree structure
2. Search for specific values with visual highlighting
3. Perform different traversals (Inorder, Preorder, Postorder)
4. Generate sample trees for quick testing

### Backtracking

1. **N-Queens**: Choose board size (4×4 to 12×12) and watch the algorithm place queens
2. **Sudoku**: Generate puzzles of varying difficulty and watch the solver in action

## 🏗️ Project Structure

```
AlgoVisualiser/
├── public/
│   ├── favicon.svg
│   └── index.html
├── src/
│   ├── algorithms/          # Algorithm implementations
│   │   ├── sorting.js
│   │   ├── pathfinding.js
│   │   ├── binaryTree.js
│   │   ├── nQueens.js
│   │   └── sudoku.js
│   ├── components/          # Reusable UI components
│   │   ├── Layout.jsx
│   │   └── Navigation.jsx
│   ├── visualizers/         # Algorithm visualizer components
│   │   ├── Sorting/
│   │   ├── PathFinding/
│   │   ├── BinaryTree/
│   │   ├── NQueens/
│   │   └── Sudoku/
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

## 📚 Algorithm Details

### Sorting Algorithms Deep Dive

#### Bubble Sort

- **Concept**: Repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order
- **Best Case**: O(n) when array is already sorted
- **Visualization**: Watch elements "bubble" to their correct positions

#### Quick Sort

- **Concept**: Selects a 'pivot' element and partitions the array around it
- **Partitioning**: Elements smaller than pivot go left, larger go right
- **Recursion**: Recursively sorts the sub-arrays

#### Merge Sort

- **Concept**: Divides array into halves, sorts them, then merges back together
- **Divide**: Recursively divide until single elements
- **Conquer**: Merge sorted sub-arrays back together

### Pathfinding Algorithms Deep Dive

#### Dijkstra's Algorithm

- **Concept**: Finds shortest path from source to all other vertices
- **Process**: Maintains a priority queue of vertices by distance
- **Guarantee**: Always finds the optimal path in weighted graphs

#### A\* Search

- **Concept**: Uses heuristics to guide search toward the goal
- **Formula**: f(n) = g(n) + h(n) where g(n) is cost and h(n) is heuristic
- **Efficiency**: Often faster than Dijkstra's with good heuristics

### Backtracking Deep Dive

#### N-Queens Problem

- **Constraint**: No two queens can attack each other
- **Approach**: Place queens one by one, backtrack when conflicts arise
- **Optimization**: Checks row, column, and diagonal constraints

#### Sudoku Solver

- **Rules**: Each row, column, and 3×3 box must contain digits 1-9
- **Strategy**: Fill empty cells, backtrack when no valid number exists
- **Pruning**: Early constraint checking reduces search space

## 🛠️ Technologies Used

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Styling**: Tailwind CSS 3.4.0
- **Icons**: Lucide React
- **Language**: JavaScript (ES6+)
- **Package Manager**: npm

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by various algorithm visualization tools
- Built with modern web technologies for optimal performance
- Educational content designed for computer science students

## 📞 Contact

**Shashi Kumar** - [@shashi162003](https://github.com/shashi162003)

Project Link: [https://github.com/shashi162003/AlgoVisualiser](https://github.com/shashi162003/AlgoVisualiser)

---

⭐ Star this repository if you found it helpful!
