import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { VRButton, XR, Controllers, Hands } from '@react-three/xr'
import { OrbitControls, Center, Text } from '@react-three/drei'

function VirtualRoomScene() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={2} />
      
      {/* Placeholder 3D anchor representing the user's uploaded room space */}
      <mesh position={[0, 0, -2]}>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#2a2a3c" roughness={0.4} />
      </mesh>
      
      <Center position={[0, 0.5, -1.9]}>
        <Text fontSize={0.15} color="white" anchorX="center" anchorY="middle">
          Your Recreated Sanctuary
        </Text>
      </Center>
    </>
  )
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'processing' | 'ready'>('idle')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setStatus('idle')
    }
  }

  const handleUploadAndConvert = () => {
    if (!selectedFile) return
    setStatus('processing')
    
    // Simulate 3D environment generation and conversion
    setTimeout(() => {
      setStatus('ready')
    }, 2500)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0c', position: 'relative', overflow: 'hidden', fontFamily: 'sans-serif', color: 'white' }}>
      
      {/* If environment is not ready, show the Upload Dashboard */}
      {status !== 'ready' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px' }}>
          <div style={{ background: '#16161c', padding: '40px', borderRadius: '12px', border: '1px solid #2a2a3c', textAlign: 'center', maxWidth: '450px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <h1 style={{ margin: '0 0 10px', fontSize: '1.8rem', fontWeight: 600 }}>Spatial Memory Sanctuary</h1>
            <p style={{ margin: '0 0 25px', color: '#888', fontSize: '0.9rem', lineHeight: '1.4' }}>
              Upload your 3D room scan or capture file to convert it into an immersive VR environment.
            </p>

            <label style={{ display: 'block', border: '2px dashed #3a3a4c', padding: '25px', borderRadius: '8px', cursor: 'pointer', background: '#111116', marginBottom: '20px', transition: 'border-color 0.2s' }}>
              <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
              <span style={{ fontSize: '0.95rem', color: selectedFile ? '#33ccff' : '#aaa' }}>
                {selectedFile ? `Selected: ${selectedFile.name}` : '📁 Click to Add Room File (.ply, .splat, .mp4)'}
              </span>
            </label>

            <button 
              onClick={handleUploadAndConvert}
              disabled={!selectedFile || status === 'processing'}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                background: selectedFile ? '#0070f3' : '#333',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: selectedFile ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s'
              }}
            >
              {status === 'processing' ? 'Converting to 3D Environment...' : 'Convert Sanctuary'}
            </button>
          </div>
        </div>
      ) : (
        /* Once ready, show the Done Popup & WebXR Viewer Portal */
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          
          {/* Done Popup Notification Banner */}
          <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 20, fontWeight: 600, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✅ Done! Your 3D room environment is ready. Put on your VR headset and step inside.</span>
          </div>

          <div style={{ position: 'absolute', bottom: '30px', width: '100%', textAlign: 'center', zIndex: 10 }}>
            <VRButton style={{ padding: '12px 28px', fontSize: '1.1rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 14px rgba(0, 112, 243, 0.4)' }} />
          </div>

          <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
            <XR>
              <Controllers />
              <Hands />
              <VirtualRoomScene />
            </XR>
            <OrbitControls enableZoom={true} />
          </Canvas>
        </div>
      )}

    </div>
  )
}
