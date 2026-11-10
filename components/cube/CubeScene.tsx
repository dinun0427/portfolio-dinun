"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  CanvasTexture,
  Euler,
  Matrix4,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  Raycaster,
  SRGBColorSpace,
  Vector2,
  Vector3,
  type Group,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Axis, Cubie, CubeState, Layer, Move } from "@/lib/cube";
import {
  QUARTER,
  layerTurnFor,
  movesForTurns,
  pickTangent,
  quarterTurnsFor,
  type Script,
} from "@/lib/cube-drag";
import {
  CUBIE_RADIUS,
  CUBIE_SIZE,
  LOGO_TEXT,
  hasLogo,
  sideColours,
} from "@/lib/cube-view";
import { gsap } from "@/lib/gsap";

const AXES: Axis[] = ["x", "y", "z"];
const AXIS_VECTORS: Record<Axis, Vector3> = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1),
};

// ---- the look: one rounded piece, a few shared materials, one logo ----

/** Every piece shares this rounded box, so there is only one in memory. */
const GEOMETRY = new RoundedBoxGeometry(
  CUBIE_SIZE,
  CUBIE_SIZE,
  CUBIE_SIZE,
  5,
  CUBIE_RADIUS,
);

/** The dark plastic you only see inside the thin seams between pieces. */
const INNER = new MeshStandardMaterial({ color: "#0c1a1c", roughness: 0.9 });

const sideMaterials = new Map<string, MeshPhysicalMaterial>();
/** Smooth, slightly glossy plastic, like a UV-coated stickerless cube. */
function sideMaterial(colour: string) {
  let material = sideMaterials.get(colour);
  if (!material) {
    material = new MeshPhysicalMaterial({
      color: colour,
      roughness: 0.4,
      clearcoat: 0.4,
      clearcoatRoughness: 0.35,
    });
    sideMaterials.set(colour, material);
  }
  return material;
}

let logoTexture: CanvasTexture | null = null;
/** The "DR" monogram, drawn once. Letters only, so the white shows through. */
function getLogoTexture() {
  if (logoTexture) return logoTexture;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, "#5E6C58");
    gradient.addColorStop(1, "#162A2C");
    ctx.fillStyle = gradient;
    ctx.font = '900 140px "Arial Black", Arial, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(LOGO_TEXT, size / 2, size / 2 + 6);
  }
  logoTexture = new CanvasTexture(canvas);
  logoTexture.colorSpace = SRGBColorSpace;
  logoTexture.anisotropy = 8;
  return logoTexture;
}

// ---- turning the whole cube: any direction, no limit ----

const SPIN_STEP = new Quaternion();
const SPIN_EULER = new Euler();
/** Turn the view around the screen's vertical and horizontal axes. */
function turnView(view: Quaternion, yaw: number, pitch: number) {
  SPIN_STEP.setFromEuler(SPIN_EULER.set(pitch, yaw, 0));
  view.premultiply(SPIN_STEP).normalize();
}

/** A layer that is part-way through turning. Angle is around the +axis. */
type Turn = { axis: Axis; layer: Layer; angle: number };

