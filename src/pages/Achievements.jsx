import { useState, useEffect } from 'react'
import { Trophy, Star, Lock, CheckCircle2, Flame, Zap, Target, Award } from 'lucide-react'

const ALL_ACHIEVEMENTS = [
  { id: 'first_recipe', title: 'Primera Receta', desc: 'Crea tu primera receta', icon: '📝', category: 'recipes', requirement: 1 },
  { id: 'chef_apprentice', title: 'Aprendiz de Chef', desc: 'Crea 5 recetas', icon: '👨‍🍳', category: 'recipes', requirement: 5 },
  { id: 'master_chef', title: 'Chef Master', desc: 'Crea 25 recetas', icon: '⭐', category: 'recipes', requirement: 25 },
  { id: 'first_photo', title: 'Primer Click', desc: 'Sube tu primera foto', icon: '📸', category: 'photos', requirement: 1 },
  { id: 'photo_pro', title: 'Fotógrafo Pro', desc: 'Sube 10 fotos', icon: '🎨', category: 'photos', requirement: 10 },
  { id: 'streak_3', title: 'Racha de 3', desc: 'Cocina 3 días seguidos', icon: '🔥', category: 'streaks', requirement: 3 },
  { id: 'streak_7', title: 'Semana Perfecta', desc: 'Cocina 7 días seguidos', icon: '💪', category: 'streaks', requirement: 7 },
  { id: 'streak_30', title: 'Mes de Cocina', desc: 'Cocina 30 días seguidos', icon: '🏆', category: 'streaks', requirement: 30 },
  { id: 'shopping_master', title: 'Rey del Mercado', desc: 'Completa 10 listas de compras', icon: '🛒', category: 'shopping', requirement: 10 },
  { id: 'calculator_pro', title: 'Matemático Culinario', desc: 'Usa la calculadora 20 veces', icon: '🧮', category: 'tools', requirement: 20 },
  { id: 'night_owl', title: 'Búho Nocturno', desc: 'Usa la app después de las 10pm', icon: '🦉', category: 'special', requirement: 1 },
  { id: 'early_bird', title: 'Madrugador', desc: 'Usa la app antes de las 7am', icon: '🐦', category: 'special', requirement: 1 },
]

export default function Achievements() {
  const [achievements, setAchievements] = useState([])
  const [stats, setStats] = useState({
    recipes: 0,
    photos: 0,
    streak: 0,
    shopping: 0,
    calculator: 0,
    lateNight: false,
    earlyMorning: false,
  })

  useEffect(() => {
    const saved = localStorage.getItem('milenaroma_achievements')
    const savedStats = localStorage.getItem('milenaroma_stats')
    if (saved) setAchievements(JSON.parse(saved))
    if (savedStats) setStats(JSON.parse(savedStats))
  }, [])

  const checkAchievements = () => {
    const newAchievements = [...achievements]
    let updated = false

    ALL_ACHIEVEMENTS.forEach(ach => {
      if (newAchievements.includes(ach.id)) return

      let earned = false
      const cat = ach.category
      const req = ach.requirement

      if (cat === 'recipes' && stats.recipes >= req) earned = true
      if (cat === 'photos' && stats.photos >= req) earned = true
      if (cat === 'streaks' && stats.streak >= req) earned = true
      if (cat === 'shopping' && stats.shopping >= req) earned = true
      if (cat === 'tools' && stats.calculator >= req) earned = true
      if (cat === 'special' && ((ach.id === 'night_owl' && stats.lateNight) || (ach.id === 'early_bird' && stats.earlyMorning))) earned = true

      if (earned) {
        newAchievements.push(ach.id)
        updated = true
      }
    })

    if (updated) {
      setAchievements(newAchievements)
      localStorage.setItem('milenaroma_achievements', JSON.stringify(newAchievements))
    }
  }

  useEffect(() => {
    checkAchievements()
  }, [stats])

  const categories = [
    { id: 'recipes', label: 'Recetas', icon: '📝' },
    { id: 'photos', label: 'Fotos', icon: '📸' },
    { id: 'streaks', label: 'Rachas', icon: '🔥' },
    { id: 'shopping', label: 'Compras', icon: '🛒' },
    { id: 'tools', label: 'Herramientas', icon: '🧮' },
    { id: 'special', label: 'Especiales', icon: '✨' },
  ]

  const [activeCategory, setActiveCategory] = useState('all')

  const filteredAchievements = activeCategory === 'all'
    ? ALL_ACHIEVEMENTS
    : ALL_ACHIEVEMENTS.filter(a => a.category === activeCategory)

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <h1 className="font-display text-2xl font-bold text-[var(--primary)] mb-2">🏆 Logros</h1>
      <p className="text-[var(--text-muted)] mb-6">{achievements.length} de {ALL_ACHIEVEMENTS.length} desbloqueados</p>

      {/* Progress Bar */}
      <div className="glass p-4 rounded-3xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progreso Total</span>
          <span className="text-sm text-[var(--primary)] font-bold">
            {Math.round((achievements.length / ALL_ACHIEVEMENTS.length) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-[var(--accent)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] transition-all duration-500"
            style={{ width: `${(achievements.length / ALL_ACHIEVEMENTS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeCategory === 'all' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--accent)]'
          }`}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeCategory === cat.id ? 'bg-[var(--primary)] text-white' : 'bg-[var(--accent)]'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredAchievements.map(ach => {
          const earned = achievements.includes(ach.id)
          return (
            <div
              key={ach.id}
              className={`glass p-4 rounded-2xl text-center transition-all ${
                earned ? 'ring-2 ring-[var(--primary)]' : 'opacity-60'
              }`}
            >
              <div className={`text-4xl mb-2 ${earned ? '' : 'grayscale'}`}>
                {earned ? ach.icon : '🔒'}
              </div>
              <h3 className="font-semibold text-sm mb-1">{ach.title}</h3>
              <p className="text-xs text-[var(--text-muted)]">{ach.desc}</p>
              {earned && (
                <div className="mt-2 flex items-center justify-center gap-1 text-[var(--primary)]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-medium">¡Logrado!</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
