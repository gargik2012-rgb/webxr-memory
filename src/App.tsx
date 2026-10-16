// Inside App.tsx
  const { isListening, transcript, aiResponse, startListening, createVoiceCloneFromFile } = useSanctuaryConversation()

  const handleUploadAndConvert = async () => {
    if (!selectedFile) return
    setStatus('processing')
    
    // Automatically clone the voice from the uploaded file on ElevenLabs
    await createVoiceCloneFromFile(selectedFile)

    setTimeout(() => {
      setStatus('ready')
    }, 2000)
  }
