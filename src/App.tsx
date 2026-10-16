import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { VRButton, XR, Controllers, Hands } from '@react-three/xr'
import { Text } from '@react-three/drei'

// Individual 3D Card component
function MemoryCard({ position, color, isFlipped, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      {/* Card Base / Back */}
      <mesh>
        <boxGeometry args={[0.4, 0.6, 0.05]} />
        <meshStandardMaterial color={isFlipped ? color : '#333'} />
      </mesh>
    </group>
  )
}

function MemoryGame() {
  // Simple state for 4 cards: pairs of colors
  const [cards, setCards] = useState([
    { id: 1, color: 'hotpink', isFlipped: false },
    { id: 2, color: 'cyan', isFlipped: false },
    { id: 3, color: 'hotpink', isFlipped: false },
    { id: 4, color: 'cyan', isFlipped: false },
  ])

  const handleCardClick = (id) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, isFlipped: !card.isFlipped } : card
    ))
  }

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} />
      
      {/* Arranging 4 cards in a row in 3D space */}
      {cards.map((card, index) => {
        const xOffset = (index - 1.5) * 0.6
        return (
          <MemoryCard
            key={card.id}
            position={[xOffset, 1.5, -2]}
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
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
      <VRButton />
      <Canvas camera={{ position: [0, 1.6, 0] }}>
        <XR>
          <Controllers />
          <Hands />
          <MemoryGame />
        </XR>
      </Canvas>
    </div>
  )
}
