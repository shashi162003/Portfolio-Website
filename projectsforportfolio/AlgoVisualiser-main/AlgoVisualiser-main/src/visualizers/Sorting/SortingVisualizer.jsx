import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Settings, BarChart3 } from 'lucide-react';

// Generate random array
function generateArray(size) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push({
            value: Math.floor(Math.random() * 500) + 10,
            id: i
        });
    }
    return array;
}

// Bubble Sort
async function bubbleSort(array, onStep, shouldStop) {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;
    let stepCount = 0;
    const totalSteps = n * n;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (shouldStop()) return arr;

            comparisons++;
            stepCount++;

            await onStep({
                array: [...arr],
                comparing: [j, j + 1],
                comparisons,
                swaps,
                progress: Math.min(100, (stepCount / totalSteps * 100)).toFixed(1)
            });

            if (arr[j].value > arr[j + 1].value) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swaps++;
                stepCount++;

                await onStep({
                    array: [...arr],
                    swapping: [j, j + 1],
                    comparisons,
                    swaps,
                    progress: Math.min(100, (stepCount / totalSteps * 100)).toFixed(1)
                });
            }

            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    await onStep({
        array: [...arr],
        comparisons,
        swaps,
        progress: '100.0',
        completed: true
    });

    return arr;
}

// Quick Sort
async function quickSort(array, onStep, shouldStop) {
    const arr = [...array];
    let comparisons = 0;
    let swaps = 0;
    let stepCount = 0;
    const totalSteps = arr.length * Math.log2(arr.length) * 2;

    async function partition(low, high) {
        if (shouldStop()) return -1;

        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (shouldStop()) return -1;

            comparisons++;
            stepCount++;

            await onStep({
                array: [...arr],
                comparing: [j, high],
                comparisons,
                swaps,
                progress: Math.min(100, (stepCount / totalSteps * 100)).toFixed(1)
            });

            if (arr[j].value < pivot.value) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                swaps++;
                stepCount++;

                await onStep({
                    array: [...arr],
                    swapping: [i, j],
                    comparisons,
                    swaps,
                    progress: Math.min(100, (stepCount / totalSteps * 100)).toFixed(1)
                });
            }

            await new Promise(resolve => setTimeout(resolve, 30));
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        swaps++;
        return i + 1;
    }

    async function quickSortHelper(low, high) {
        if (low < high && !shouldStop()) {
            const pi = await partition(low, high);
            if (pi !== -1) {
                await quickSortHelper(low, pi - 1);
                await quickSortHelper(pi + 1, high);
            }
        }
    }

    await quickSortHelper(0, arr.length - 1);

    if (!shouldStop()) {
        await onStep({
            array: [...arr],
            comparisons,
            swaps,
            progress: '100.0',
            completed: true
        });
    }

    return arr;
}

// Merge Sort
async function mergeSort(array, onStep, shouldStop) {
    const arr = [...array];
    let comparisons = 0;
    let merges = 0;
    let stepCount = 0;
    const totalSteps = arr.length * Math.log2(arr.length);

    async function merge(left, mid, right) {
        if (shouldStop()) return;

        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        let i = 0, j = 0, k = left;

        while (i < leftArr.length && j < rightArr.length && !shouldStop()) {
            comparisons++;
            stepCount++;

            await onStep({
                array: [...arr],
                comparing: [left + i, mid + 1 + j],
                comparisons,
                merges,
                progress: Math.min(100, (stepCount / totalSteps * 100)).toFixed(1)
            });

            if (leftArr[i].value <= rightArr[j].value) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            k++;
            merges++;

            await new Promise(resolve => setTimeout(resolve, 20));
        }

        while (i < leftArr.length && !shouldStop()) {
            arr[k] = leftArr[i];
            i++;
            k++;
            merges++;
        }

        while (j < rightArr.length && !shouldStop()) {
            arr[k] = rightArr[j];
            j++;
            k++;
            merges++;
        }
    }

    async function mergeSortHelper(left, right) {
        if (left < right && !shouldStop()) {
            const mid = Math.floor((left + right) / 2);
            await mergeSortHelper(left, mid);
            await mergeSortHelper(mid + 1, right);
            await merge(left, mid, right);
        }
    }

    await mergeSortHelper(0, arr.length - 1);

    if (!shouldStop()) {
        await onStep({
            array: [...arr],
            comparisons,
            merges,
            progress: '100.0',
            completed: true
        });
    }

    return arr;
}

// Selection Sort
async function selectionSort(array, onStep, shouldStop) {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;
    let stepCount = 0;
    const totalSteps = n * n;

    for (let i = 0; i < n - 1; i++) {
        if (shouldStop()) return arr;

        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
            if (shouldStop()) return arr;

            comparisons++;
            stepCount++;

            await onStep({
                array: [...arr],
                comparing: [minIndex, j],
                comparisons,
                swaps,
                progress: Math.min(100, (stepCount / totalSteps * 100)).toFixed(1)
            });

            if (arr[j].value < arr[minIndex].value) {
                minIndex = j;
            }

            await new Promise(resolve => setTimeout(resolve, 40));
        }

        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            swaps++;
            stepCount++;

            await onStep({
                array: [...arr],
                swapping: [i, minIndex],
                comparisons,
                swaps,
                progress: Math.min(100, (stepCount / totalSteps * 100)).toFixed(1)
            });
        }
    }

    if (!shouldStop()) {
        await onStep({
            array: [...arr],
            comparisons,
            swaps,
            progress: '100.0',
            completed: true
        });
    }

    return arr;
}

