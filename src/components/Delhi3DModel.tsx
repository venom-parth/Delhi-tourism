import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function AbstractLotus() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.2;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshPhysicalMaterial 
            color="#FF6B00" 
            metalness={0.8} 
            roughness={0.2} 
            wireframe 
          />
        </mesh>
        <mesh>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial 
            color="#E60000" 
            metalness={0.5} 
            roughness={0.6}
            transmission={0.5}
            thickness={0.5}
          />
        </mesh>
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[2.5, 0.02, 16, 100]} />
          <meshStandardMaterial color="#00E5FF" />
        </mesh>
      </Float>
    </group>
  );
}

export function Delhi3DModel() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 w-full h-full opacity-60">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#00E5FF" />
        <AbstractLotus />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
