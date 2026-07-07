import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";

export const UNIFORM_COLOR = new THREE.Color("#aaaaaa");

export const baseMaterial = new THREE.MeshStandardMaterial({
  color: "#1a1a1a",
  roughness: 0.7,
  metalness: 0.2,
});

export const baseGeo = new RoundedBoxGeometry(0.96, 0.96, 0.96, 4, 0.08);
export const stickerGeo = new RoundedBoxGeometry(0.82, 0.82, 0.02, 4, 0.06);

export const stickerMaterials: Record<string, THREE.MeshStandardMaterial> = {};
export const getStickerMaterial = (hex: string) => {
  if (!stickerMaterials[hex]) {
    stickerMaterials[hex] = new THREE.MeshStandardMaterial({
      color: hex,
      roughness: 0.15,
      metalness: 0.1,
    });
  }
  return stickerMaterials[hex];
};

export const getStickerColor = (hex: string) => new THREE.Color(hex);

export let globalCubieId = 0;
export const getInitialCubies = (N: number) => {
  const cubies: { id: number; x: number; y: number; z: number }[] = [];
  const offset = (N - 1) / 2;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      for (let k = 0; k < N; k++) {
        cubies.push({
          id: globalCubieId++,
          x: i - offset,
          y: j - offset,
          z: k - offset,
        });
      }
    }
  }
  return cubies;
};

export const RENDER_POOL = Array.from({ length: 216 }, (_, i) => i);

export const getClosestSlice = (val: number, N: number) => {
  const offset = (N - 1) / 2;
  let i = Math.round(val + offset);
  i = Math.max(0, Math.min(N - 1, i));
  return i - offset;
};
