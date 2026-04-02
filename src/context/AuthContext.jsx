import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError(sessionError)
        }
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          loadProfile(session.user.id)
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Auth init error:', err)
        if (mounted) {
          setError(err)
          setLoading(false)
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth loading timeout - proceeding anyway')
        setLoading(false)
      }
    }, 5000)

    return () => {
      mounted = false
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const loadProfile = async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data)
    } catch (err) {
      console.error('Profile load error:', err)
    }
  }

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error && data.user) {
        await loadProfile(data.user.id)
      }
      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const signup = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (!error && data.user) {
        try {
          await supabase.from('profiles').insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            avatar_url: null
          })
        } catch (profileErr) {
          console.error('Profile creation error:', profileErr)
        }
        await loadProfile(data.user.id)
      }
      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Logout error:', err)
    }
    setUser(null)
    setProfile(null)
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: 'No user' }
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
      if (!error) {
        setProfile(prev => ({ ...prev, ...updates }))
      }
      return { error }
    } catch (err) {
      return { error: err }
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      loading, 
      error,
      login, 
      signup,
      logout,
      updateProfile,
      isDemo: false 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
