import * as THREE from "three";

export type Move = {
  axis: "x" | "y" | "z";
  slice: number;
  dir: 1 | -1;
  isUndo?: boolean;
};

export type FaceType = "front" | "back" | "right" | "left" | "top" | "bottom";

export type RubiksCubeRef = {
  shuffle: () => void;
  reset: () => void;
  snapToFace: (face: FaceType) => void;
};
