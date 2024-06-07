import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../App";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

import { AnimatedGentleman_fix } from "./AnimatedGentleman_fix";

const JUMP_FORCE = 0.5;
const MOVEMENT_SPEED = 0.1;
const MAX_VEL = 3;
const RUN_VEL = 1;

export const CharacterController = () => {


  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.backward]);
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );
  const rigidbody = useRef();
  const isOnFloor = useRef(true);

  const [isMoving, setIsMoving] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Shift') {
        setShiftPressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'Shift') {
        setShiftPressed(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  useFrame((state) => {
    const impulse = { x: 0, y: 0, z: 0 };
    if (jumpPressed && isOnFloor.current) {
      impulse.y += JUMP_FORCE;
      isOnFloor.current = false;
      setIsJumping(true);
    }

    const linvel = rigidbody.current.linvel();
    let changeRotation = false;
    if (rightPressed && linvel.x < MAX_VEL) {
      impulse.x += MOVEMENT_SPEED * (shiftPressed ? 2 : 1);
      changeRotation = true;
      setIsMoving(true);
    }
    if (leftPressed && linvel.x > -MAX_VEL) {
      impulse.x -= MOVEMENT_SPEED * (shiftPressed ? 2 : 1);
      changeRotation = true;
      setIsMoving(true);
    }
    if (backPressed && linvel.z < MAX_VEL) {
      impulse.z += MOVEMENT_SPEED * (shiftPressed ? 2 : 1);
      changeRotation = true;
      setIsMoving(true);
    }
    if (forwardPressed && linvel.z > -MAX_VEL) {
      impulse.z -= MOVEMENT_SPEED * (shiftPressed ? 2 : 1);
      changeRotation = true;
      setIsMoving(true);
    }

    rigidbody.current.applyImpulse(impulse, true);

    if (!rightPressed &&!leftPressed &&!backPressed &&!forwardPressed) {
        setIsMoving(false);
      }

    if (changeRotation) {
      const angle = Math.atan2(linvel.x, linvel.z);
      gentleman.current.rotation.y = angle;
    }

    //3RD CAMERA FOLLOW
    const characterWorldPosition = gentleman.current.getWorldPosition(
      new THREE.Vector3()
    );

    const targetCameraPosition = new THREE.Vector3(characterWorldPosition.x, 0, characterWorldPosition.z);

    state.camera.position.x = characterWorldPosition.x;
    state.camera.position.z = characterWorldPosition.z + 10;

    const targetLookAt = new THREE.Vector3(
      characterWorldPosition.x,
      0,
      characterWorldPosition.z,
    );

    const direction = new THREE.Vector3();
    state.camera.getWorldDirection(direction);

    const position = new THREE.Vector3();
    state.camera.getWorldPosition(position);

    const currentLookAt = position.clone().add(direction);
    const lerpedLookAt = new THREE.Vector3();

    lerpedLookAt.lerpVectors(currentLookAt, targetLookAt, 0.1);

    state.camera.lookAt(lerpedLookAt);
  });

  const gentleman = useRef();
//   const resetPosition = () => {
//     rigidbody.current.setTranslation(vec3({x:0, y:0, z: 0}));
//     rigidbody.current.setLinvel(vec3({x:0, y:0, z: 0}));
//   };

  return (
    <group>
      <RigidBody
        ref={rigidbody}
        colliders={false}
        scale={[0.5, 0.5, 0.5]}
        enabledRotations={[false, false, false]}
        onCollisionEnter={() => {
          isOnFloor.current = true;
          setIsJumping(false);
        }}
        // onIntersectionEnter={({other}) => {
        //     if (other.rigidBodyObject.name === "void"){
        //         resetPosition();
        //     }
        // }}
      >
        <CapsuleCollider args={[0.8, 0.4]} position={[0, 1.2, 0]} />
        <group ref={gentleman}>
          <AnimatedGentleman_fix isMoving={isMoving} isJumping={isJumping} isRunning={shiftPressed && isMoving}/>
        </group>
      </RigidBody>
    </group>
  );
};
