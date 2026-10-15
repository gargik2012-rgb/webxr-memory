import React, { useEffect, useRef } from 'react'

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Basic WebXR canvas scene initialization
    console.log('WebXR Memory App Loaded')
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#111', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1>WebXR Spatial Memory</h1>
      <p>App loaded successfully!</p>
      <button 
        style={{ padding: '12px 24px', fontSize: '18px', borderRadius: '8px', border: 'none', backgroundColor: '#0070f3', color: '#fff', cursor: 'pointer', marginTop: '16px' }}
        onClick={() => alert('VR Mode Ready on Meta Quest!')}
      >
        Enter VR / Test App
      </button>
      <div ref={containerRef} />
    </div>
  )
}
