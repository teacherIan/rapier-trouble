import { RigidBody, useRapier } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function Player() {
  const body = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  function jump() {
    const origin = body.current.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);
    console.log('Ray caster:');
    console.log(hit);
    console.log('Translation:');
    console.log(body.current.translation());

    body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
  }

  useEffect(() => {
    subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) {
          jump();
        }
      }
    );
  }, []);

  useFrame((state, delta) => {
    const { left, right, forward, backward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }

    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }

    if (right) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    if (left) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);
  });

  return (
    <>
      <RigidBody
        ref={body}
        colliders="ball"
        restitution={0.2}
        friction={1}
        linearDamping={0.5}
        angularDamping={0.5}
      >
        <mesh position={[0, 2, 0]} castShadow>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial color="mediumpurple" flatShading />
        </mesh>
      </RigidBody>
    </>
  );
}
