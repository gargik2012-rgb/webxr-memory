import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { VRButton, XR, Controllers, Hands } from '@react-three/xr'
import { OrbitControls, Center, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useSanctuaryConversation } from './useSanctuaryConversation'

function VideoDisplayPlane({ videoSrc }: { videoSrc: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null)

  useEffect(() => {
    const video = document.createElement('video')
    video.src = videoSrc
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = false
    video.playsInline = true
    video.play().catch(e => console.log("Autoplay blocked:", e))
    
    videoRef.current = video
    const texture = new THREE.VideoTexture(video)
    setVideoTexture(texture)

    return () => {
      video.pause()
      video.src = ''
    }
  }, [videoSrc])

  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[3.2, 1.8]} />
      <meshBasicMaterial map={videoTexture} toneMapped={false} />
    </mesh>
  )
}

function VirtualRoomScene({ videoSrc }: { videoSrc: string | null }) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={2} />
      
      {videoSrc ? (
        <VideoDisplayPlane videoSrc={videoSrc} />
      ) : (
        <mesh position={[0, 0, -2]}>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial color="#2a2a3c" roughness={0.4} />
        </mesh>
      )}
      
      <Center position={[0, 1.1, -1.9]}>
        <Text fontSize={0.12} color="white" anchorX="center" anchorY="middle">
          Your Recreated Sanctuary
        </Text>
      </Center>
    </>
  )
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'processing' | 'ready'>('idle')

  const { 
    isListening, 
    transcript, 
    aiResponse, 
    clonedVoices, 
    activeVoiceId, 
    setActiveVoiceId, 
    startListening, 
    createVoiceClonesFromFile 
  } = useSanctuaryConversation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setVideoUrl(URL.createObjectURL(file))
      setStatus('idle')
    }
  }

  const handleUploadAndConvert = async () => {
    if (!selectedFile) return
    setStatus('processing')
    
    // Clone all detected speaker voices from the uploaded video
    await createVoiceClonesFromFile(selectedFile)

    setTimeout(() => {
      setStatus('ready')
    }, 2000)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0c', position: 'relative', overflow: 'hidden', fontFamily: 'sans-serif', color: 'white' }}>
      
      {status !== 'ready' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px' }}>
          <div style={{ background: '#16161c', padding: '40px', borderRadius: '12px', border: '1px solid #2a2a3c', textAlign: 'center', maxWidth: '450px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <h1 style={{ margin: '0 0 10px', fontSize: '1.8rem', fontWeight: 600 }}>Spatial Memory Sanctuary</h1>
            <p style={{ margin: '0 0 25px', color: '#888', fontSize: '0.9rem', lineHeight: '1.4' }}>
              Upload your video file to bring your memory space into VR.
            </p>

            <label style={{ display: 'block', border: '2px dashed #3a3a4c', padding: '25px', borderRadius: '8px', cursor: 'pointer', background: '#111116', marginBottom: '20px' }}>
              <input type="file" accept="video/*" onChange={handleFileChange} style={{ display: 'none' }} />
              <span style={{ fontSize: '0.95rem', color: selectedFile ? '#33ccff' : '#aaa' }}>
                {selectedFile ? `Selected: ${selectedFile.name}` : '📁 Click to Add Video File'}
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
              }}
            >
              {status === 'processing' ? 'Processing Video Environment & Cloning Voices...' : 'Convert Sanctuary'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 20, fontWeight: 600, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
            <span>✅ Done! Your environment & voice profiles are ready.</span>
          </div>

          {/* Conversation controls & active voice selector */}
          <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 30, textAlign: 'center', background: 'rgba(22, 22, 28, 0.85)', padding: '15px 25px', borderRadius: '10px', border: '1px solid #2a2a3c' }}>
            
            {clonedVoices.length > 0 && (
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '0.8rem', color: '#aaa', marginRight: '8px' }}>Active Speaker Voice:</label>
                <select 
                  value={activeVoiceId || ''} 
                  onChange={(e) => setActiveVoiceId(e.target.value)}
                  style={{ background: '#222', color: 'white', border: '1px solid #444', padding: '4px 8px', borderRadius: '4px' }}
                >
                  {clonedVoices.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            )}

            <button 
              onClick={startListening}
              style={{
                padding: '10px 20px',
                background: isListening ? '#ef4444' : '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              {isListening ? 'Listening...' : '🗣️ Speak to Sanctuary'}
            </button>

            {transcript && <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#ccc' }}>You: "{transcript}"</p>}
            {aiResponse && <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#33ccff' }}>Response: "{aiResponse}"</p>}
          </div>

          <div style={{ position: 'absolute', bottom: '30px', width: '100%', textAlign: 'center', zIndex: 10 }}>
            <VRButton style={{ padding: '12px 28px', fontSize: '1.1rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }} />
          </div>

          <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
            <XR>
              <Controllers />
              <Hands />
              <VirtualRoomScene videoSrc={videoUrl} />
            </XR>
            <OrbitControls enableZoom={true} />
          </Canvas>
        </div>
      )}

    </div>
  )
}
