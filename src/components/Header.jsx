import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { Home, Plus, Search, Video, UtensilsCrossed, Calculator, ShoppingCart, Moon, Sun, LogOut } from 'lucide-react'

export default function Header() {
  const { isDark, toggleTheme } = useTheme()
  const { logout, user, profile } = useAuth()
  const location = useLocation()

  const mainNav = [
    { icon: Home, path: '/', label: 'Inicio' },
    { icon: Plus, path: '/create', label: 'Crear' },
    { icon: Search, path: '/search', label: 'Buscar' },
    { icon: UtensilsCrossed, path: '/category/desayunos', label: 'Cocinar' },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 safe-area-top">
        <div className="bg-[var(--surface)]/90 backdrop-blur-lg border-b border-[var(--primary)]/10">
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center">
                  <span className="text-white text-lg">🍳</span>
                </div>
                <div>
                  <h1 className="font-display font-bold text-[var(--primary)] leading-tight">MilenAroma</h1>
                  <p className="text-[8px] text-[var(--text-muted)] -mt-0.5">Tu asistente culinario</p>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl hover:bg-[var(--accent)]/50 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl hover:bg-red-100 text-red-500 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
        <div className="bg-[var(--surface)]/95 backdrop-blur-lg border-t border-[var(--primary)]/10">
          <div className="max-w-lg mx-auto px-2">
            <div className="flex items-center justify-around py-2">
              {mainNav.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                      isActive
                        ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                        : 'text-[var(--text-muted)] hover:text-[var(--primary)]'
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
