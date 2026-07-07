"use client";

import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, TrackballControls, PerspectiveCamera } from "@react-three/drei";
import type { TrackballControls as TrackballControlsImpl } from "three-stdlib";
import { ArrowLeftRight, Shuffle, X, Box } from "lucide-react";
import styles from "./rubiks-cube.module.css";
import { FaceType, RubiksCubeRef } from "./types";
import { RubiksCubeModel } from "./RubiksCubeModel";
import { CubeAnimator } from "./CubeAnimator";

export function RubiksCube({
  transparent = false,
  fullscreen = false,
  interactive = true,
  isExpanded = true,
  onExpand,
  onClose,
  scrollProgress,
}: {
  transparent?: boolean;
  fullscreen?: boolean;
  interactive?: boolean;
  isExpanded?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
  scrollProgress?: React.MutableRefObject<number>;
}) {
  const cubeRef = useRef<RubiksCubeRef>(null);
  const controlsRef = useRef<TrackballControlsImpl>(null);

  const MODES = [
    { label: "3x3", N: 3, mirror: false },
    { label: "Mirror", N: 3, mirror: true },
    { label: "4x4", N: 4, mirror: false },
    { label: "5x5", N: 5, mirror: false },
    { label: "6x6", N: 6, mirror: false },
  ];
  const [modeIdx, setModeIdx] = useState(0);
  const currentMode = MODES[modeIdx];

  const faceButtons: { face: FaceType; color: string }[] = [
    { face: "front", color: "#00C853" },
    { face: "right", color: "#FF2020" },
    { face: "back", color: "#2962FF" },
    { face: "left", color: "#FF7800" },
    { face: "top", color: "#ffffff" },
    { face: "bottom", color: "#FFD500" },
  ];

  return (
    <div
      className={`${transparent ? styles.containerTransparent : styles.container} ${fullscreen ? styles.fullscreenWrapper : ""}`}
    >
      <div
        className={`${
          transparent
            ? styles.canvasContainerResponsive
            : fullscreen
              ? styles.canvasContainerFullscreen
              : styles.canvasContainer
        } ${interactive ? styles.grabCursor : ""}`}
      >
        <Canvas dpr={[1, 2]}>
          <PerspectiveCamera 
            makeDefault 
            position={[3, 3, 4]} 
            fov={45} 
            onUpdate={(c) => c.lookAt(0, 0, 0)} 
          />
          <ambientLight intensity={0.85} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
            castShadow
          />
          <Environment preset="city" />

          <CubeAnimator
            isExpanded={isExpanded}
            scrollProgress={scrollProgress}
            onExpand={onExpand}
          >
            <RubiksCubeModel
              ref={cubeRef}
              controlsRef={controlsRef}
              interactive={interactive}
              isMirror={currentMode.mirror}
              N={currentMode.N}
              setOrbitEnabled={(v) => {
                if (controlsRef.current) controlsRef.current.enabled = v;
              }}
            />
          </CubeAnimator>
          {interactive && (
            <TrackballControls
              ref={controlsRef}
              noPan={true}
              noZoom={true}
              minDistance={4}
              maxDistance={12}
            />
          )}
        </Canvas>

        {/* Unified control navbar matching the main website aesthetic */}
        {interactive && (
          <div className={styles.unifiedNavbar}>
            <button
              onClick={() => cubeRef.current?.shuffle()}
              className={styles.navButton}
              title="Shuffle Cube"
            >
              <Shuffle />
            </button>
            <button
              onClick={() => cubeRef.current?.reset()}
              className={styles.navButton}
              title="Reset Cube"
            >
              <ArrowLeftRight />
            </button>
            <button
              onClick={() => setModeIdx((m) => (m + 1) % MODES.length)}
              className={styles.navButton}
              title={`Switch Mode (${MODES[(modeIdx + 1) % MODES.length].label})`}
              style={{ width: "auto", padding: "0 12px", gap: "8px" }}
            >
              <Box className="w-4 h-4" />
              <span style={{ fontSize: "0.85rem", fontWeight: "bold", fontFamily: "monospace", letterSpacing: "1px" }}>
                {MODES[(modeIdx + 1) % MODES.length].label}
              </span>
            </button>
            
            <div className={styles.navDivider} />

            {faceButtons.map((btn) => (
              <button
                key={btn.face}
                onClick={() => cubeRef.current?.snapToFace(btn.face)}
                className={styles.faceButton}
                style={{ backgroundColor: btn.color }}
                title={`Snap to ${btn.face}`}
              />
            ))}
          </div>
        )}

        {/* Close Button */}
        {isExpanded && onClose && (
          <button
            onClick={onClose}
            className={styles.closeButton}
            title="Close Cube"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}

export default RubiksCube;
