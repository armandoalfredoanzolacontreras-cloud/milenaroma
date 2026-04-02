import { useState, useCallback } from 'react'

export function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)

  const speak = useCallback((text, lang = 'es-ES') => {
    if (!('speechSynthesis' in window)) {
      setError('Speech synthesis not supported')
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 1.0
    utterance.pitch = 1.0
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = (e) => {
      setIsSpeaking(false)
      setError(e.error)
    }

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'es-ES'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript)
      }
    }
    recognition.onerror = (event) => {
      setError(event.error)
      setIsListening(false)
    }
    recognition.onend = () => setIsListening(false)

    recognition.start()
  }, [])

  const stopListening = useCallback(() => {
    window.speechRecognition?.stop()
    setIsListening(false)
  }, [])

  return {
    speak,
    stop,
    isSpeaking,
    startListening,
    stopListening,
    isListening,
    transcript,
    error
  }
}
