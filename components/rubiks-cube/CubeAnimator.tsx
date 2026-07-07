"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ContactShadows } from "@react-three/drei";

export function CubeAnimator({
  isExpanded,
  scrollProgress,
  children,
  onExpand,
}: {
  isExpanded: boolean;
  scrollProgress?: React.MutableRefObject<number>;
  children: React.ReactNode;
  onExpand?: () => void;
}) {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const cameraDistance = state.camera.position.length();
    const aspect = state.size.width / state.size.height;
    const vFov = (45 * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(vFov / 2) * cameraDistance; 
    const visibleWidth = visibleHeight * aspect;
    const leftEdge = -visibleWidth / 2;
    const padding = 0.6 * (cameraDistance / 6);
    let targetScale = 0.65;
    let targetPosWorld = new THREE.Vector3(0, 0, 0);

    if (scrollProgress && !isExpanded) {
      const p = scrollProgress.current;
      let targetX_local = 0;
      if (p > 0.4 && p < 0.6) {
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.005;
        targetScale = hovered ? 0.1 : 0.08 + pulse;
        targetX_local = leftEdge + padding;
      } else {
        targetScale = 0.08;
        targetX_local = leftEdge - 1.5;
      }
      targetPosWorld.set(targetX_local, 0, -cameraDistance).applyMatrix4(state.camera.matrixWorld);
      groupRef.current.rotation.x += delta * 2.5;
      groupRef.current.rotation.y += delta * 3.5;
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
    }
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    groupRef.current.position.lerp(targetPosWorld, 0.1);
  });

  return (
    <group ref={groupRef}>
      <group
        onClick={(e) => {
          if (!isExpanded && onExpand && groupRef.current && groupRef.current.scale.x > 0.01) {
            e.stopPropagation();
            onExpand();
            document.body.style.cursor = "auto";
          }
        }}
        onPointerOver={(e) => {
          if (!isExpanded) {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            setHovered(true);
          }
        }}
        onPointerOut={(e) => {
          if (!isExpanded) {
            e.stopPropagation();
            document.body.style.cursor = "auto";
            setHovered(false);
          }
        }}
      >
        {children}
      </group>
      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.6}
        scale={20}
        blur={2}
        far={4.5}
      />
    </group>
  );
}
