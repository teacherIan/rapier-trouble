import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

THREE.ColorManagement.legacyMode = false;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' });
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' });
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' });

export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>
    </group>
  );
}

export function BlockEnd({ position = [0, 0, 0] }) {
  const burger = useGLTF('./hamburger.glb');
  burger.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, -0, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>
      <RigidBody type="fixed" colliders="hull">
        <primitive
          object={burger.scene}
          scale={[0.2, 0.2, 0.2]}
          restitution={0.2}
          friction={0}
        />
      </RigidBody>
    </group>
  );
}

export function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacle = useRef();

  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() > 0.5 ? 1 : -1)
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const euler = new THREE.Euler(0, time * speed, 0);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(euler);
    obstacle.current.setNextKinematicRotation(quaternion);
  });
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>

      {/* Spinner */}
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        ></mesh>
      </RigidBody>
    </group>
  );
}

export function BlockLimbo({ position = [0, 0, 0] }) {
  const limbo = useRef();

  const [offset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    limbo.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + Math.sin(time + offset) + 1.3,
      z: position[2],
    });
  });
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>

      {/* Limbo */}
      <RigidBody
        ref={limbo}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        ></mesh>
      </RigidBody>
    </group>
  );
}

export function BlockAxe({ position = [0, 0, 0] }) {
  const limbo = useRef();

  const [offset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    limbo.current.setNextKinematicTranslation({
      x: position[0] + Math.sin(time + offset) * 1.25,
      y: position[1] + 0.7,
      z: position[2],
    });
  });
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>

      {/* Axe */}
      <RigidBody
        ref={limbo}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        ></mesh>
      </RigidBody>
    </group>
  );
}

export default function Level({
  count = 5,
  types = [BlockSpinner, BlockLimbo, BlockAxe],
}) {
  const blocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const type = Math.floor(Math.random() * types.length);
      console.log(type);
      blocks.push(types[type]);
    }

    return blocks;
  }, [count, types]);

  function Bounds({ length = 1 }) {
    return (
      <>
        <RigidBody type="fixed" restitution={0.2} friction={0}>
          <mesh
            position={[2 + 0.15, 0.75, -(length * 4) / 2 + 2]}
            scale={[0.3, 1.5, length * 4]}
            material={wallMaterial}
            geometry={boxGeometry}
            castShadow
          />
          <mesh
            position={[-2 - 0.3 + 0.15, 0.75, -(length * 4) / 2 + 2]}
            scale={[0.3, 1.5, length * 4]}
            material={wallMaterial}
            geometry={boxGeometry}
            receiveShadow
          />

          <mesh
            material={wallMaterial}
            geometry={boxGeometry}
            scale={[4, 1.5, 0.3]}
            position={[0, 0.75, -length * 4 + 2 - 0.15]}
          />

          {/* <mesh
            material={wallMaterial}
            geometry={boxGeometry}
            scale={[4, 1.5, 0.3]}
            position={[0, 0.75, 2]}
          /> */}
          <CuboidCollider
            args={[2, 0.1, 2 * length]}
            position={[0, -0.1, -(length * 2) + 2]}
            restitution={0.2}
            friction={1}
          />
        </RigidBody>
      </>
    );
  }

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />

      <Bounds length={count + 2} />
    </>
  );
}
