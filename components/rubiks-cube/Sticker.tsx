import { stickerGeo, getStickerMaterial } from "./constants";

export const Sticker = ({
  position,
  rotation,
  color,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}) => (
  <group position={position} rotation={rotation}>
    <mesh geometry={stickerGeo} material={getStickerMaterial(color)} />
  </group>
);
