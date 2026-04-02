import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  Mic, 
  MicOff, 
  Image,
  X,
  Bold,
  Italic,
  List,
  Camera
} from 'lucide-react'
import { useRecipes } from '../context/RecipeContext'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

const categories = [
  { name: 'Desayunos', emoji: '🥐' },
  { name: 'Almuerzos', emoji: '🍽️' },
  { name: 'Cenas', emoji: '🌙' },
  { name: 'Entradas', emoji: '🥗' },
  { name: 'Sopas', emoji: '🍲' },
  { name: 'Cremas', emoji: '🥣' },
  { name: 'Ensaladas', emoji: '🥬' },
  { name: 'Postres', emoji: '🍰' },
  { name: 'Salados', emoji: '🥐' }
]

export default function CreateRecipe() {
  const navigate = useNavigate()
  const { addRecipe } = useRecipes()
  const { 
    transcript, 
    interimTranscript, 
    isListening, 
    isSupported: speechSupported,
    startListening, 
    stopListening, 
    toggleListening,
    clearTranscript 
  } = useSpeechRecognition()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  
  const editorRef = null
  const fileInputRef = { current: null }
  const cameraInputRef = { current: null }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSpeechResult = (text) => {
    setContent(prev => prev + text)
  }

  const insertAtCursor = (text) => {
    setContent(prev => prev + text)
  }

  const handleSave = () => {
    if (!title.trim()) {
      alert('Por favor ingresa un título para la receta')
      return
    }

    setSaving(true)
    
    const recipe = {
      title: title.trim(),
      content: content,
      category: category || 'almuerzos',
      image_url: imagePreview,
      servings: 4,
      time: '',
      difficulty: 'Fácil'
    }

    addRecipe(recipe)
    setSaving(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 glass mx-4 mt-4 rounded-2xl px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[var(--primary)]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <h1 className="font-display text-lg font-semibold text-[var(--primary)]">
          Nueva Receta
        </h1>
        
        <button 
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className="btn btn-primary px-4 py-2 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : (
            <>
              <Save className="w-4 h-4" />
              Guardar
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Image */}
        {imagePreview ? (
          <div className="relative rounded-2xl overflow-hidden">
            <img 
              src={imagePreview} 
              alt="Recipe" 
              className="w-full h-48 object-cover"
            />
            <button
              onClick={() => {
                setImage(null)
                setImagePreview(null)
              }}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 glass p-4 flex items-center justify-center gap-2 text-[var(--text-muted)]"
            >
              <Image className="w-5 h-5" />
              <span>Subir imagen</span>
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 glass p-4 flex items-center justify-center gap-2 text-[var(--text-muted)]"
            >
              <Camera className="w-5 h-5" />
              <span>Tomar foto</span>
            </button>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          capture="environment"
          className="hidden"
        />

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nombre de la receta..."
          className="text-2xl font-display font-bold bg-transparent border-none outline-none w-full placeholder:text-[var(--text-muted)]"
        />

        {/* Category */}
        <div className="relative">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="pill flex items-center gap-2"
          >
            {category ? (
              <>
                {categories.find(c => c.name.toLowerCase() === category)?.emoji}
                <span>{category}</span>
              </>
            ) : (
              <span>Seleccionar categoría</span>
            )}
          </button>
          
          {showCategories && (
            <div className="absolute top-full left-0 mt-2 glass p-2 rounded-xl grid grid-cols-3 gap-2 z-20">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setCategory(cat.name.toLowerCase())
                    setShowCategories(false)
                  }}
                  className="p-2 rounded-lg hover:bg-[var(--accent)] flex flex-col items-center"
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="text-xs">{cat.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Editor Toolbar */}
        <div className="glass rounded-xl p-2 flex items-center gap-2">
          <button 
            onClick={() => insertAtCursor('**texto**')}
            className="p-2 rounded-lg hover:bg-[var(--accent)]"
            title="Negrita"
          >
            <Bold className="w-5 h-5" />
          </button>
          <button 
            onClick={() => insertAtCursor('*texto*')}
            className="p-2 rounded-lg hover:bg-[var(--accent)]"
            title="Cursiva"
          >
            <Italic className="w-5 h-5" />
          </button>
          <button 
            onClick={() => insertAtCursor('\n• ')}
            className="p-2 rounded-lg hover:bg-[var(--accent)]"
            title="Lista"
          >
            <List className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          {speechSupported && (
            <button
              onClick={toggleListening}
              className={`p-2 rounded-lg ${isListening ? 'bg-red-500 text-white' : 'hover:bg-[var(--accent)]'}`}
              title={isListening ? 'Detener' : 'Dictar'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Editor */}
        <div className="glass rounded-xl p-4 min-h-[400px]">
          <textarea
            value={content + (interimTranscript ? interimTranscript : '')}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Escribe o dicta tu receta aquí...

Ejemplo:
## Ingredientes
• 2 tazas de harina
• 1 taza de azúcar
• 3 huevos

## Preparación
1. Precalienta el horno a 180°C
2. Mezcla los ingredientes secos
3. Añade los huevos y bate bien...`}
            className="w-full h-[400px] bg-transparent border-none outline-none resize-none placeholder:text-[var(--text-muted)] leading-relaxed"
          />
        </div>

        {/* Tips */}
        {isListening && (
          <div className="glass p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
            <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <Mic className="w-4 h-4 animate-pulse" />
              Escuchando... habla claro y pausado
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-[var(--text-muted)] space-y-1">
          <p><strong>Para dictar:</strong> Usa el botón del micrófono en la barra de herramientas</p>
          <p><strong>Para formatear:</strong> Usa los botones de negrita, cursiva y listas</p>
        </div>
      </div>
    </div>
  )
}
