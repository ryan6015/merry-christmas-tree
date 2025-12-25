
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../colors';

/**
 * Creates a 5-pointed star shape for the tree topper.
 */
function createStarShape(innerRadius: number, outerRadius: number) {
  const shape = new THREE.Shape();
  const points = 5;
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i / points) * Math.PI - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

const ChristmasTree: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const spiralRef = useRef<THREE.Group>(null);
  const starRef = useRef<THREE.Mesh>(null);
  
  const LEAF_COUNT = 15000;
  const ORNAMENT_COUNT = 800;
  const TRUNK_COUNT = 1500;
  const TOTAL_COUNT = LEAF_COUNT + ORNAMENT_COUNT + TRUNK_COUNT;
  
  // Timings
  const CONVERGE_DURATION = 0.5; 
  const GROWTH_START = 0.5;      
  const LINE_GROWTH_DURATION = 0.8; // Snappy 50% faster growth

  const particleData = useMemo(() => {
    const pos = new Float32Array(TOTAL_COUNT * 3);
    const initPos = new Float32Array(TOTAL_COUNT * 3);
    const colors = new Float32Array(TOTAL_COUNT * 3);
    const sizes = new Float32Array(TOTAL_COUNT);

    for (let i = 0; i < TOTAL_COUNT; i++) {
      let x = 0, y = 0, z = 0;
      let color = new THREE.Color();
      let size = 1.0;

      if (i < LEAF_COUNT) {
        const height = Math.random() * 9;
        const radiusAtHeight = 3.8 * (1 - height / 9.5);
        const angle = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 0.7) * radiusAtHeight;
        x = Math.cos(angle) * r;
        z = Math.sin(angle) * r;
        y = height - 3.5;
        color.set(COLORS.treeLeaves[Math.floor(Math.random() * COLORS.treeLeaves.length)]);
        size = Math.random() * 3.0 + 2.0; 
      } else if (i < LEAF_COUNT + ORNAMENT_COUNT) {
        const height = Math.random() * 8.5;
        const radiusAtHeight = 3.8 * (1 - height / 9.5);
        const angle = Math.random() * Math.PI * 2;
        x = Math.cos(angle) * (radiusAtHeight + (Math.random() - 0.5) * 0.3);
        z = Math.sin(angle) * (radiusAtHeight + (Math.random() - 0.5) * 0.3);
        y = height - 3.5;
        const isRed = Math.random() > 0.5;
        color.set(isRed ? '#ff1111' : '#ffdd00');
        size = 8.0 + Math.random() * 5.0; 
      } else {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * 0.5;
        x = Math.cos(angle) * r;
        z = Math.sin(angle) * r;
        y = Math.random() * 3.0 - 5.5; 
        color.set(COLORS.trunk);
        size = 3.0;
      }

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const range = 80;
      initPos[i * 3] = (Math.random() - 0.5) * range * 2;
      initPos[i * 3 + 1] = (Math.random() - 0.5) * range * 2;
      initPos[i * 3 + 2] = (Math.random() - 0.5) * range * 2;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      sizes[i] = size;
    }
    return { pos, initPos, colors, sizes };
  }, []);

  const spiralPoints = useMemo(() => {
    const points = [];
    const segments = 1200; 
    const loops = 6;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2 * loops;
      const h = (1 - t) * 8.8;
      const r = 4.0 * (1 - h / 9.5);
      points.push(new THREE.Vector3(Math.cos(angle) * r, h - 3.3, Math.sin(angle) * r));
    }
    return points;
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uConvergeTime: { value: CONVERGE_DURATION } 
  }), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      (pointsRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    }

    // Synchronized Appearance
    if (starRef.current) {
      const starProgress = THREE.MathUtils.clamp((t - GROWTH_START) * 6.0, 0, 1);
      starRef.current.scale.setScalar(starProgress);
      starRef.current.visible = t >= GROWTH_START;
    }

    if (spiralRef.current) {
      const growProgress = THREE.MathUtils.clamp((t - GROWTH_START) / LINE_GROWTH_DURATION, 0, 1);
      spiralRef.current.visible = t >= GROWTH_START;
      
      const count = Math.floor(spiralPoints.length * growProgress);
      if (count > 0) {
        const pointsArray = new Float32Array(count * 3);
        for(let i = 0; i < count; i++) {
          pointsArray[i*3] = spiralPoints[i].x;
          pointsArray[i*3+1] = spiralPoints[i].y;
          pointsArray[i*3+2] = spiralPoints[i].z;
        }
        
        // Update both the main line and the glow line
        (spiralRef.current.children[0] as THREE.Line).geometry.setAttribute('position', new THREE.BufferAttribute(pointsArray, 3));
        (spiralRef.current.children[1] as THREE.Line).geometry.setAttribute('position', new THREE.BufferAttribute(pointsArray, 3));
      }
    }
  });

  return (
    <group position-y={-0.6}>
      {/* 1. TOP STAR */}
      <mesh ref={starRef} position-y={5.8} visible={false}>
        <extrudeGeometry 
          args={[createStarShape(0.18, 0.45), { depth: 0.1, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 }]} 
        />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={12} />
        <pointLight intensity={4} distance={6} color="#ffcc00" />
      </mesh>

      {/* 2. SMOOTH SPIRAL LIGHT LINE */}
      <group ref={spiralRef} visible={false}>
        <line>
          <bufferGeometry />
          <lineBasicMaterial color="#ffff33" transparent opacity={1.0} blending={THREE.AdditiveBlending} />
        </line>
        <line scale-x={1.008} scale-z={1.008}>
          <bufferGeometry />
          <lineBasicMaterial color="#ffffff" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </line>
      </group>

      {/* 3. MAIN TREE PARTICLES */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={TOTAL_COUNT} array={particleData.pos} itemSize={3} />
          <bufferAttribute attach="attributes-initialPosition" count={TOTAL_COUNT} array={particleData.initPos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={TOTAL_COUNT} array={particleData.colors} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={TOTAL_COUNT} array={particleData.sizes} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={`
            uniform float uTime;
            uniform float uConvergeTime;
            attribute vec3 initialPosition;
            attribute float size;
            varying vec3 vColor;
            varying float vAlpha;

            void main() {
              vColor = color;
              float progress = clamp(uTime / uConvergeTime, 0.0, 1.0);
              float t = 1.0 - pow(1.0 - progress, 5.0); 
              
              float angle = (1.0 - t) * 12.56; // 2 rotations
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              
              vec3 startPos = initialPosition;
              startPos.xz = rot * startPos.xz;

              vec3 currentPos = mix(startPos, position, t);
              
              if (progress >= 1.0) {
                currentPos.x += sin(uTime * 0.4 + position.y * 0.8) * 0.05;
                currentPos.z += cos(uTime * 0.4 + position.x * 0.8) * 0.05;
              }

              vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
              gl_PointSize = size * (38.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
              vAlpha = mix(0.0, 1.0, progress);
            }
          `}
          fragmentShader={`
            varying vec3 vColor;
            varying float vAlpha;
            void main() {
              float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
              if (dist > 0.5) discard;
              float strength = pow(1.0 - dist * 2.0, 2.0);
              gl_FragColor = vec4(vColor, strength * vAlpha);
            }
          `}
        />
      </points>
    </group>
  );
};

export default ChristmasTree;
