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

const handleUploadAndConvert = async () => {
  if (!selectedFile) return
  setStatus('processing')
  
  // Clone all detected speaker voices from the uploaded video
  await createVoiceClonesFromFile(selectedFile)

  setTimeout(() => {
    setStatus('ready')
  }, 2000)
}
