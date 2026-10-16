import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { VRButton, XR, Controllers, Hands } from '@react-three/xr'
import { OrbitControls } from '@react-three/drei'

function MemoryCard({ position, color, isFlipped, onClick }: any) {
  return (
    <group position={position} onClick={onClick}>
      <mesh>
        <boxGeometry args={[0.5, 0.7, 0.05]} />
        <meshStandardMaterial color={isFlipped ? color : '#3a3a4c'} roughness={0.2} />
      </mesh>
    </group>
  )
}

function MemoryGame() {
  const [cards, setCards] = useState([
    { id: 1, color: '#ff3366', isFlipped: false },
    { id: 2, color: '#33ccff', isFlipped: false },
    { id: 3, color: '#ff3366', isFlipped: false },
    { id: 4, color: '#33ccff', isFlipped: false },
  ])

  const handleCardClick = (id: number) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, isFlipped: !card.isFlipped } : card
    ))
  }

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 10, 5]} intensity={2} />
      
      {cards.map((card, index) => {
        const xOffset = (index - 1.5) * 0.7
        return (
          <MemoryCard
            key={card.id}
            position={[xOffset, 0, 0]}
            color={card.color}
            isFlipped={card.isFlipped}
            onClick={() => handleCardClick(card.id)}
          />
        )
      })}
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#121216', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20px', width: '100%', textAlign: 'center', color: 'white', zIndex: 10, fontFamily: 'sans-serif', pointerEvents: 'none' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>WebXR Spatial Memory</h2>
        <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#888' }}>Click cards to test flipping</p>
      </div>

      <div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', zIndex: 10 }}>
        <VRButton style={{ padding: '10px 20px', fontSize: '1rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} />
      </div>

      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <XR>
          <Controllers />
          <Hands />
          <MemoryGame />
        </XR>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}
