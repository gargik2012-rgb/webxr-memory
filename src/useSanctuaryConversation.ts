import { useState } from 'react'

export function useSanctuaryConversation() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiResponse, setAiResponse] = useState('')

  // 1. Listen to user speech from the headset/browser mic
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = async (event: any) => {
      const speechText = event.results[0][0].transcript
      setTranscript(speechText)
      setIsListening(false)

      // 2. Send transcribed text to your AI backend / LLM persona
      await handleAiConversation(speechText)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  // 3. Process conversational response and trigger cloned voice playback
  const handleAiConversation = async (userText: string) => {
    // Simulated AI response matching grandfather persona
    const reply = `Hello there. It's so good to see you in here. How are you holding up today?`
    setAiResponse(reply)

    // 4. Call ElevenLabs API (or your backend endpoint) with your voice clone ID
    await playClonedVoice(reply)
  }

  const playClonedVoice = async (textToSpeak: string) => {
    const ELEVEN_LABS_API_KEY = 'YOUR_API_KEY_HERE'
    const VOICE_ID = 'YOUR_GRANDFATHER_CLONED_VOICE_ID'

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
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
      audio.play() // In Three.js, this will later be mapped to a PositionalAudio object in the room
    } catch (error) {
      console.error("Voice synthesis error:", error)
    }
  }

  return { isListening, transcript, aiResponse, startListening }
}
