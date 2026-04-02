import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, Mail, Lock, User, ArrowRight, Loader2, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, signup } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Por favor completa todos los campos')
      setLoading(false)
      return
    }

    if (!isLogin && !fullName) {
      setError('Por favor ingresa tu nombre')
      setLoading(false)
      return
    }

    try {
      let result
      if (isLogin) {
        result = await login(email, password)
      } else {
        result = await signup(email, password, fullName)
      }

      if (result.error) {
        setError(result.error.message || 'Error al iniciar sesión')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[var(--background)] to-[var(--accent)]">
      {/* Logo */}
      <div className="mb-8 text-center animate-fade">
        <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center shadow-lg">
          <ChefHat className="w-14 h-14 text-white" />
        </div>
        <h1 className="font-display text-4xl font-bold text-[var(--primary)] mb-2">MilenAroma</h1>
        <p className="text-[var(--text-muted)]">Tu asistente culinario personal</p>
      </div>

      {/* Login/Signup Card */}
      <div className="w-full max-w-sm glass p-8 rounded-3xl animate-slide">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-semibold mb-2">
            {isLogin ? '¡Bienvenida de nuevo!' : 'Crear cuenta'}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {isLogin 
              ? 'Entra para continuar cocinando deliciosas recetas' 
              : 'Regístrate para guardar tus recetas en la nube'
            }
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Tu nombre"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-4 text-lg disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="w-5 h-5" />
                Iniciar Sesión
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Crear Cuenta
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
            className="text-[var(--primary)] font-medium text-sm hover:underline"
          >
            {isLogin 
              ? '¿No tienes cuenta? Regístrate' 
              : '¿Ya tienes cuenta? Inicia sesión'
            }
          </button>
        </div>
      </div>

      {/* Features Preview */}
      <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm animate-fade" style={{ animationDelay: '0.2s' }}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
            <span className="text-xl">📝</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Crear recetas</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[var(--secondary)]/20 flex items-center justify-center">
            <span className="text-xl">🎥</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">YouTube</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-amber-100 flex items-center justify-center">
            <span className="text-xl">🏆</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Logros</p>
        </div>
      </div>
    </div>
  )
}
