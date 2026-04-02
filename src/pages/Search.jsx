import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search as SearchIcon } from 'lucide-react'
import { useRecipes } from '../context/RecipeContext'
import { Link } from 'react-router-dom'

const categories = [
  { name: 'Todos', emoji: '🍽️' },
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

export default function SearchPage() {
  const navigate = useNavigate()
  const { recipes, searchByIngredients } = useRecipes()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todos')
  const [ingredientSearch, setIngredientSearch] = useState('')

  const filtered = recipes.filter(r => {
    const matchQuery = !query || r.title?.toLowerCase().includes(query.toLowerCase()) || r.content?.toLowerCase().includes(query.toLowerCase())
    const matchCat = category === 'Todos' || r.category?.toLowerCase() === category.toLowerCase()
    return matchQuery && matchCat
  })

  const ingredientResults = ingredientSearch.trim() ? searchByIngredients(ingredientSearch.split(',').map(i => i.trim())) : []

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-10 glass mx-4 mt-4 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/')} className="text-[var(--primary)]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-semibold text-[var(--primary)]">Buscar</h1>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar recetas..." className="w-full pl-10" />
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button key={cat.name} onClick={() => setCategory(cat.name)} className={`px-3 py-1 rounded-full whitespace-nowrap text-sm ${category === cat.name ? 'bg-[var(--primary)] text-white' : 'glass'}`}>
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-2">
        <input value={ingredientSearch} onChange={e => setIngredientSearch(e.target.value)} placeholder="Ingredientes: pollo, arroz, tomate..." className="w-full glass rounded-xl p-3" />
        {ingredientSearch.trim() && ingredientResults.length > 0 && (
          <p className="text-sm text-green-600 mt-2">{ingredientResults.length} recetas encontradas</p>
        )}
      </div>

      <div className="px-4 space-y-2">
        {(ingredientSearch.trim() ? ingredientResults : filtered).length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-[var(--text-muted)]">No se encontraron recetas</p>
          </div>
        ) : (ingredientSearch.trim() ? ingredientResults : filtered).map(recipe => (
          <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="glass rounded-xl p-4 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-[var(--accent)] flex items-center justify-center text-xl">🍽️</div>
            <div className="flex-1">
              <h3 className="font-semibold">{recipe.title}</h3>
              <span className="text-xs text-[var(--text-muted)]">{recipe.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
