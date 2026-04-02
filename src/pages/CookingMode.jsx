import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Clock, Plus, Minus } from 'lucide-react'
import { useRecipes } from '../context/RecipeContext'
import { useVoice } from '../hooks/useVoice'
import { useTimer } from '../hooks/useTimer'

export default function CookingMode({ recipeId }) {
  const navigate = useNavigate()
  const { getRecipeById } = useRecipes()
  const { speak, stop, isSpeaking } = useVoice()
  const { timeLeft, isRunning, start, pause, resume, addTime, formattedTime } = useTimer()
  
  const recipe = getRecipeById(recipeId)
  
  const [currentStep, setCurrentStep] = useState(0)
  const [showTimer, setShowTimer] = useState(false)

  const steps = recipe?.content?.split(/\n\d+\.\s/).filter(s => s.trim()) || []
  
  const handlePlay = () => {
    if (steps[currentStep]) {
      speak(`Paso ${currentStep + 1}. ${steps[currentStep]}`)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRepeat = () => {
    if (steps[currentStep]) {
      speak(steps[currentStep])
    }
  }

  const handleTimer = () => {
    if (timeLeft > 0) {
      setShowTimer(!showTimer)
    } else {
      start(300)
      setShowTimer(true)
      speak('Temporizador de 5 minutos')
    }
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-[var(--text-muted)] mb-4">Receta no encontrada</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">Volver</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--primary)] text-white">
      <div className="p-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-semibold">Modo Cocina</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 text-center mb-8">
        <h2 className="text-2xl font-bold">{recipe.title}</h2>
        <p className="opacity-75">Paso {currentStep + 1} de {steps.length}</p>
      </div>

      <div className="px-4 mb-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 min-h-[250px] flex items-center justify-center">
          <p className="text-xl text-center">{steps[currentStep] || 'Cargando...'}</p>
        </div>
      </div>

      {showTimer && timeLeft > 0 && (
        <div className="mx-4 mb-4 bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-center">
          <div className="text-5xl font-mono font-bold mb-4">{formattedTime}</div>
          <div className="flex justify-center gap-4">
            <button onClick={() => addTime(60)} className="p-3 bg-white/10 rounded-full"><Plus className="w-5 h-5" /></button>
            <button onClick={isRunning ? pause : resume} className="p-4 bg-white text-[var(--primary)] rounded-full">
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button onClick={() => addTime(-60)} className="p-3 bg-white/10 rounded-full"><Minus className="w-5 h-5" /></button>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-[var(--primary)] p-4 safe-area-bottom">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={handlePrev} disabled={currentStep === 0} className="p-4 bg-white/10 rounded-full disabled:opacity-30">
            <SkipBack className="w-6 h-6" />
          </button>
          
          <div className="flex gap-3">
            <button onClick={handleRepeat} className="p-3 bg-white/10 rounded-full">
              <Volume2 className="w-5 h-5" />
            </button>
            <button onClick={handlePlay} className="p-6 bg-white text-[var(--primary)] rounded-full shadow-lg">
              {isSpeaking ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </button>
            <button onClick={() => setShowTimer(!showTimer)} className={`p-3 rounded-full ${showTimer ? 'bg-white text-[var(--primary)]' : 'bg-white/10'}`}>
              <Clock className="w-5 h-5" />
            </button>
          </div>
          
          <button onClick={handleNext} disabled={currentStep === steps.length - 1} className="p-4 bg-white/10 rounded-full disabled:opacity-30">
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2 text-sm opacity-75">
          <button onClick={() => speak('Lento')} className="px-3 py-1 bg-white/10 rounded-full">Lento</button>
          <button onClick={() => speak('Normal')} className="px-3 py-1 bg-white rounded-full text-[var(--primary)]">Normal</button>
          <button onClick={() => speak('Rápido')} className="px-3 py-1 bg-white/10 rounded-full">Rápido</button>
        </div>
      </div>
    </div>
  )
}
