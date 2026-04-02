import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const RecipeContext = createContext()
const LOCAL_STORAGE_KEY = 'milenaroma_recipes'
const LOCAL_PHOTOS_KEY = 'milenaroma_photos'

export function RecipeProvider({ children }) {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadRecipes()
      loadPhotos()
    } else {
      setRecipes([])
      setPhotos([])
      setLoading(false)
    }
  }, [user])

  const loadRecipes = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        setRecipes(data)
      } else {
        const localRecipes = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (localRecipes) {
          setRecipes(JSON.parse(localRecipes))
        }
      }
    } catch (error) {
      console.error('Error loading recipes from Supabase:', error)
      const localRecipes = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (localRecipes) {
        setRecipes(JSON.parse(localRecipes))
      }
    }
    setLoading(false)
  }

  const loadPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setPhotos(data)
      }
    } catch (error) {
      console.error('Error loading photos:', error)
    }
  }

  const addRecipe = async (recipe) => {
    const recipeWithId = {
      ...recipe,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    }

    if (!user) {
      const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
      saved.unshift(recipeWithId)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saved))
      setRecipes(prev => [recipeWithId, ...prev])
      return { data: recipeWithId, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert([{
          title: recipe.title,
          content: recipe.content,
          category: recipe.category,
          image_url: recipe.image_url,
          servings: recipe.servings || 4,
          time: recipe.time || '',
          difficulty: recipe.difficulty || 'Fácil',
          user_id: user.id
        }])
        .select()
        .single()

      if (error) throw error

      if (data) {
        setRecipes(prev => [data, ...prev])
        const localRecipes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
        localRecipes.unshift(data)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localRecipes))
        return { data, error: null }
      }
    } catch (error) {
      console.error('Error saving to Supabase, saving locally:', error)
      const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
      saved.unshift(recipeWithId)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saved))
      setRecipes(prev => [recipeWithId, ...prev])
      return { data: recipeWithId, error: null }
    }

    return { data: recipeWithId, error: null }
  }

  const editRecipe = async (id, updates) => {
    if (!user) {
      const localRecipes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
      const index = localRecipes.findIndex(r => r.id === id)
      if (index !== -1) {
        localRecipes[index] = { ...localRecipes[index], ...updates }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localRecipes))
        setRecipes(localRecipes)
        return { data: localRecipes[index], error: null }
      }
    }

    try {
      const { data, error } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      if (data) {
        setRecipes(prev => prev.map(r => r.id === id ? data : r))
      }
      return { data, error: null }
    } catch (error) {
      console.error('Error updating recipe:', error)
      return { data: null, error }
    }
  }

  const removeRecipe = async (id) => {
    if (!user) {
      const localRecipes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
      const filtered = localRecipes.filter(r => r.id !== id)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered))
      setRecipes(filtered)
      return { error: null }
    }

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)

      if (error) throw error

      setRecipes(prev => prev.filter(r => r.id !== id))
      return { error: null }
    } catch (error) {
      console.error('Error deleting recipe:', error)
      return { error }
    }
  }

  const getRecipeById = (id) => {
    return recipes.find(r => r.id === id || r.id === parseInt(id) || r.id === String(id))
  }

  const searchByIngredients = (ingredients) => {
    if (!ingredients || ingredients.length === 0) return recipes
    const searchTerms = ingredients.map(i => i.toLowerCase())
    return recipes.filter(recipe => {
      const recipeContent = (recipe.content || '').toLowerCase()
      const recipeTitle = (recipe.title || '').toLowerCase()
      return searchTerms.some(term => 
        recipeContent.includes(term) || recipeTitle.includes(term)
      )
    })
  }

  const getByCategory = (category) => {
    if (!category || category === 'all' || category === 'Todos') return recipes
    return recipes.filter(r => 
      r.category?.toLowerCase() === category.toLowerCase()
    )
  }

  const addPhoto = async (photo) => {
    if (!user) {
      const localPhotos = JSON.parse(localStorage.getItem(LOCAL_PHOTOS_KEY) || '[]')
      const newPhoto = { ...photo, id: Date.now().toString(), liked: false }
      localPhotos.unshift(newPhoto)
      localStorage.setItem(LOCAL_PHOTOS_KEY, JSON.stringify(localPhotos))
      setPhotos(localPhotos)
      return { data: newPhoto, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('photos')
        .insert([{
          image: photo.image,
          caption: photo.caption || '',
          recipe_id: photo.recipeId || null,
          user_id: user.id
        }])
        .select()
        .single()

      if (error) throw error

      if (data) {
        setPhotos(prev => [data, ...prev])
      }
      return { data, error: null }
    } catch (error) {
      console.error('Error saving photo:', error)
      const localPhotos = JSON.parse(localStorage.getItem(LOCAL_PHOTOS_KEY) || '[]')
      const newPhoto = { ...photo, id: Date.now().toString(), liked: false }
      localPhotos.unshift(newPhoto)
      localStorage.setItem(LOCAL_PHOTOS_KEY, JSON.stringify(localPhotos))
      setPhotos(localPhotos)
      return { data: newPhoto, error: null }
    }
  }

  const deletePhoto = async (id) => {
    if (!user) {
      const localPhotos = JSON.parse(localStorage.getItem(LOCAL_PHOTOS_KEY) || '[]')
      const filtered = localPhotos.filter(p => p.id !== id)
      localStorage.setItem(LOCAL_PHOTOS_KEY, JSON.stringify(filtered))
      setPhotos(filtered)
      return { error: null }
    }

    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', id)

      if (error) throw error

      setPhotos(prev => prev.filter(p => p.id !== id))
      return { error: null }
    } catch (error) {
      console.error('Error deleting photo:', error)
      return { error }
    }
  }

  return (
    <RecipeContext.Provider value={{
      recipes,
      photos,
      loading,
      addRecipe,
      editRecipe,
      removeRecipe,
      getRecipeById,
      searchByIngredients,
      getByCategory,
      addPhoto,
      deletePhoto,
      refreshRecipes: loadRecipes
    }}>
      {children}
    </RecipeContext.Provider>
  )
}

export function useRecipes() {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error('useRecipes must be used within RecipeProvider')
  }
  return context
}
