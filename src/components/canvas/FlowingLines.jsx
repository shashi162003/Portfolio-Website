import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import CanvasLoader from '../Loader';

const FlowingLines = () => {
    const ref = useRef();

    const positions = useMemo(() => {
        const points = [];
        const numLines = 50;
        const lineLength = 5;

        for (let i = 0; i < numLines; i++) {
            const startX = Math.random() * 10 - 5;
            const startY = Math.random() * 10 - 5;
            const startZ = Math.random() * 10 - 5;
            for (let j = 0; j < lineLength; j++) {
                points.push(new THREE.Vector3(startX, startY + j * 0.1, startZ));
            }
        }
        return points;
    }, []);

    const colors = useMemo(() => {
        const colorArray = [];
        const color1 = new THREE.Color("#00ffff"); // Cyan
        const color2 = new THREE.Color("#ff00ff"); // Magenta
        const color3 = new THREE.Color("#ffff00"); // Yellow

        for (let i = 0; i < positions.length; i++) {
            if (i % 3 === 0) {
                color1.toArray(colorArray, i * 3);
            } else if (i % 3 === 1) {
                color2.toArray(colorArray, i * 3);
            } else {
                color3.toArray(colorArray, i * 3);
            }
        }
        return new Float32Array(colorArray);
    }, [positions]);

    useFrame((state) => {
        if (ref.current) {
            // Basic animation: move lines along Z-axis
            ref.current.position.z += 0.005;
            if (ref.current.position.z > 5) {
                ref.current.position.z = -5; // Reset position for continuous flow
            }
        }
    });

    return (
        <group ref={ref}>
            <Line
                points={positions} // Use the generated positions
                color="#00ffff"
                lineWidth={1}
                dashed={false}
                vertexColors={colors} // Apply vertex colors for gradient effect
            />
        </group>
    );
};

const FlowingLinesCanvas = () => {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <color attach="background" args={['#000000']} />
            <Suspense fallback={<CanvasLoader />}>
                <FlowingLines />
            </Suspense>
        </Canvas>
    );
};

export default FlowingLinesCanvas;