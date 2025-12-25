
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Atmosphere: React.FC = () => {
  const COUNT = 6000; // Even denser snowfall
  const meshRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;     
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60; 
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60; 
      
      sizes[i] = Math.random() * 2.5 + 1.5;
      seeds[i] = Math.random() * 100;
    }

    return { positions, sizes, seeds };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#ffffff') }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={COUNT} array={particles.sizes} itemSize={1} />
        <bufferAttribute attach="attributes-seed" count={COUNT} array={particles.seeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          attribute float size;
          attribute float seed;
          void main() {
            vec3 pos = position;
            
            float fallSpeed = 1.5 + fract(seed * 0.1) * 2.0;
            pos.y -= uTime * fallSpeed;
            
            pos.y = mod(pos.y + 30.0, 60.0) - 30.0;
            
            pos.x += sin(uTime * 0.4 + seed) * 1.2;
            pos.z += cos(uTime * 0.2 + seed) * 1.2;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            float twinkle = sin(uTime * 1.5 + seed) * 0.4 + 0.6;
            
            gl_PointSize = size * (45.0 / -mvPosition.z) * twinkle;
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          void main() {
            float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
            if (dist > 0.5) discard;
            float strength = 1.0 - dist * 2.0;
            gl_FragColor = vec4(uColor, strength * 0.9);
          }
        `}
      />
    </points>
  );
};

export default Atmosphere;