type Drag = {
  pointerId: number;
  kind: "orbit" | "layer";
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  lastTime: number;
  vYaw: number;
  vPitch: number;
  /** layer drags: the touched point (world), piece and face */
  point: Vector3;
  cubie?: Cubie;
  normalAxis?: Axis;
  normalSign?: 1 | -1;
  lock?: {
    axis: Axis;
    layer: Layer;
    sign: 1 | -1;
    unit: [number, number];
    pxPerUnit: number;
  };
};

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function CubieMesh({
  cubie,
  turn,
}: {
  cubie: Cubie;
  turn: RefObject<Turn | null>;
}) {
  const ref = useRef<Group>(null);
  const moved = useRef(false);

  // the position and orientation from the cube logic, as Three.js values
  const basePosition = useMemo(
    () => new Vector3(...cubie.position),
    [cubie.position],
  );
  const baseRotation = useMemo(() => {
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

  // one material per side of the box: its colour, or dark if it faces inwards
  const materials = useMemo(
    () =>
      sideColours(cubie.home).map((colour) =>
        colour ? sideMaterial(colour) : INNER,
      ),
    [cubie.home],
  );
  const logo = useMemo(
    () => (hasLogo(cubie.home) ? getLogoTexture() : null),
    [cubie.home],
  );

  // while a layer is mid-turn, pieces in it are rotated on top of their place
  useFrame(() => {
    const group = ref.current;
    if (!group) return;
    const t = turn.current;
    if (
      t &&
      t.angle !== 0 &&
      cubie.position[AXES.indexOf(t.axis)] === t.layer
    ) {
      const axis = AXIS_VECTORS[t.axis];
      group.position.copy(basePosition).applyAxisAngle(axis, t.angle);
      group.quaternion.setFromAxisAngle(axis, t.angle).multiply(baseRotation);
      moved.current = true;
    } else if (moved.current) {
      group.position.copy(basePosition);
      group.quaternion.copy(baseRotation);
      moved.current = false;
    }
  });

  return (
    <group
      ref={ref}
      userData={{ cubieId: cubie.id }}
      position={[...cubie.position]}
      quaternion={baseRotation}
    >
      <mesh geometry={GEOMETRY} material={materials} />
      {logo && (
        // a flat plane just above the white centre, upright when seen from above
        <mesh
          position={[0, CUBIE_SIZE / 2 + 0.003, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[CUBIE_SIZE * 0.7, CUBIE_SIZE * 0.7]} />
          <meshBasicMaterial
            map={logo}
            transparent
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

function Cube({
  state,
  script,
  onMove,
  onSettled,
  reduce,
}: {
  state: CubeState;
  script: Script | null;
  onMove: (move: Move) => void;
  onSettled: () => void;
  reduce: boolean;
}) {
  const group = useRef<Group>(null);
  const turn = useRef<Turn | null>(null);
  // how the whole cube is rotated for the viewer (a quaternion: no tilt limit)
  const view = useRef(new Quaternion().setFromEuler(new Euler(0.45, -0.6, 0)));
  const idle = useRef(true); // slow spin until the visitor first touches it
  const busy = useRef(false); // a layer is turning or snapping into place
  const pendingClear = useRef(false);
  const stateRef = useRef(state);
  const onMoveRef = useRef(onMove);
  const onSettledRef = useRef(onSettled);
  const reduceRef = useRef(reduce);
  // moves waiting to be played by Scramble, Solve or the keyboard
  const queue = useRef<Move[]>([]);
  const queueSeconds = useRef(0.15);
  const scripted = useRef(false);
  const lastScript = useRef<number | null>(null);

  const get = useThree((s) => s.get);
  const invalidate = useThree((s) => s.invalidate);

  // plays the next queued move: the layer turns by itself, then the move is committed
  const playNext = useCallback(() => {
    if (busy.current) return;
    const move = queue.current.shift();
    if (!move) return;
    busy.current = true;
    const t: Turn = { axis: move.axis, layer: move.layer, angle: 0 };
    turn.current = t;

    const commit = () => {
      // keep the turn on screen until the new state has rendered
      pendingClear.current = true;
      onMoveRef.current(move);
    };

    if (reduceRef.current) {
      t.angle = move.dir * QUARTER;
      commit();
      return;
    }
    gsap.to(t, {
      angle: move.dir * QUARTER,
      duration: queueSeconds.current,
      ease: "power2.inOut",
      onUpdate: invalidate,
      onComplete: commit,
    });
  }, [invalidate]);

  useLayoutEffect(() => {
    stateRef.current = state;
    onMoveRef.current = onMove;
    onSettledRef.current = onSettled;
    reduceRef.current = reduce;
    // the new state is on screen, so the temporary turn angle can go
    if (pendingClear.current) {
      pendingClear.current = false;
      turn.current = null;
      busy.current = false;
      invalidate();
      // a script has played its last move
      if (queue.current.length === 0 && scripted.current) {
        scripted.current = false;
        onSettledRef.current();
      }
    }
  }, [state, onMove, onSettled, reduce, invalidate]);

  // a new script from the page: queue its moves and start playing
  useEffect(() => {
    if (!script || lastScript.current === script.id) return;
    lastScript.current = script.id;
    if (script.moves.length === 0) {
      onSettledRef.current();
      return;
    }
    queueSeconds.current = script.seconds;
    scripted.current = true;
    queue.current.push(...script.moves);
    playNext();
  }, [script, playNext]);

  useFrame((_, delta) => {
    if (idle.current && !reduceRef.current)
      turnView(view.current, delta * 0.3, 0);
    group.current?.quaternion.copy(view.current);
    // carries on with the queue, and resumes it after a drag finishes
    if (!busy.current && queue.current.length > 0) playNext();
  });

  useEffect(() => {
    const el = get().gl.domElement;
    const raycaster = new Raycaster();
    const ndc = new Vector2();
    const currentView = view.current;
    const spin = { f: 0 }; // 1 -> 0 while a flick coasts to a stop
    let drag: Drag | null = null;

    el.style.touchAction = "none"; // dragging the cube must not scroll the page
    el.style.cursor = "grab";

    function toScreen(v: Vector3, rect: DOMRect): [number, number] {
      const p = v.clone().project(get().camera);
      return [((p.x + 1) / 2) * rect.width, ((1 - p.y) / 2) * rect.height];
    }

    // after a small movement: which way along the touched face is the drag?
    function lockLayer(d: Drag, dx: number, dy: number) {
      const g = group.current;
      if (!g || !d.cubie || !d.normalAxis || !d.normalSign) return undefined;
      const rect = el.getBoundingClientRect();
      const rotation = g.getWorldQuaternion(new Quaternion());
      const origin = toScreen(d.point, rect);
      const candidates = AXES.filter((a) => a !== d.normalAxis).map((axis) => {
        const end = toScreen(
          d.point
            .clone()
            .add(AXIS_VECTORS[axis].clone().applyQuaternion(rotation)),
          rect,
        );
        return {
          axis,
          screen: [end[0] - origin[0], end[1] - origin[1]] as const,
        };
      });
      const pick = pickTangent([dx, dy], candidates);
      if (!pick) return undefined;
      const { axis, layer, sign } = layerTurnFor(
        d.cubie.position,
        d.normalAxis,
        d.normalSign,
        pick.axis,
      );
      return { axis, layer, sign, unit: pick.unit, pxPerUnit: pick.pxPerUnit };
    }

    function finishTurn(t: Turn) {
      const turns = quarterTurnsFor(t.angle);
      const moves = movesForTurns(t.axis, t.layer, turns);
      busy.current = true;

      const commit = () => {
        if (moves.length === 0) {
          // a small nudge: it sprang back, nothing changed
          turn.current = null;
          busy.current = false;
          invalidate();
          return;
        }
        // keep the turn on screen until the new state has rendered
        pendingClear.current = true;
        for (const move of moves) onMoveRef.current(move);
      };

      if (reduceRef.current) {
        t.angle = turns * QUARTER;
        commit();
        return;
      }
      gsap.to(t, {
        angle: turns * QUARTER,
        duration: 0.3,
        ease: "back.out(1.6)",
        onUpdate: invalidate,
        onComplete: commit,
      });
    }

    function onDown(e: PointerEvent) {
      if (drag || (e.pointerType === "mouse" && e.button !== 0)) return;
      const g = group.current;
      if (!g) return;

      const rect = el.getBoundingClientRect();
      ndc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );
      g.updateWorldMatrix(true, true);
      raycaster.setFromCamera(ndc, get().camera);
      const hit = raycaster.intersectObject(g, true)[0];

      // which piece, and which of its faces, did we touch?
      let object: Object3D | null = hit?.object ?? null;
      while (object && object.userData.cubieId === undefined)
        object = object.parent;
      const cubie = object
        ? stateRef.current.cubies[object.userData.cubieId as number]
        : undefined;

      let kind: Drag["kind"] = "orbit";
      let normalAxis: Axis | undefined;
      let normalSign: 1 | -1 | undefined;
      if (hit && hit.face && cubie) {
        const normal = hit.face.normal
          .clone()
          .transformDirection(hit.object.matrixWorld)
          .transformDirection(new Matrix4().copy(g.matrixWorld).invert());
        const [axis, value] = (
          [
            ["x", normal.x],
            ["y", normal.y],
            ["z", normal.z],
          ] as [Axis, number][]
        ).reduce((a, b) => (Math.abs(b[1]) > Math.abs(a[1]) ? b : a));
        normalAxis = axis;
        normalSign = value > 0 ? 1 : -1;
        // face centres only spin the whole cube; edges and corners turn a layer
        const touching = cubie.position.filter((v) => v !== 0).length;
        if (touching > 1) kind = "layer";
      }
      if (kind === "layer" && busy.current) return; // wait for the snap

      idle.current = false;
      gsap.killTweensOf(spin);
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
      drag = {
        pointerId: e.pointerId,
        kind,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        lastTime: e.timeStamp,
        vYaw: 0,
        vPitch: 0,
        point: hit ? hit.point.clone() : new Vector3(),
        cubie,
        normalAxis,
        normalSign,
      };
    }

    function onMovePointer(e: PointerEvent) {
      const d = drag;
      if (!d || e.pointerId !== d.pointerId) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;

      if (d.kind === "orbit") {
        const yaw = (e.clientX - d.lastX) * 0.01;
        const pitch = (e.clientY - d.lastY) * 0.01;
        turnView(currentView, yaw, pitch);
        d.vYaw = yaw;
        d.vPitch = pitch;
      } else {
        if (!d.lock) {
          if (Math.hypot(dx, dy) < 8) return; // not a drag yet
          d.lock = lockLayer(d, dx, dy);
          if (!d.lock) return;
        }
        // pixels along the face -> angle: one cube unit of travel ~ one radian
        const along = dx * d.lock.unit[0] + dy * d.lock.unit[1];
        const theta = Math.max(
          -Math.PI,
          Math.min(Math.PI, along / d.lock.pxPerUnit),
        );
        turn.current = {
          axis: d.lock.axis,
          layer: d.lock.layer,
          angle: d.lock.sign * theta,
        };
      }

      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.lastTime = e.timeStamp;
      invalidate();
    }

    function onUp(e: PointerEvent) {
      const d = drag;
      if (!d || e.pointerId !== d.pointerId) return;
      drag = null;
      if (el.hasPointerCapture(e.pointerId))
        el.releasePointerCapture(e.pointerId);
      el.style.cursor = "grab";

      if (d.kind === "orbit") {
        // a flick keeps spinning, in any direction, and eases to a stop
        if (!reduceRef.current && e.timeStamp - d.lastTime < 80) {
          spin.f = 1;
          gsap.to(spin, {
            f: 0,
            duration: 1.2,
            ease: "power3.out",
            onUpdate: () => {
              turnView(currentView, d.vYaw * spin.f, d.vPitch * spin.f);
              invalidate();
            },
          });
        }
        return;
      }
      if (d.lock && turn.current) finishTurn(turn.current);
    }

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMovePointer);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMovePointer);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      gsap.killTweensOf(spin);
      if (turn.current) gsap.killTweensOf(turn.current);
    };
  }, [get, invalidate]);

  return (
    <group ref={group}>
      {state.cubies
        .filter((c) => !c.home.every((v) => v === 0)) // the hidden core
        .map((c) => (
          <CubieMesh key={c.id} cubie={c} turn={turn} />
        ))}
    </group>
  );
}

export default function CubeScene({
  state,
  script,
  active,
  onMove,
  onSettled,
}: {
  state: CubeState;
  script: Script | null;
  /** false while scrolled out of view: drawing stops to save battery */
  active: boolean;
  onMove: (move: Move) => void;
  onSettled: () => void;
}) {
  const reduce = Boolean(useReducedMotion());
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
      flat // no tone mapping, so the plastic colours stay true
      camera={{ position: [0, 0, 9.5], fov: 38 }}
      dpr={[1, 1.75]}
      frameloop={!active ? "never" : reduce ? "demand" : "always"}
    >
      <ambientLight intensity={1.5} />
      <hemisphereLight args={["#ffffff", "#55645f", 1.0]} />
      <directionalLight position={[5, 8, 6]} intensity={1.8} />
      <pointLight position={[-6, -3, -4]} intensity={30} color="#A3B59B" />
      <pointLight position={[6, 3, 4]} intensity={20} color="#D6E0E2" />
      <Cube
        state={state}
        script={script}
        onMove={onMove}
        onSettled={onSettled}
        reduce={reduce}
      />
    </Canvas>
  );
}
