import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { useMousePosition } from '../../hooks/useMousePosition';
import CanvasLoader from '../Loader';

const Grid = () => {
    const gridRef = useRef();
    const { viewport } = useThree();
    const mouse = useMousePosition();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        gridRef.current.rotation.x = Math.PI / 4;
        gridRef.current.rotation.z = time * 0.05;

        // Mouse interaction
        if (mouse.current) {
            const x = (mouse.current.x / viewport.width) * 2 - 1;
            const y = (mouse.current.y / viewport.height) * 2 - 1;
            gridRef.current.position.x = x * 0.5;
            gridRef.current.position.y = y * 0.5;
        }
    });

    return (
        <group ref={gridRef}>
            {Array.from({ length: 20 }).map((_, i) => (
                <mesh key={i} position={[0, 0, -i * 0.5]}>
                    <planeGeometry args={[20, 20, 20, 20]} />
                    <meshBasicMaterial
                        color="#00ff88"
                        wireframe
                        transparent
                        opacity={0.2}
                    />
                </mesh>
            ))}
        </group>
    );
};

const GridCanvas = () => {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <color attach="background" args={['#000000']} />
            <Suspense fallback={<CanvasLoader />}>
                <Grid />
                <EffectComposer>
                    <Bloom
                        intensity={1.5}
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.9}
                        height={300}
                    />
                    <Noise opacity={0.02} />
                </EffectComposer>
            </Suspense>
        </Canvas>
    );
};

export default GridCanvas;