import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const RecipeContext = createContext()

export function RecipeProvider({ children }) {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  // Load recipes and photos when user changes
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
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRecipes(data)
    }
    setLoading(false)
  }

  const loadPhotos = async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setPhotos(data)
    }
  }

  const addRecipe = async (recipe) => {
    if (!user) return { error: 'No user logged in' }

    const newRecipe = {
      ...recipe,
      user_id: user.id
    }

    const { data, error } = await supabase
      .from('recipes')
      .insert(newRecipe)
      .select()
      .single()

    if (!error && data) {
      setRecipes(prev => [data, ...prev])
    }
    return { data, error }
  }

  const editRecipe = async (id, updates) => {
    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setRecipes(prev => prev.map(r => r.id === id ? data : r))
    }
    return { data, error }
  }

  const removeRecipe = async (id) => {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)

    if (!error) {
      setRecipes(prev => prev.filter(r => r.id !== id))
    }
    return { error }
  }

  const getRecipeById = (id) => {
    return recipes.find(r => r.id === id || r.id === parseInt(id))
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
    if (!user) return { error: 'No user logged in' }

    const newPhoto = {
      image: photo.image,
      caption: photo.caption || '',
      recipe_id: photo.recipeId || null,
      user_id: user.id
    }

    const { data, error } = await supabase
      .from('photos')
      .insert(newPhoto)
      .select()
      .single()

    if (!error && data) {
      setPhotos(prev => [data, ...prev])
    }
    return { data, error }
  }

  const deletePhoto = async (id) => {
    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', id)

    if (!error) {
      setPhotos(prev => prev.filter(p => p.id !== id))
    }
    return { error }
  }

  const updatePhoto = async (id, updates) => {
    const { data, error } = await supabase
      .from('photos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setPhotos(prev => prev.map(p => p.id === id ? data : p))
    }
    return { data, error }
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
      updatePhoto,
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
