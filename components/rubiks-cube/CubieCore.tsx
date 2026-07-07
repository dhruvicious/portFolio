"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sticker } from "./Sticker";
import {
  baseGeo,
  baseMaterial,
  getStickerColor,
  stickerMaterials,
  UNIFORM_COLOR,
} from "./constants";

export const CubieCore = ({
  x,
  y,
  z,
  N,
  isMirror,
}: {
  x: number;
  y: number;
  z: number;
  N: number;
  isMirror: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const factor = useRef(0);
  const offsetMax = (N - 1) / 2;

  const multX = offsetMax === 0 ? 0 : 0.6 / offsetMax;
  const multY = offsetMax === 0 ? 0 : 0.4 / offsetMax;
  const multZ = offsetMax === 0 ? 0 : 0.2 / offsetMax;

  const targetSizeX = (0.96 + x * multX) / 0.96;
  const targetSizeY = (0.96 + y * multY) / 0.96;
  const targetSizeZ = (0.96 + z * multZ) / 0.96;

  const targetOffsetX = offsetMax === 0 ? 0 : (0.3 / offsetMax) * Math.abs(x);
  const targetOffsetY = offsetMax === 0 ? 0 : (0.2 / offsetMax) * Math.abs(y);
  const targetOffsetZ = offsetMax === 0 ? 0 : (0.1 / offsetMax) * Math.abs(z);

  useFrame((_, delta) => {
    const target = isMirror ? 1 : 0;
    factor.current = THREE.MathUtils.lerp(
      factor.current,
      target,
      1 - Math.exp(-10 * delta)
    );

    if (groupRef.current) {
      groupRef.current.scale.set(
        THREE.MathUtils.lerp(1, targetSizeX, factor.current),
        THREE.MathUtils.lerp(1, targetSizeY, factor.current),
        THREE.MathUtils.lerp(1, targetSizeZ, factor.current)
      );

      const offX = targetOffsetX * factor.current;
      const offY = targetOffsetY * factor.current;
      const offZ = targetOffsetZ * factor.current;
      groupRef.current.position.set(offX, offY, offZ);

      groupRef.current.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          const mat = child.material;
          const hex = Object.keys(stickerMaterials).find(
            (k) => stickerMaterials[k] === mat
          );
          if (hex) {
            const baseC = getStickerColor(hex);
            mat.color.lerpColors(baseC, UNIFORM_COLOR, factor.current);
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={baseGeo} material={baseMaterial} />
      {x === offsetMax && (
        <Sticker
          position={[0.49, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          color="#FF2020"
        />
      )}
      {x === -offsetMax && (
        <Sticker
          position={[-0.49, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          color="#FF7800"
        />
      )}
      {y === offsetMax && (
        <Sticker
          position={[0, 0.49, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          color="#ffffff"
        />
      )}
      {y === -offsetMax && (
        <Sticker
          position={[0, -0.49, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          color="#FFD500"
        />
      )}
      {z === offsetMax && (
        <Sticker
          position={[0, 0, 0.49]}
          rotation={[0, 0, 0]}
          color="#00C853"
        />
      )}
      {z === -offsetMax && (
        <Sticker
          position={[0, 0, -0.49]}
          rotation={[0, Math.PI, 0]}
          color="#2962FF"
        />
      )}
    </group>
  );
};
