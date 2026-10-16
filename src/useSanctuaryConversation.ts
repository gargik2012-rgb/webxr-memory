import { useState } from 'react'

export function useSanctuaryConversation() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [dynamicVoiceId, setDynamicVoiceId] = useState<string | null>(null)

  // 1. Automatically clone voice from the uploaded file when user selects it
  const createVoiceCloneFromFile = async (videoFile: File) => {
    const ELEVEN_LABS_API_KEY = 'YOUR_API_KEY_HERE' // Only needs the API key now!
    
    const formData = new FormData()
    formData.append('name', `Memory_Clone_${Date.now()}`)
    formData.append('files', videoFile) // ElevenLabs accepts video/audio files directly to extract voice

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVEN_LABS_API_KEY
        },
        body: formData
      })

      const data = await response.json()
      if (data.voice_id) {
        setDynamicVoiceId(data.voice_id)
        console.log("Successfully cloned voice from uploaded file:", data.voice_id)
      }
    } catch (error) {
      console.error("Error creating voice clone from file:", error)
    }
  }

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

  const handleAiConversation = async (userText: string) => {
    const reply = "It's so good to hear your voice. I'm right here with you."
    setAiResponse(reply)
    await playClonedVoice(reply)
  }

  const playClonedVoice = async (textToSpeak: string) => {
    const ELEVEN_LABS_API_KEY = 'YOUR_API_KEY_HERE'
    const targetVoiceId = dynamicVoiceId || 'DEFAULT_FALLBACK_VOICE_ID'

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

  return { isListening, transcript, aiResponse, startListening, createVoiceCloneFromFile }
}