// Insertion Sort
async function insertionSort(array, onStep, shouldStop) {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;
    let stepCount = 0;
    const totalSteps = n * n;

    for (let i = 1; i < n; i++) {
        if (shouldStop()) return arr;

        const key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j].value > key.value && !shouldStop()) {
            comparisons++;
            stepCount++;

            await onStep({
                array: [...arr],
                comparing: [j, j + 1],
                comparisons,
                swaps,
                progress: Math.min(100, (stepCount / totalSteps * 100)).toFixed(1)
            });

            arr[j + 1] = arr[j];
            j--;
            swaps++;
            stepCount++;

            await onStep({
                array: [...arr],
                swapping: [j + 1, j + 2],
                comparisons,
                swaps,
                progress: Math.min(100, (stepCount / totalSteps * 100)).toFixed(1)
            });

            await new Promise(resolve => setTimeout(resolve, 60));
        }

        arr[j + 1] = key;
    }

    if (!shouldStop()) {
        await onStep({
            array: [...arr],
            comparisons,
            swaps,
            progress: '100.0',
            completed: true
        });
    }

    return arr;
}

// Heap Sort
async function heapSort(array, onStep, shouldStop) {
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;
    let stepCount = 0;
    const totalSteps = n * Math.log2(n);

    async function heapify(n, i) {
        if (shouldStop()) return;

        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n) {
            comparisons++;
            if (arr[left].value > arr[largest].value) {
                largest = left;
            }
        }

        if (right < n) {
            comparisons++;
            if (arr[right].value > arr[largest].value) {
                largest = right;
            }
        }

        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            swaps++;
            stepCount++;

            await onStep({
                array: [...arr],
                swapping: [i, largest],
                comparisons,
                swaps,
                progress: Math.min(100, (stepCount / totalSteps * 100)).toFixed(1)
            });

            await new Promise(resolve => setTimeout(resolve, 25));
            await heapify(n, largest);
        }
    }

    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        if (shouldStop()) return arr;

        [arr[0], arr[i]] = [arr[i], arr[0]];
        swaps++;
        stepCount++;

        await onStep({
            array: [...arr],
            swapping: [0, i],
            comparisons,
            swaps,
            progress: Math.min(100, (stepCount / totalSteps * 100)).toFixed(1)
        });

        await heapify(i, 0);
    }

    if (!shouldStop()) {
        await onStep({
            array: [...arr],
            comparisons,
            swaps,
            progress: '100.0',
            completed: true
        });
    }

    return arr;
}

const algorithms = [
    { name: 'Bubble Sort', color: '#ef4444', func: bubbleSort },
    { name: 'Selection Sort', color: '#f97316', func: selectionSort },
    { name: 'Insertion Sort', color: '#eab308', func: insertionSort },
    { name: 'Merge Sort', color: '#8b5cf6', func: mergeSort },
    { name: 'Quick Sort', color: '#10b981', func: quickSort },
    { name: 'Heap Sort', color: '#06b6d4', func: heapSort }
];

