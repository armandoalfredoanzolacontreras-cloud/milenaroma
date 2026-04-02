import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { RecipeProvider } from './context/RecipeContext'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateRecipe from './pages/CreateRecipe'
import CookingMode from './pages/CookingMode'
import YouTube from './pages/YouTube'
import Search from './pages/Search'
import Calculator from './pages/Calculator'
import ShoppingList from './pages/ShoppingList'
import Friends from './pages/Friends'
import Achievements from './pages/Achievements'
import Gemini from './pages/Gemini'
import RecipeDetail from './pages/RecipeDetail'
import Photos from './pages/Photos'
import CategoryPage from './pages/CategoryPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppContent() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-main)]">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <>
                <Header />
                <main className="pt-20">
                  <Home />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/create" element={
            <ProtectedRoute>
              <CreateRecipe />
            </ProtectedRoute>
          } />
          
          <Route path="/cooking/:id" element={
            <ProtectedRoute>
              <CookingMode />
            </ProtectedRoute>
          } />
          
          <Route path="/youtube" element={
            <ProtectedRoute>
              <YouTube />
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } />
          
          <Route path="/calculator" element={
            <ProtectedRoute>
              <Calculator />
            </ProtectedRoute>
          } />
          
          <Route path="/shopping" element={
            <ProtectedRoute>
              <ShoppingList />
            </ProtectedRoute>
          } />
          
          <Route path="/friends" element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          } />
          
          <Route path="/photos" element={
            <ProtectedRoute>
              <Photos />
            </ProtectedRoute>
          } />
          
          <Route path="/achievements" element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          } />
          
          <Route path="/gemini" element={
            <ProtectedRoute>
              <Gemini />
            </ProtectedRoute>
          } />
          
          <Route path="/category/:category" element={
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          } />
          
          <Route path="/recipe/:id" element={
            <ProtectedRoute>
              <RecipeDetail />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--primary)] mb-4">{title}</h1>
        <p className="text-[var(--text-muted)]">Esta funcionalidad está siendo construida.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RecipeProvider>
          <AppContent />
        </RecipeProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
