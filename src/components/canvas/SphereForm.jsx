import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import CanvasLoader from '../Loader';

const AnimatedSphere = () => {
    const sphereRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);

    useFrame((state, delta) => {
        sphereRef.current.rotation.x += delta * 0.2;
        sphereRef.current.rotation.y += delta * 0.3;
    });

    return (
        <Sphere
            ref={sphereRef}
            args={[1, 100, 200]}
            scale={clicked ? 1.5 : 1}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={() => setClicked(!clicked)}
        >
            <MeshDistortMaterial
                color={hovered ? "#ff69b4" : "#4a90e2"}
                attach="material"
                distort={0.3}
                speed={1.5}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    );
};

const SphereCanvas = () => {
    return (
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={<CanvasLoader />}>
                <AnimatedSphere />
            </Suspense>
        </Canvas>
    );
};

export default SphereCanvas;