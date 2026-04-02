import { useState, useCallback, useEffect, useRef } from 'react'

export function useTimer(initialTime = 0) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  const start = useCallback((seconds) => {
    setTimeLeft(seconds)
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resume = useCallback(() => {
    setIsRunning(true)
  }, [])

  const reset = useCallback(() => {
    setTimeLeft(0)
    setIsRunning(false)
  }, [])

  const addTime = useCallback((seconds) => {
    setTimeLeft(prev => Math.max(0, prev + seconds))
  }, [])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance('Tiempo terminado')
              utterance.lang = 'es-ES'
              window.speechSynthesis.speak(utterance)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const formattedTime = useCallback(() => {
    const mins = Math.floor(timeLeft / 60)
    const secs = timeLeft % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [timeLeft])

  return {
    timeLeft,
    isRunning,
    start,
    pause,
    resume,
    reset,
    addTime,
    formattedTime
  }
}
