import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Edit2, Trash2, Share2 } from 'lucide-react'
import { useRecipes } from '../context/RecipeContext'

export default function RecipeDetail({ recipeId }) {
  const navigate = useNavigate()
  const { getRecipeById, removeRecipe } = useRecipes()
  const recipe = getRecipeById(recipeId)

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Receta no encontrada</h1>
          <button onClick={() => navigate('/')} className="btn btn-primary">Volver</button>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    if (confirm('¿Eliminar esta receta?')) {
      removeRecipe(recipe.id)
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-10 glass mx-4 mt-4 rounded-2xl px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-[var(--primary)]">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="p-2 text-red-500"><Trash2 className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {recipe.image_url && (
          <div className="rounded-2xl overflow-hidden">
            <img src={recipe.image_url} alt={recipe.title} className="w-full h-64 object-cover" />
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="pill">{recipe.category}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--primary)]">{recipe.title}</h1>
        </div>

        <div className="glass rounded-xl p-6">
          <div dangerouslySetInnerHTML={{ __html: (recipe.content || '').replace(/\n/g, '<br/>') }} className="prose" />
        </div>

        <button onClick={() => navigate(`/cooking/${recipe.id}`)} className="w-full btn btn-primary py-4 text-lg">
          <Play className="w-6 h-6" /> Modo Cocina
        </button>
      </div>
    </div>
  )
}
