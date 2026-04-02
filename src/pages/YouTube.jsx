import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Check, Video } from 'lucide-react'

export default function YouTube() {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [copied, setCopied] = useState(false)

  const extractVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
    return match ? match[1] : null
  }

  const videoId = extractVideoId(url)

  const handleCopy = async () => {
    if (!description.trim()) {
      alert('Primero pega la descripción del video')
      return
    }
    const prompt = `Extrae la receta de este texto:

${description.substring(0, 2000)}

Devuelve: Nombre, Ingredientes, Pasos, Tiempo, Dificultad.`
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-10 glass mx-4 mt-4 rounded-2xl px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-[var(--primary)]">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-lg font-semibold text-[var(--primary)]">Desde YouTube</h1>
        <div className="w-12" />
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="glass rounded-xl p-4">
          <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Enlace del video</label>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full" />
          
          {videoId && (
            <div className="mt-4 rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%', position: 'relative' }}>
              <iframe src={`https://www.youtube.com/embed/${videoId}`} className="absolute top-0 left-0 w-full h-full" allowFullScreen />
            </div>
          )}
        </div>

        <div className="glass rounded-xl p-4">
          <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Descripción o transcripción</label>
          <p className="text-xs text-[var(--text-muted)] mb-2">Copia la descripción del video (click en "...más")</p>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} placeholder="Pega aquí la descripción..." className="w-full resize-none" />
        </div>

        {description.trim() && (
          <div className="glass rounded-xl p-4 space-y-3">
            <h3 className="font-semibold">¿Qué quieres hacer?</h3>
            <button onClick={handleCopy} className="w-full btn btn-primary">
              {copied ? <><Check className="w-5 h-5" /> ¡Copiado!</> : <><Copy className="w-5 h-5" /> Copiar para Gemini</>}
            </button>
            <button onClick={() => navigate('/create', { state: { description } })} className="w-full btn btn-secondary">
              <Video className="w-5 h-5" /> Crear en la app
            </button>
          </div>
        )}

        {copied && (
          <div className="glass rounded-xl p-4 bg-green-50 dark:bg-green-900/20">
            <p className="text-sm text-green-700 dark:text-green-300">1. Abre Gemini (gemini.google.com)<br/>2. Pega el texto copiado<br/>3. Copia la receta y guárdala aquí</p>
          </div>
        )}
      </div>
    </div>
  )
}
