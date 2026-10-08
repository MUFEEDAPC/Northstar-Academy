import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function KnowledgeCore({ onReady }) {
  const group = useRef();
  const hasRendered = useRef(false);
  const handleAfterRender = () => {
    if (hasRendered.current) return;
    hasRendered.current = true;
    onReady?.();
  };
  useFrame((state, delta) => {
    if (!group.current) return;
    const { pointer } = state;
    group.current.rotation.y += delta * 0.1;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.y * 0.16, 2, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -pointer.x * 0.1, 2, delta);
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, pointer.x * 0.15, 2, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, pointer.y * 0.13, 2, delta);
  });
  return <group ref={group}>
    <mesh onAfterRender={handleAfterRender}><sphereGeometry args={[1, 36, 36]} /><meshPhysicalMaterial color="#c9efff" roughness={0.25} metalness={0.08} transmission={0.25} thickness={0.5} transparent opacity={0.8} /></mesh>
    <mesh><sphereGeometry args={[0.78, 24, 24]} /><meshBasicMaterial color="#78c8f6" wireframe transparent opacity={0.38} /></mesh>
    <mesh rotation={[0.48, 0.3, 0.2]}><torusGeometry args={[1.2, 0.008, 6, 96]} /><meshBasicMaterial color="#589fe4" transparent opacity={0.65} /></mesh>
    <mesh rotation={[1.1, -0.3, 0.8]}><torusGeometry args={[1.32, 0.006, 6, 96]} /><meshBasicMaterial color="#a2c9f4" transparent opacity={0.55} /></mesh>
    {[[-.25,.25,.74],[.4,.2,.64],[.1,-.48,.71],[-.62,-.15,.38],[.62,-.23,.45]].map((p,i)=><mesh key={i} position={p}><sphereGeometry args={[0.035,8,8]} /><meshBasicMaterial color={i%2?'#6c73e8':'#51c6d8'} /></mesh>)}
  </group>;
}

function OrbitItem({ position, active, index }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + index) * 0.035;
    const target = active ? 1.12 : 1;
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, target, 7, delta));
    ref.current.rotation.y += delta * 0.08;
  });
  return <group ref={ref} position={position}>
    {index === 0 || index === 3
      ? <mesh><boxGeometry args={[.39,.31,.1]} /><meshPhysicalMaterial color="white" roughness={.28} metalness={.05} /></mesh>
      : <mesh><icosahedronGeometry args={[.24,1]} /><meshPhysicalMaterial color="white" roughness={.3} metalness={.12} /></mesh>}
  </group>;
}

function Network({ small }) {
  const dots = useMemo(() => Array.from({ length: small ? 18 : 30 }, (_, i) => ({
    position: [(Math.random() - .5) * 5, (Math.random() - .5) * 3.8, (Math.random() - .5) * 1.4],
    scale: Math.random() * .018 + .012,
    key: i,
  })), [small]);
  return <group>{dots.map((dot) => <mesh key={dot.key} position={dot.position}><sphereGeometry args={[dot.scale,5,5]} /><meshBasicMaterial color={dot.key%4===0?'#65b8db':'#a1bdd9'} transparent opacity={.62} /></mesh>)}</group>;
}

function Scene({ activeTopic, small, onReady }) {
  const items = [
    [-1.7,.75,.1], [1.65,.78,-.15], [1.85,-.72,.1], [-1.65,-.7,-.25], [0,1.65,-.35],
  ];
  return <>
    <ambientLight intensity={1.8} /><pointLight position={[3,3,4]} intensity={24} color="#a7dbff" /><pointLight position={[-3,-2,2]} intensity={16} color="#b9b7ff" />
    <Network small={small} /><KnowledgeCore onReady={onReady} />
    {items.map((position, index) => <OrbitItem key={index} position={position} active={activeTopic === index} index={index} />)}
  </>;
}

export default function HeroExperience({ activeTopic, onReady, onFailure }) {
  const [small, setSmall] = useState(false);
  const [canvas, setCanvas] = useState(null);
  React.useEffect(() => {
    const query = window.matchMedia('(max-width: 900px)');
    const update = () => setSmall(query.matches);
    update(); query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  React.useEffect(() => {
    if (!canvas) return;
    const handleContextLost = (event) => {
      event.preventDefault();
      onFailure?.();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    return () => canvas.removeEventListener('webglcontextlost', handleContextLost);
  }, [canvas, onFailure]);
  return <>
    <Canvas camera={{position:[0,0,6],fov:40}} dpr={small?1:[1,1.35]} frameloop="always" gl={{antialias:!small,alpha:true,powerPreference:'low-power'}} onCreated={({ gl })=>setCanvas(gl.domElement)}>
      <Scene activeTopic={activeTopic} small={small} onReady={onReady} />
    </Canvas>
  </>;
}
