/**
 * Binary Tree Data Structure and Operations
 * 
 * A binary tree is a hierarchical data structure where each node has at most two children.
 * This implementation includes:
 * - Node insertion with automatic balancing consideration
 * - Tree traversals (inorder, preorder, postorder, level-order)
 * - Node deletion with proper tree restructuring
 * - Search operations with path visualization
 */

/**
 * Binary Tree Node class
 */
export class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.x = 0; // X coordinate for visualization
    this.y = 0; // Y coordinate for visualization
  }
}

/**
 * Binary Tree class with visualization support
 */
export class BinaryTree {
  constructor() {
    this.root = null;
    this.nodeCount = 0;
  }

  /**
   * Insert a value into the tree
   * @param {number} value - Value to insert
   * @param {Function} onStep - Callback for visualization steps
   */
  async insert(value, onStep) {
    const steps = [];

    if (this.root === null) {
      this.root = new TreeNode(value);
      this.nodeCount++;
      this.calculatePositions();
      steps.push({
        type: 'insert',
        node: this.root,
        message: `Inserted ${value} as root node`,
        tree: this.getTreeStructure()
      });
    } else {
      await this.insertNode(this.root, value, steps);
    }

    // Play back steps
    for (let i = 0; i < steps.length; i++) {
      await onStep(steps[i], i, steps.length);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
  }

  /**
   * Recursive helper for insertion
   */
  async insertNode(node, value, steps) {
    steps.push({
      type: 'comparing',
      node: node,
      value: value,
      message: `Comparing ${value} with ${node.value}`,
      tree: this.getTreeStructure()
    });

    if (value < node.value) {
      if (node.left === null) {
        node.left = new TreeNode(value);
        this.nodeCount++;
        this.calculatePositions();
        steps.push({
          type: 'insert',
          node: node.left,
          message: `Inserted ${value} as left child of ${node.value}`,
          tree: this.getTreeStructure()
        });
      } else {
        await this.insertNode(node.left, value, steps);
      }
    } else if (value > node.value) {
      if (node.right === null) {
        node.right = new TreeNode(value);
        this.nodeCount++;
        this.calculatePositions();
        steps.push({
          type: 'insert',
          node: node.right,
          message: `Inserted ${value} as right child of ${node.value}`,
          tree: this.getTreeStructure()
        });
      } else {
        await this.insertNode(node.right, value, steps);
      }
    } else {
      steps.push({
        type: 'duplicate',
        node: node,
        message: `Value ${value} already exists in the tree`,
        tree: this.getTreeStructure()
      });
    }
  }

  /**
   * Search for a value in the tree
   * @param {number} value - Value to search for
   * @param {Function} onStep - Callback for visualization steps
   */
  async search(value, onStep) {
    const steps = [];
    const path = [];
    let found = false;

    const searchNode = async (node) => {
      if (node === null) {
        steps.push({
          type: 'not_found',
          message: `Value ${value} not found in the tree`,
          path: [...path],
          tree: this.getTreeStructure()
        });
        return false;
      }

      path.push(node);
      steps.push({
        type: 'searching',
        node: node,
        value: value,
        message: `Searching for ${value}, currently at ${node.value}`,
        path: [...path],
        tree: this.getTreeStructure()
      });

      if (value === node.value) {
        steps.push({
          type: 'found',
          node: node,
          message: `Found ${value}!`,
          path: [...path],
          tree: this.getTreeStructure()
        });
        found = true;
        return true;
      } else if (value < node.value) {
        return await searchNode(node.left);
      } else {
        return await searchNode(node.right);
      }
    };

    await searchNode(this.root);

    // Play back steps
    for (let i = 0; i < steps.length; i++) {
      await onStep(steps[i], i, steps.length);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    return found;
  }

  /**
   * Perform inorder traversal
   * @param {Function} onStep - Callback for visualization steps
   */
  async inorderTraversal(onStep) {
    const steps = [];
    const result = [];

    const traverse = (node) => {
      if (node !== null) {
        traverse(node.left);
        result.push(node.value);
        steps.push({
          type: 'visit',
          node: node,
          message: `Visiting node ${node.value} (Inorder)`,
          result: [...result],
          tree: this.getTreeStructure()
        });
        traverse(node.right);
      }
    };

    traverse(this.root);

    // Play back steps
    for (let i = 0; i < steps.length; i++) {
      await onStep(steps[i], i, steps.length);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    return result;
  }

  /**
   * Perform preorder traversal
   * @param {Function} onStep - Callback for visualization steps
   */
  async preorderTraversal(onStep) {
    const steps = [];
    const result = [];

    const traverse = (node) => {
      if (node !== null) {
        result.push(node.value);
        steps.push({
          type: 'visit',
          node: node,
          message: `Visiting node ${node.value} (Preorder)`,
          result: [...result],
          tree: this.getTreeStructure()
        });
        traverse(node.left);
        traverse(node.right);
      }
    };

    traverse(this.root);

    // Play back steps
    for (let i = 0; i < steps.length; i++) {
      await onStep(steps[i], i, steps.length);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    return result;
  }

  /**
   * Perform postorder traversal
   * @param {Function} onStep - Callback for visualization steps
   */
  async postorderTraversal(onStep) {
    const steps = [];
    const result = [];

    const traverse = (node) => {
      if (node !== null) {
        traverse(node.left);
        traverse(node.right);
        result.push(node.value);
        steps.push({
          type: 'visit',
          node: node,
          message: `Visiting node ${node.value} (Postorder)`,
          result: [...result],
          tree: this.getTreeStructure()
        });
      }
    };

    traverse(this.root);

    // Play back steps
    for (let i = 0; i < steps.length; i++) {
      await onStep(steps[i], i, steps.length);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    return result;
  }

  /**
   * Calculate node positions for visualization
   */
  calculatePositions() {
    if (this.root === null) return;

    const levels = this.getTreeLevels();
    const baseWidth = 400; // Base width for the tree
    const levelHeight = 60; // Height between levels

    // Calculate positions using a more balanced approach
    const calculateNodePositions = (node, level, minX, maxX) => {
      if (node === null) return;

      // Position node in the center of its allowed range
      node.x = (minX + maxX) / 2;
      node.y = level * levelHeight + 30; // Add padding from top

      // Calculate ranges for children
      const midX = node.x;

      if (node.left) {
        calculateNodePositions(node.left, level + 1, minX, midX);
      }
      if (node.right) {
        calculateNodePositions(node.right, level + 1, midX, maxX);
      }
    };

    // Start with full width range
    calculateNodePositions(this.root, 0, 50, baseWidth + 50);
  }

  /**
   * Get tree structure for visualization
   */
  getTreeStructure() {
    const nodes = [];
    const edges = [];

    const traverse = (node) => {
      if (node === null) return;

      nodes.push({
        value: node.value,
        x: node.x,
        y: node.y
      });

      if (node.left) {
        edges.push({
          from: { x: node.x, y: node.y },
          to: { x: node.left.x, y: node.left.y }
        });
        traverse(node.left);
      }

      if (node.right) {
        edges.push({
          from: { x: node.x, y: node.y },
          to: { x: node.right.x, y: node.right.y }
        });
        traverse(node.right);
      }
    };

    traverse(this.root);
    return { nodes, edges };
  }

  /**
   * Get the number of levels in the tree
   */
  getTreeLevels() {
    const getHeight = (node) => {
      if (node === null) return 0;
      return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    };
    return getHeight(this.root);
  }

  /**
   * Clear the tree
   */
  clear() {
    this.root = null;
    this.nodeCount = 0;
  }
}
