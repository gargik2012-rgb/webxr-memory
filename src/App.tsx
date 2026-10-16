import { Canvas } from '@react-three/fiber'
import { ARButton, VRButton, XR, Controllers, Hands } from '@react-three/xr'

function Box() {
  return (
    <mesh position={[0, 1.5, -2]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="teal" />
    </mesh>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
      <VRButton />
      <Canvas>
        <XR>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} />
          <Controllers />
          <Hands />
          <Box />
        </XR>
      </Canvas>
    </div>
  )
}
