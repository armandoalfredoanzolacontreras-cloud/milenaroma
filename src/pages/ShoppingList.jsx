import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Check, Share2, Copy } from 'lucide-react'
import { useRecipes } from '../context/RecipeContext'

export default function ShoppingList() {
  const { recipes } = useRecipes()
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [copied, setCopied] = useState(false)

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { id: Date.now(), text: newItem.trim(), checked: false }])
      setNewItem('')
    }
  }

  const toggleItem = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  const removeItem = (id) => {
    setItems(items.filter(i => i.id !== id))
  }

  const addFromRecipe = (recipe) => {
    if (recipe.content) {
      const ingredients = recipe.content.split('\n').filter(l => l.includes('•') || l.includes('-'))
      ingredients.forEach(ing => {
        const text = ing.replace(/^[•\-]\s*/, '').trim()
        if (text) {
          setItems(prev => [...prev, { id: Date.now() + Math.random(), text, checked: false }])
        }
      })
    }
  }

  const handleCopy = async () => {
    const text = items.filter(i => !i.checked).map(i => `☐ ${i.text}`).join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const checkedCount = items.filter(i => i.checked).length

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-10 glass mx-4 mt-4 rounded-2xl px-4 py-3 flex items-center justify-between">
        <button onClick={() => window.history.back()} className="text-[var(--primary)]">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-lg font-semibold text-[var(--primary)]">Lista de Compras</h1>
        <button onClick={handleCopy} className="p-2 text-[var(--primary)]">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {items.length > 0 && (
        <div className="px-4 py-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Progreso</span>
            <span>{checkedCount}/{items.length}</span>
          </div>
          <div className="h-2 bg-[var(--accent)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--primary)] transition-all" style={{ width: `${(checkedCount / items.length) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="px-4 py-4">
        <div className="glass rounded-xl p-4">
          <div className="flex gap-2">
            <input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} placeholder="Ej: 500g de harina..." className="flex-1" />
            <button onClick={addItem} className="btn btn-primary px-4"><Plus className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {recipes.length > 0 && (
        <div className="px-4 mb-4">
          <details className="glass rounded-xl p-3">
            <summary className="cursor-pointer text-sm font-medium">📋 Añadir desde recetas</summary>
            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
              {recipes.map(r => (
                <button key={r.id} onClick={() => addFromRecipe(r)} className="w-full text-left p-2 rounded-lg bg-[var(--background)] hover:bg-[var(--accent)] text-sm">
                  {r.title}
                </button>
              ))}
            </div>
          </details>
        </div>
      )}

      <div className="px-4 space-y-2">
        {items.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-[var(--text-muted)]">Tu lista está vacía</p>
          </div>
        ) : items.map(item => (
          <div key={item.id} className={`glass rounded-xl p-4 flex items-center gap-3 ${item.checked ? 'opacity-50' : ''}`}>
            <button onClick={() => toggleItem(item.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${item.checked ? 'bg-green-500 border-green-500 text-white' : 'border-[var(--primary)]'}`}>
              {item.checked && <Check className="w-4 h-4" />}
            </button>
            <span className={`flex-1 ${item.checked ? 'line-through' : ''}`}>{item.text}</span>
            <button onClick={() => removeItem(item.id)} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {copied && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-full bg-green-500 text-white">
          ¡Copiado!
        </div>
      )}
    </div>
  )
}
