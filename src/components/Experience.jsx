import { Cylinder, Environment, OrbitControls } from "@react-three/drei";
import { CylinderCollider, CuboidCollider, RigidBody } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";

export const Experience = () => {
  return (
    <>
      {/* <OrbitControls /> */}
      <Environment preset="sunset" />
      <directionalLight position={[5,5,5]} intensity={0.3} castShadow color={"#9e69da"}/>

      <RigidBody colliders={false} type="fixed" position={[0, -0.5, 0]} friction={2}> 
        <CylinderCollider args={[1/2, 5]}/>
        <Cylinder scale={[5,1,5]} receiveShadow>
          <meshStandardMaterial color="white"/>
        </Cylinder>

        {/* <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial color="gray"/>
        </mesh>
        <CuboidCollider args={[500, 2, 500]} position={[0, -2, 0]} /> */}

      </RigidBody>

      {/* character */}
      <CharacterController/>
    </>
  );
};
