import { useState } from 'react'
import { Sparkles, Send, Loader2, ChefHat, Lightbulb, RefreshCw } from 'lucide-react'

const PROMPTS = [
  { title: 'Inspírame', prompt: 'Dame una idea de receta para esta noche con ingredientes que tengo en casa', icon: '💡' },
  { title: 'Veggie', prompt: 'Crea una receta vegetariana deliciosa', icon: '🥗' },
  { title: 'Rápido', prompt: 'Dame una receta que pueda hacer en menos de 30 minutos', icon: '⚡' },
  { title: 'Fit', prompt: 'Crea una receta saludable y baja en calorías', icon: '💪' },
  { title: 'Dulce', prompt: 'Inspírame con una receta de postre irresistible', icon: '🍰' },
  { title: 'Familiar', prompt: 'Dame una receta para toda la familia que les encante', icon: '👨‍👩‍👧‍👦' },
]

const SUGGESTIONS = [
  '¿Qué puedo cocinar con pollo, arroz y verduras?',
  'Dame una receta de pasta italiana auténtica',
  'Ideas para lunch boxes saludables',
  'Receta de salsa para tacos mexicanos',
]

export default function Gemini() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState(null)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const responses = [
        "¡Qué interesante pregunta culinaria! Basándome en tu solicitud, te recomiendo probar una combinación de sabores frescos y texturas crujientes. Los ingredientes de temporada siempre aportan el mejor sabor a tus platillos.",
        "¡Excelente elección! Para lograr un resultado perfecto, es importante prestar atención a los tiempos de cocción y la temperatura. Te sugiero preparar los ingredientes con anticipación para que todo fluya smoothly en la cocina.",
        "¡Me encanta esa idea! La cocina es un arte que combina creatividad con técnica. Te recomiendo experimentar con especias y hierbas frescas para realzar los sabores naturales de tus ingredientes.",
        "¡Qué bueno que preguntes! Hay muchas técnicas que pueden elevar tu cocina al siguiente nivel. Desde marinados perfectos hasta el punto exacto de cocción, cada detalle cuenta para crear algo especial.",
      ]
      const botMessage = { 
        role: 'assistant', 
        text: responses[Math.floor(Math.random() * responses.length)]
      }
      setMessages(prev => [...prev, botMessage])
      setLoading(false)
    }, 1500)
  }

  const usePrompt = (prompt) => {
    setInput(prompt)
    setSelectedPrompt(prompt)
  }

  const clearChat = () => {
    setMessages([])
    setSelectedPrompt(null)
  }

  return (
    <div className="min-h-screen pb-24 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--primary)]">Chef AI</h1>
            <p className="text-xs text-[var(--text-muted)]">Powered by Gemini</p>
          </div>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Pide inspiración, consejos o ayuda con tus recetas
        </p>
      </div>

      {/* Quick Prompts */}
      {messages.length === 0 && (
        <div className="px-4 mb-4">
          <h2 className="text-sm font-semibold mb-3">Prompts Rápidos</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => usePrompt(p.prompt)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] rounded-full text-sm whitespace-nowrap hover:bg-[var(--primary)]/20 transition-colors"
              >
                <span>{p.icon}</span>
                {p.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 px-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-[var(--primary)] text-white rounded-br-md' 
                : 'glass rounded-bl-md'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-xs font-semibold text-[var(--primary)]">Chef AI</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="glass p-4 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Pensando...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-4 bg-[var(--surface)] border-t border-[var(--primary)]/10">
        {messages.length > 0 && (
          <button onClick={clearChat} className="text-xs text-[var(--text-muted)] mb-2 hover:text-[var(--primary)]">
            <RefreshCw className="w-3 h-3 inline mr-1" /> Nueva conversación
          </button>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="btn btn-primary px-4 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
