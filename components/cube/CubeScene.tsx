"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Matrix4, Quaternion, type Group } from "three";
import type { Cubie, CubeState } from "@/lib/cube";
import { CUBIE_SIZE, stickersFor } from "@/lib/cube-view";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function CubieMesh({ cubie }: { cubie: Cubie }) {
  // the orientation matrix from the cube logic, as a Three.js rotation
  const quaternion = useMemo(() => {
    const m = cubie.orientation;
    return new Quaternion().setFromRotationMatrix(
      new Matrix4().set(
        m[0],
        m[1],
        m[2],
        0,
        m[3],
        m[4],
        m[5],
        0,
        m[6],
        m[7],
        m[8],
        0,
        0,
        0,
        0,
        1,
      ),
    );
  }, [cubie.orientation]);
  const stickers = useMemo(() => stickersFor(cubie.home), [cubie.home]);

  return (
    <group position={[...cubie.position]} quaternion={quaternion}>
      <mesh>
        <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
        <meshStandardMaterial color="#0b0b12" roughness={0.6} />
      </mesh>
      {stickers.map((s) => (
        <mesh key={s.key} position={[...s.position]} rotation={[...s.rotation]}>
          <planeGeometry args={[CUBIE_SIZE * 0.84, CUBIE_SIZE * 0.84]} />
          <meshStandardMaterial color={s.colour} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function Cube({ state, spin }: { state: CubeState; spin: boolean }) {
  const group = useRef<Group>(null);

  // a slow idle turn, so it is clearly 3D before you touch it
  useFrame((_, delta) => {
    if (spin && group.current) group.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={group} rotation={[0.45, -0.6, 0]}>
      {state.cubies
        .filter((c) => !c.home.every((v) => v === 0)) // the hidden core
        .map((c) => (
          <CubieMesh key={c.id} cubie={c} />
        ))}
    </group>
  );
}

export default function CubeScene({ state }: { state: CubeState }) {
  const reduce = useReducedMotion();
  // this file only ever runs in the browser, so reading the DOM here is safe
  const [webgl] = useState(hasWebGL);

  if (!webgl) {
    return (
      <p
        data-testid="cube-fallback"
        className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-400"
      >
        Your browser can&apos;t show 3D graphics, so the cube is switched off.
      </p>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 9.5], fov: 38 }}
      dpr={[1, 2]}
      frameloop={reduce ? "demand" : "always"}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 6]} intensity={1.6} />
      <pointLight position={[-6, -3, -4]} intensity={30} color="#8b5cf6" />
      <pointLight position={[6, 3, 4]} intensity={20} color="#22d3ee" />
      <Cube state={state} spin={!reduce} />
    </Canvas>
  );
}
