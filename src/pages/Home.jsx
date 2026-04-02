import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { 
  ChefHat, Plus, Search, Video, UtensilsCrossed, Calculator, 
  ShoppingCart, Users, Camera, Trophy, Sparkles, Moon, Sun
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useRecipes } from '../context/RecipeContext'

export default function Home() {
  const { isDark, toggleTheme } = useTheme()
  const { user, profile } = useAuth()
  const { recipes } = useRecipes()
  const navigate = useNavigate()

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

  const features = [
    { icon: Plus, title: 'Crear', color: 'bg-green-500', to: '/create' },
    { icon: Video, title: 'YouTube', color: 'bg-red-500', to: '/youtube' },
    { icon: Search, title: 'Buscar', color: 'bg-blue-500', to: '/search' },
    { icon: Calculator, title: 'Calculadora', color: 'bg-teal-500', to: '/calculator' },
    { icon: ShoppingCart, title: 'Compras', color: 'bg-orange-500', to: '/shopping' },
    { icon: Users, title: 'Amigos', color: 'bg-pink-500', to: '/friends' },
    { icon: Camera, title: 'Fotos', color: 'bg-purple-500', to: '/photos' },
    { icon: Trophy, title: 'Logros', color: 'bg-amber-500', to: '/achievements' },
    { icon: Sparkles, title: 'Gemini', color: 'bg-cyan-500', to: '/gemini' },
  ]

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="pt-24 pb-8 px-4 text-center">
        <h1 className="font-display text-3xl font-bold text-[var(--primary)] mb-2">
          ¡Hola{profile?.full_name?.split(' ')[0] ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p className="text-[var(--text-muted)]">¿Qué vamos a cocinar hoy?</p>
      </section>

      {/* Quick Actions */}
      <section className="px-4 mb-6">
        <div className="flex gap-3">
          <Link to="/create" className="flex-1 btn btn-primary py-4">
            <Plus className="w-5 h-5" /> Nueva
          </Link>
          <Link to="/search" className="flex-1 btn btn-secondary py-4">
            <Search className="w-5 h-5" /> Buscar
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 mb-6">
        <h2 className="font-display text-lg font-semibold text-[var(--primary)] mb-3">Categorías</h2>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => (
            <Link 
              key={cat.name}
              to={`/category/${cat.name.toLowerCase()}`}
              className="glass p-3 text-center hover:scale-105 transition-transform"
            >
              <div className="text-2xl mb-1">{cat.emoji}</div>
              <div className="text-xs font-medium">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Recipes */}
      {recipes.length > 0 && (
        <section className="px-4 mb-6">
          <h2 className="font-display text-lg font-semibold text-[var(--primary)] mb-3">Mis Recetas</h2>
          <div className="space-y-2">
            {recipes.slice(0, 3).map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipe/${recipe.id}`}
                className="glass p-3 flex items-center gap-3 hover:scale-[1.01] transition-transform"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--accent)] flex items-center justify-center text-xl">
                  🍽️
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{recipe.title}</h3>
                  <span className="text-xs text-[var(--text-muted)]">{recipe.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tools */}
      <section className="px-4 mb-6">
        <h2 className="font-display text-lg font-semibold text-[var(--primary)] mb-3">Herramientas</h2>
        <div className="grid grid-cols-3 gap-2">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="glass p-3 text-center hover:scale-105 transition-transform"
            >
              <f.icon className={`w-8 h-8 text-white p-1.5 rounded-xl ${f.color} mx-auto mb-1`} />
              <div className="text-xs font-medium">{f.title}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Chef Tip */}
      <section className="px-4">
        <div className="glass p-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white">
          <div className="flex items-center gap-3">
            <ChefHat className="w-10 h-10" />
            <div>
              <h3 className="font-semibold">Chef dice:</h3>
              <p className="text-sm opacity-90">"La cocina es amor hecho comida. Cada plato lleva tu esencia."</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
