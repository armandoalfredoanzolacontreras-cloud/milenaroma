import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Users, ChefHat } from 'lucide-react'
import { useRecipes } from '../context/RecipeContext'

const CATEGORY_EMOJIS = {
  desayunos: '🥐',
  almuerzos: '🍽️',
  cenas: '🌙',
  entradas: '🥗',
  sopas: '🍲',
  cremas: '🥣',
  ensaladas: '🥬',
  postres: '🍰',
  salados: '🥐',
}

export default function CategoryPage() {
  const { category } = useParams()
  const { recipes } = useRecipes()

  const categoryRecipes = recipes.filter(r => 
    r.category?.toLowerCase() === category.toLowerCase()
  )

  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : ''
  const emoji = CATEGORY_EMOJIS[category?.toLowerCase()] || '🍽️'

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="p-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--primary)]/20 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{emoji}</span>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--primary)]">{categoryName}</h1>
            <p className="text-sm text-[var(--text-muted)]">{categoryRecipes.length} recetas</p>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      {categoryRecipes.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {categoryRecipes.map(recipe => (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              className="card glass overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/40 flex items-center justify-center">
                {recipe.image ? (
                  <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl">{emoji}</span>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1 line-clamp-1">{recipe.title}</h3>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  {recipe.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {recipe.time}
                    </span>
                  )}
                  {recipe.servings && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {recipe.servings}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">{emoji}</span>
          <h2 className="font-display text-xl font-semibold mb-2">Sin recetas aún</h2>
          <p className="text-[var(--text-muted)] mb-6">¡Crea tu primera receta en esta categoría!</p>
          <Link to="/create" className="btn btn-primary inline-flex">
            <ChefHat className="w-5 h-5" />
            Crear Receta
          </Link>
        </div>
      )}
    </div>
  )
}
