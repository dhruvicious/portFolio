import { forwardRef, useRef, useState, useEffect, useImperativeHandle } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { TrackballControls as TrackballControlsImpl } from "three-stdlib";
import { Move, RubiksCubeRef, FaceType } from "./types";
import { getInitialCubies, getClosestSlice, RENDER_POOL } from "./constants";
import { CubieCore } from "./CubieCore";

export const RubiksCubeModel = forwardRef<
  RubiksCubeRef,
  {
    setOrbitEnabled: (v: boolean) => void;
    controlsRef: React.MutableRefObject<TrackballControlsImpl | null>;
    interactive?: boolean;
    isMirror: boolean;
    N: number;
  }
>((props, ref) => {
  const { camera } = useThree();
  const cubiesRef = useRef<(THREE.Group | null)[]>([]);

  const [cubiesState, setCubiesState] = useState<{
    current: any[];
    prevN: number;
  }>(() => ({
    current: getInitialCubies(props.N).map((c) => ({
      id: c.id,
      origX: c.x,
      origY: c.y,
      origZ: c.z,
      position: new THREE.Vector3(c.x, c.y, c.z),
      quaternion: new THREE.Quaternion(),
    })),
    prevN: props.N
  }));

  const logicalCubies = cubiesState.current;

  const prevN = useRef(props.N);
  const transitionAnim = useRef(1);

  const moveQueue = useRef<Move[]>([]);
  const history = useRef<Move[]>([]);
  const currentMove = useRef<(Move & { progress: number }) | null>(null);
  const rotateSpeed = Math.PI * 2.5;

  const rootGroupRef = useRef<THREE.Group>(null);
  const outerGroupRef = useRef<THREE.Group>(null);
  const mirrorFactor = useRef(0);
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!props.interactive) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      keys.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [props.interactive]);

  useEffect(() => {
    if (props.N !== prevN.current) {
      const newCubies = getInitialCubies(props.N).map((c) => ({
        id: c.id,
        origX: c.x,
        origY: c.y,
        origZ: c.z,
        position: new THREE.Vector3(c.x, c.y, c.z),
        quaternion: new THREE.Quaternion(),
      }));
      
      setCubiesState({
        current: newCubies,
        prevN: prevN.current
      });
      
      cubiesRef.current = [];
      prevN.current = props.N;
      transitionAnim.current = 0;
      moveQueue.current = [];
      currentMove.current = null;
    }
  }, [props.N]);

  const dragState = useRef<{
    startX: number;
    startY: number;
    normal: THREE.Vector3;
    cubiePos: THREE.Vector3;
  } | null>(null);

  const cubeAnim = useRef<{ targetQuat: THREE.Quaternion } | null>(null);

  useImperativeHandle(ref, () => ({
    handleRotate: (axis: "x" | "y" | "z", slice: number, dir: 1 | -1) => {
      moveQueue.current.push({ axis, slice, dir });
    },
    shuffle: () => {
      if (transitionAnim.current < 1) return;
      const axes: ("x" | "y" | "z")[] = ["x", "y", "z"];
      const slices: number[] = [];
      const offset = (props.N - 1) / 2;
      for (let i = 0; i < props.N; i++) slices.push(i - offset);
      const dirs: (1 | -1)[] = [1, -1];
      for (let i = 0; i < 20; i++) {
        moveQueue.current.push({
          axis: axes[Math.floor(Math.random() * axes.length)],
          slice: slices[Math.floor(Math.random() * slices.length)],
          dir: dirs[Math.floor(Math.random() * dirs.length)],
        });
      }
    },
    reset: () => {
      moveQueue.current = [];
      const undoMoves = history.current.reverse().map(m => ({
        axis: m.axis,
        slice: m.slice,
        dir: (m.dir * -1) as 1 | -1,
        isUndo: true
      }));
      if (currentMove.current && !currentMove.current.isUndo) {
        undoMoves.unshift({
          axis: currentMove.current.axis,
          slice: currentMove.current.slice,
          dir: (currentMove.current.dir * -1) as 1 | -1,
          isUndo: true
        });
        currentMove.current.isUndo = true; 
      }
      moveQueue.current.push(...undoMoves);
      history.current = [];
    },
    snapToFace: (face: FaceType) => {
      const mCam = new THREE.Matrix4().lookAt(camera.position, new THREE.Vector3(0, 0, 0), camera.up);
      const qCam = new THREE.Quaternion().setFromRotationMatrix(mCam);
      const rFace = new THREE.Quaternion();
      switch (face) {
        case "front": break;
        case "back": rFace.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI); break;
        case "right": rFace.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2); break;
        case "left": rFace.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2); break;
        case "top": rFace.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2); break;
        case "bottom": rFace.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2); break;
      }
      cubeAnim.current = { targetQuat: qCam.multiply(rFace) };
    },
  }));

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);

    if (outerGroupRef.current) {
      const targetScale = 3 / props.N;
      outerGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 1 - Math.exp(-10 * dt));
    }

    if (transitionAnim.current < 1) {
      transitionAnim.current += dt * 1.5;
      if (transitionAnim.current >= 1) {
        transitionAnim.current = 1;
        logicalCubies.forEach((c, i) => {
          const el = cubiesRef.current[i];
          if (el) {
            el.position.set(c.origX, c.origY, c.origZ);
            el.rotation.set(0, 0, 0);
            el.scale.set(1, 1, 1);
          }
        });
      } else {
        const t = Math.min(transitionAnim.current, 1);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        logicalCubies.forEach((c, i) => {
          const el = cubiesRef.current[i];
          if (el) {
            const oldX = getClosestSlice(c.origX, cubiesState.prevN);
            const oldY = getClosestSlice(c.origY, cubiesState.prevN);
            const oldZ = getClosestSlice(c.origZ, cubiesState.prevN);

            const explosion = Math.sin(t * Math.PI) * 0.4;
            
            const curX = THREE.MathUtils.lerp(oldX, c.origX, ease) + c.origX * explosion;
            const curY = THREE.MathUtils.lerp(oldY, c.origY, ease) + c.origY * explosion;
            const curZ = THREE.MathUtils.lerp(oldZ, c.origZ, ease) + c.origZ * explosion;

            el.position.set(curX, curY, curZ);

            const spin = (1 - ease) * Math.PI;
            el.rotation.set(spin, spin, spin);

            const scale = THREE.MathUtils.lerp(0.3, 1, ease);
            el.scale.set(scale, scale, scale);
          }
        });
      }
    }

    const target = props.isMirror ? 1 : 0;
    mirrorFactor.current = THREE.MathUtils.lerp(mirrorFactor.current, target, 1 - Math.exp(-10 * dt));
    if (rootGroupRef.current) {
      rootGroupRef.current.position.set(-0.6 * mirrorFactor.current, -0.4 * mirrorFactor.current, -0.2 * mirrorFactor.current);
    }

    if (cubeAnim.current && outerGroupRef.current) {
      const { targetQuat } = cubeAnim.current;
      const step = 1 - Math.exp(-15 * dt);
      outerGroupRef.current.quaternion.slerp(targetQuat, step);
      if (outerGroupRef.current.quaternion.angleTo(targetQuat) < 0.01) {
        outerGroupRef.current.quaternion.copy(targetQuat);
        cubeAnim.current = null;
      }
    } else if (outerGroupRef.current) {
      const rotSpeed = Math.PI * dt * 1.5;
      let rotX = 0, rotY = 0, rotZ = 0;
      if (keys.current["w"]) rotX -= rotSpeed;
      if (keys.current["s"]) rotX += rotSpeed;
      if (keys.current["a"]) rotY -= rotSpeed;
      if (keys.current["d"]) rotY += rotSpeed;
      if (keys.current["q"]) rotZ += rotSpeed;
      if (keys.current["e"]) rotZ -= rotSpeed;

      if (rotX !== 0 || rotY !== 0 || rotZ !== 0) {
        const camX = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        const camY = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
        const camZ = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
        const deltaQuat = new THREE.Quaternion();
        if (rotX !== 0) deltaQuat.premultiply(new THREE.Quaternion().setFromAxisAngle(camX, rotX));
        if (rotY !== 0) deltaQuat.premultiply(new THREE.Quaternion().setFromAxisAngle(camY, rotY));
        if (rotZ !== 0) deltaQuat.premultiply(new THREE.Quaternion().setFromAxisAngle(camZ, rotZ));
        outerGroupRef.current.quaternion.premultiply(deltaQuat);
        outerGroupRef.current.quaternion.normalize();
      }
    } else if (outerGroupRef.current && !props.interactive) {
      outerGroupRef.current.rotation.x += dt * 0.2;
      outerGroupRef.current.rotation.y += dt * 0.3;
    }

    if (!currentMove.current && moveQueue.current.length > 0 && transitionAnim.current >= 1) {
      currentMove.current = { ...moveQueue.current.shift()!, progress: 0 };
    }

    if (currentMove.current) {
      const { axis, slice, dir, isUndo } = currentMove.current;
      const moveAxis = new THREE.Vector3(axis === "x" ? 1 : 0, axis === "y" ? 1 : 0, axis === "z" ? 1 : 0);
      const currentRotateSpeed = isUndo ? rotateSpeed * 1.5 : rotateSpeed;
      currentMove.current.progress += dt * currentRotateSpeed;
      let finished = false;
      if (currentMove.current.progress >= Math.PI / 2) {
        currentMove.current.progress = Math.PI / 2;
        finished = true;
      }
      const currentAngle = currentMove.current.progress * dir;
      const rotQuat = new THREE.Quaternion().setFromAxisAngle(moveAxis, currentAngle);

      logicalCubies.forEach((cubie, i) => {
        const group = cubiesRef.current[i];
        if (!group) return;
        const isMoving = Math.abs(cubie.position[axis] - slice) < 0.1;
        if (isMoving) {
          const newPos = cubie.position.clone().applyQuaternion(rotQuat);
          group.position.copy(newPos);
          const newQuat = rotQuat.clone().multiply(cubie.quaternion);
          group.quaternion.copy(newQuat);
        } else {
          group.position.copy(cubie.position);
          group.quaternion.copy(cubie.quaternion);
        }
      });

      if (finished) {
        logicalCubies.forEach((cubie) => {
          const isMoving = Math.abs(cubie.position[axis] - slice) < 0.1;
          if (isMoving) {
            cubie.position.applyQuaternion(rotQuat);
            cubie.position.x = getClosestSlice(cubie.position.x, props.N);
            cubie.position.y = getClosestSlice(cubie.position.y, props.N);
            cubie.position.z = getClosestSlice(cubie.position.z, props.N);
            cubie.quaternion.premultiply(rotQuat);
            cubie.quaternion.normalize();
          }
        });
        if (!currentMove.current!.isUndo) {
          history.current.push({ axis: currentMove.current!.axis, slice: currentMove.current!.slice, dir: currentMove.current!.dir });
        }
        currentMove.current = null;
      }
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>, index: number) => {
    if (!props.interactive || transitionAnim.current < 1) return;
    const cubie = logicalCubies[index];
    if (!cubie) return;
    
    e.stopPropagation();
    props.setOrbitEnabled(false);
    (e.target as Element).setPointerCapture(e.pointerId);
    const localPoint = rootGroupRef.current!.worldToLocal(e.point.clone());
    const ax = Math.abs(localPoint.x), ay = Math.abs(localPoint.y), az = Math.abs(localPoint.z);
    const localNormal = new THREE.Vector3(0, 0, 0);
    if (ax > ay && ax > az) localNormal.x = Math.sign(localPoint.x);
    else if (ay > ax && ay > az) localNormal.y = Math.sign(localPoint.y);
    else localNormal.z = Math.sign(localPoint.z);
    
    dragState.current = { startX: e.clientX, startY: e.clientY, normal: localNormal, cubiePos: cubie.position.clone() };
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    props.setOrbitEnabled(true);
    if (!dragState.current) return;
    (e.target as Element).releasePointerCapture(e.pointerId);
    const { startX, startY, normal, cubiePos } = dragState.current;
    dragState.current = null;
    const dx = e.clientX - startX;
    const dy = -(e.clientY - startY);
    if (Math.abs(dx) < 15 && Math.abs(dy) < 15) return;
    let u_vec, v_vec;
    if (Math.abs(normal.x) > 0.5) { u_vec = new THREE.Vector3(0, 1, 0); v_vec = new THREE.Vector3(0, 0, 1); }
    else if (Math.abs(normal.y) > 0.5) { u_vec = new THREE.Vector3(1, 0, 0); v_vec = new THREE.Vector3(0, 0, 1); }
    else { u_vec = new THREE.Vector3(1, 0, 0); v_vec = new THREE.Vector3(0, 1, 0); }
    const world_u = u_vec.clone().transformDirection(rootGroupRef.current!.matrixWorld);
    const world_v = v_vec.clone().transformDirection(rootGroupRef.current!.matrixWorld);
    const centerWorld = new THREE.Vector3(0, 0, 0).applyMatrix4(rootGroupRef.current!.matrixWorld);
    const p_center = centerWorld.clone().project(camera);
    const u_proj = centerWorld.clone().add(world_u).project(camera).sub(p_center);
    const v_proj = centerWorld.clone().add(world_v).project(camera).sub(p_center);
    const u_screen = new THREE.Vector2(u_proj.x, u_proj.y).normalize();
    const v_screen = new THREE.Vector2(v_proj.x, v_proj.y).normalize();
    const drag_vec = new THREE.Vector2(dx, dy);
    const dotU = drag_vec.dot(u_screen);
    const dotV = drag_vec.dot(v_screen);
    let f_vec = Math.abs(dotU) > Math.abs(dotV) ? u_vec.clone().multiplyScalar(Math.sign(dotU)) : v_vec.clone().multiplyScalar(Math.sign(dotV));
    const omega = normal.clone().cross(f_vec);
    const axis: "x" | "y" | "z" = Math.abs(omega.x) > 0.5 ? "x" : Math.abs(omega.y) > 0.5 ? "y" : "z";
    const dir = omega[axis] > 0 ? 1 : -1;
    const slice = getClosestSlice(cubiePos[axis], props.N);
    moveQueue.current.push({ axis, slice, dir });
  };

  return (
    <group ref={outerGroupRef}>
      <group ref={rootGroupRef}>
        {RENDER_POOL.map((i) => {
          const c = logicalCubies[i];
          const isActive = !!c;
          return (
            <group
              key={i}
              visible={isActive}
              ref={(el) => { cubiesRef.current[i] = el; }}
              position={isActive ? [c.origX, c.origY, c.origZ] : [0, 0, 0]}
              onPointerDown={(e) => handlePointerDown(e, i)}
              onPointerUp={handlePointerUp}
            >
              <CubieCore 
                x={isActive ? c.origX : 0} 
                y={isActive ? c.origY : 0} 
                z={isActive ? c.origZ : 0} 
                N={props.N} 
                isMirror={props.isMirror} 
              />
            </group>
          );
        })}
      </group>
    </group>
  );
});

RubiksCubeModel.displayName = "RubiksCubeModel";
