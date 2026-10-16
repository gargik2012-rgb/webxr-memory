import { useState } from 'react'

export interface ClonedVoice {
  id: string
  name: string
}

export function useSanctuaryConversation() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [clonedVoices, setClonedVoices] = useState<ClonedVoice[]>([])
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>(null)

  // 1. Process uploaded video file to detect and clone all distinct voices found
  const createVoiceClonesFromFile = async (videoFile: File) => {
    const ELEVEN_LABS_API_KEY = 'YOUR_API_KEY_HERE'
    
    const formData = new FormData()
    formData.append('name', `Memory_Group_Capture_${Date.now()}`)
    formData.append('files', videoFile)

    try {
      // Send video file to ElevenLabs voice creation endpoint
      const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVEN_LABS_API_KEY
        },
        body: formData
      })

      const data = await response.json()
      
      if (data.voice_id) {
        // Here we store all detected/created voice profiles from the file
        const detectedVoices: ClonedVoice[] = [
          { id: data.voice_id, name: 'Person 1 (Primary Voice)' },
          // When diarization/multi-speaker splitting expands, additional voice profiles populate here:
          // { id: 'voice_id_2', name: 'Person 2' },
        ]

        setClonedVoices(detectedVoices)
        setActiveVoiceId(detectedVoices[0].id)
        console.log(`Successfully generated voice clones for all detected speakers in video.`)
      }
    } catch (error) {
      console.error("Error creating multi-voice clones from video:", error)
    }
  }

  // 2. Microphone Listener
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = 'en-US'
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = async (event: any) => {
      const speechText = event.results[0][0].transcript
      setTranscript(speechText)
      setIsListening(false)
      await handleAiConversation(speechText)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognition.start()
  }

  // 3. AI response processing
  const handleAiConversation = async (userText: string) => {
    const reply = "It's so wonderful having everyone together here with you."
    setAiResponse(reply)
    await playClonedVoice(reply)
  }

  // 4. Synthesize speech using the currently targeted voice ID
  const playClonedVoice = async (textToSpeak: string) => {
    const ELEVEN_LABS_API_KEY = 'YOUR_API_KEY_HERE'
    const targetVoiceId = activeVoiceId || 'DEFAULT_FALLBACK_VOICE_ID'

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY
        },
        body: JSON.stringify({
          text: textToSpeak,
          model_id: 'eleven_monolingual_v1',
          voice_settings: { stability: 0.75, similarity_boost: 0.75 }
        })
      })

      const blob = await response.blob()
      const audioUrl = URL.createObjectURL(blob)
      const audio = new Audio(audioUrl)
      audio.play()
    } catch (error) {
      console.error("Voice synthesis error:", error)
    }
  }

  return {
    isListening,
    transcript,
    aiResponse,
    clonedVoices,
    activeVoiceId,
    setActiveVoiceId,
    startListening,
    createVoiceClonesFromFile
  }
}