function SortingVisualizer() {
    const [originalArray, setOriginalArray] = useState([]);
    const [sortingStates, setSortingStates] = useState({});
    const [isRunning, setIsRunning] = useState(false);
    const [arraySize, setArraySize] = useState(100);
    const [message, setMessage] = useState('Click "Generate Array" to create a random array to sort!');

    // Generate new array
    const generateNewArray = () => {
        const newArray = generateArray(arraySize);
        setOriginalArray(newArray);
        setSortingStates({});
        setMessage(`Generated array with ${arraySize} elements. Ready to sort!`);
    };

    // Initialize with array on mount
    useEffect(() => {
        generateNewArray();
    }, [arraySize]);

    // Start sorting
    const startSorting = async () => {
        if (originalArray.length === 0) return;

        setIsRunning(true);
        setSortingStates({});
        setMessage('Sorting in progress...');

        // Run all algorithms in parallel
        const promises = algorithms.map(async (algorithm) => {
            const onStep = async (step) => {
                setSortingStates(prev => ({
                    ...prev,
                    [algorithm.name]: step
                }));
            };

            return algorithm.func([...originalArray], onStep, () => false);
        });

        try {
            await Promise.all(promises);
            setMessage('All sorting algorithms completed!');
        } catch (error) {
            setMessage('Sorting completed');
        }

        setIsRunning(false);
    };



    // Render bar chart visualization
    const renderVisualization = (algorithmName) => {
        const algorithm = algorithms.find(a => a.name === algorithmName);
        const state = sortingStates[algorithmName];
        const array = state?.array || originalArray;

        return (
            <div key={algorithmName} className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold" style={{ color: algorithm.color }}>
                        {algorithmName}
                    </h3>
                    {state && (
                        <div className="text-sm font-medium text-gray-600">
                            {state.progress}% Complete
                        </div>
                    )}
                </div>

                <div className="relative">
                    <svg width="420" height="320" className="border border-gray-300 rounded-lg bg-gray-50">
                        {array.map((item, index) => {
                            const padding = 10;
                            const chartWidth = 420 - (padding * 2);
                            const chartHeight = 320 - (padding * 2);
                            const barWidth = chartWidth / array.length;
                            const barHeight = (item.value / 500) * chartHeight;
                            const x = padding + (index * barWidth);
                            const y = 320 - padding - barHeight;

                            let fillColor = '#94a3b8'; // Default gray

                            // Completed elements (highest priority)
                            if (state?.completed) {
                                fillColor = '#10b981'; // Green for completed
                            }
                            // Highlight swapping elements
                            else if (state?.swapping && state.swapping.includes(index)) {
                                fillColor = algorithm.color; // Algorithm color for swapping
                            }
                            // Highlight comparing elements (only if not completed)
                            else if (state?.comparing && state.comparing.includes(index) && !state?.completed) {
                                fillColor = '#fbbf24'; // Yellow for comparing
                            }

                            return (
                                <rect
                                    key={item.id}
                                    x={x}
                                    y={y}
                                    width={Math.max(1, barWidth - 2)}
                                    height={barHeight}
                                    fill={fillColor}
                                    stroke="#e5e7eb"
                                    strokeWidth="0.5"
                                    rx="1"
                                />
                            );
                        })}
                    </svg>
                </div>

                {state && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex justify-between">
                                <span>Comparisons:</span>
                                <span className="font-medium">{state.comparisons?.toLocaleString() || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Swaps:</span>
                                <span className="font-medium">{state.swaps?.toLocaleString() || 0}</span>
                            </div>
                            {state.merges && (
                                <div className="flex justify-between">
                                    <span>Merges:</span>
                                    <span className="font-medium">{state.merges?.toLocaleString() || 0}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                    <h1 className="text-4xl font-bold text-gray-900">Sorting Algorithms</h1>
                </div>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Watch different sorting algorithms compete to sort the same array!
                    See how Bubble Sort, Quick Sort, and Merge Sort compare in real-time with visual bar charts.
                </p>
            </div>

            <div className="card">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-center space-x-4">
                        <Settings className="w-5 h-5 text-gray-600" />
                        <label className="text-sm font-medium text-gray-700">Array Size:</label>
                        <select
                            value={arraySize}
                            onChange={(e) => setArraySize(parseInt(e.target.value))}
                            disabled={isRunning}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={50}>Small (50 elements)</option>
                            <option value={100}>Medium (100 elements)</option>
                            <option value={200}>Large (200 elements)</option>
                            <option value={300}>Extra Large (300 elements)</option>
                        </select>

                        <button
                            onClick={generateNewArray}
                            disabled={isRunning}
                            className="btn-secondary flex items-center space-x-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Generate Array</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={startSorting}
                            disabled={originalArray.length === 0 || isRunning}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <Play className="w-4 h-4" />
                            <span>{isRunning ? 'Sorting...' : 'Start Sorting'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <p className="text-gray-700">{message}</p>
                </div>
            </div>

            {/* Original Array Visualization */}
            {originalArray.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Original Unsorted Array</h3>
                    <div className="relative">
                        <svg width="420" height="220" className="border border-gray-300 rounded-lg bg-gray-50">
                            {originalArray.map((item, index) => {
                                const padding = 10;
                                const chartWidth = 420 - (padding * 2);
                                const chartHeight = 220 - (padding * 2);
                                const barWidth = chartWidth / originalArray.length;
                                const barHeight = (item.value / 500) * chartHeight;
                                const x = padding + (index * barWidth);
                                const y = 220 - padding - barHeight;

                                return (
                                    <rect
                                        key={item.id}
                                        x={x}
                                        y={y}
                                        width={Math.max(1, barWidth - 2)}
                                        height={barHeight}
                                        fill="#6b7280"
                                        stroke="#e5e7eb"
                                        strokeWidth="0.5"
                                        rx="1"
                                    />
                                );
                            })}
                        </svg>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                        Array with {originalArray.length} elements (values from 10 to 510)
                    </div>
                </div>
            )}

            {/* Sorting Visualizations */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                    Sorting Algorithm Comparison - All 6 Algorithms
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {algorithms.map(algorithm => renderVisualization(algorithm.name))}
                </div>

                {/* Legend */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Algorithm Performance Legend</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                            <span>Comparing elements</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                            <span>Swapping elements</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span>Sorting completed</span>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-600">
                        <p><strong>Time Complexities:</strong></p>
                        <p>• Bubble Sort: O(n²) • Selection Sort: O(n²) • Insertion Sort: O(n²)</p>
                        <p>• Merge Sort: O(n log n) • Quick Sort: O(n log n) avg • Heap Sort: O(n log n)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SortingVisualizer;
