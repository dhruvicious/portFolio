"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.4;
    
    // Organic wave distortion
    uv.x += sin(uv.y * 4.0 + time) * 0.1;
    uv.y += cos(uv.x * 4.0 + time) * 0.1;
    
    // Subtle mouse interaction distance
    float dist = distance(vUv, uMouse);
    
    // Premium dark/monochrome palette with a hint of blue/cyan
    vec3 color1 = vec3(0.02, 0.02, 0.03); // Deep dark
    vec3 color2 = vec3(0.1, 0.15, 0.2);   // Slate blue/gray
    vec3 color3 = vec3(0.2, 0.25, 0.3);   // Lighter steel
    
    // Mix patterns
    float mix1 = smoothstep(0.0, 1.0, sin(uv.x * 8.0 + time) * 0.5 + 0.5);
    float mix2 = smoothstep(0.0, 1.0, cos(uv.y * 8.0 - time) * 0.5 + 0.5);
    
    vec3 finalColor = mix(color1, color2, mix1);
    finalColor = mix(finalColor, color3, mix2);
    
    // Add subtle interactive glow where mouse is
    float glow = 1.0 - smoothstep(0.0, 0.6, dist);
    finalColor += vec3(0.1, 0.2, 0.25) * glow * 0.8;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function LiquidMaterial() {
  const materialRef = useRef<any>(null);
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: [0.5, 0.5] }
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Map pointer (-1 to 1) to UV space (0 to 1)
      const mx = (state.pointer.x + 1) / 2;
      const my = (state.pointer.y + 1) / 2;
      
      // Lerp for smooth mouse trailing
      materialRef.current.uniforms.uMouse.value[0] = MathUtils.lerp(
        materialRef.current.uniforms.uMouse.value[0],
        mx,
        0.05
      );
      materialRef.current.uniforms.uMouse.value[1] = MathUtils.lerp(
        materialRef.current.uniforms.uMouse.value[1],
        my,
        0.05
      );
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
    />
  );
}

export function ShaderCanvas() {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden", background: "#000" }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <mesh>
          <planeGeometry args={[4, 4]} />
          <LiquidMaterial />
        </mesh>
      </Canvas>
      <div 
        style={{ 
          position: "absolute", 
          top: 0, left: 0, width: "100%", height: "100%", 
          display: "flex", alignItems: "center", justifyContent: "center", 
          pointerEvents: "none" 
        }}
      >
        <h2 
          style={{ 
            fontSize: "clamp(3rem, 8vw, 6rem)", 
            fontWeight: 900, 
            letterSpacing: "-0.04em",
            color: "white", 
            mixBlendMode: "overlay",
            textTransform: "uppercase"
          }}
        >
          Creative Developer
        </h2>
      </div>
    </div>
  );
}
