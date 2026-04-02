import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import RecipeGrid from './components/RecipeGrid';
import Alchemist from './components/Alchemist';
import CookingMode from './components/CookingMode';
import SmartFridge from './components/SmartFridge';
import WeeklyPlanner from './components/WeeklyPlanner';
import ShoppingList from './components/ShoppingList';
import Diario from './components/Diario';
import AIPrompt from './components/AIPrompt';
import RecipeModal from './components/RecipeModal';
import AddRecipe from './components/AddRecipe';
import CoachCulinario from './components/CoachCulinario';
import recipesData from './data/recipes.json';
import { Calendar, BookOpen, Wand2, Hand, Sparkles, ShoppingCart, ChefHat, Plus } from 'lucide-react';

function App() {
  const [activeMood, setActiveMood] = useState('Relajada');
  const [showAlchemist, setShowAlchemist] = useState(false);
  const [showSmartFridge, setShowSmartFridge] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showDiario, setShowDiario] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [dirtyHandsMode, setDirtyHandsMode] = useState(false);
  const [customRecipes, setCustomRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [cookingRecipe, setCookingRecipe] = useState(null);

  const allRecipes = [...recipesData, ...customRecipes];

  useEffect(() => {
    const saved = localStorage.getItem('milenaroma_custom_recipes');
    if (saved) {
      setCustomRecipes(JSON.parse(saved));
    }
  }, []);

  const filteredRecipes = allRecipes.filter(r => r.mood === activeMood);

  const handleSaveRecipe = (newRecipe) => {
    const updated = [newRecipe, ...customRecipes];
    setCustomRecipes(updated);
    localStorage.setItem('milenaroma_custom_recipes', JSON.stringify(updated));
  };

  const moods = [
    { name: 'Relajada', color: '#4A6E5D', accent: '#FEFAE0', emoji: '🌿', description: 'días tranquilos' },
    { name: 'Con Prisa', color: '#D4A373', accent: '#FAEDCD', emoji: '⚡', description: 'recetas rápidas' },
    { name: 'Anfitriona', color: '#2C4A3E', accent: '#E9EDC6', emoji: '👑', description: 'para impresionar' }
  ];

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleStartCooking = (recipe) => {
    setSelectedRecipe(null);
    setCookingRecipe(recipe);
  };

  const handleOpenAI = (recipe) => {
    setSelectedRecipe(null);
    setShowAIPrompt(true);
  };

  return (
    <div className="app-container" style={{ 
      minHeight: '100vh', 
      paddingBottom: '8rem',
      backgroundColor: moods.find(m => m.name === activeMood)?.accent || 'var(--background)',
      transition: 'background-color 0.5s ease'
    }}>
      <Header 
        onPlannerClick={() => setShowPlanner(true)} 
        onDiarioClick={() => setShowDiario(true)}
        onAddRecipeClick={() => setShowAddRecipe(true)}
      />
      
      <main>
        {!dirtyHandsMode ? (
          <>
            <Hero />
            
            <section className="container" style={{ marginTop: '5rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.25rem',
                marginBottom: '4rem'
              }}>
                <button 
                  onClick={() => setShowAddRecipe(true)}
                  className="feature-card" 
                  style={{ background: 'linear-gradient(135deg, #D4A373 0%, #E9C992 100%)' }}
                >
                  <div className="feature-icon" style={{ color: 'white' }}>
                    <Plus size={36} style={{ margin: '0 auto', display: 'block' }} />
                  </div>
                  <h4 style={{ color: 'white' }}>Añadir Receta</h4>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>YouTube, texto, PDF</p>
                </button>

                <button 
                  onClick={() => setShowAlchemist(true)}
                  className="feature-card" 
                >
                  <div className="feature-icon" style={{ color: 'var(--secondary)' }}>
                    <Wand2 size={36} style={{ margin: '0 auto', display: 'block' }} />
                  </div>
                  <h4>El Alquimista</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Recetas mágicas</p>
                </button>

                <button 
                  onClick={() => setShowSmartFridge(true)}
                  className="feature-card" 
                >
                  <div className="feature-icon" style={{ color: 'var(--primary)' }}>
                    <ChefHat size={36} style={{ margin: '0 auto', display: 'block' }} />
                  </div>
                  <h4>SmartFridge</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Qué tengo?</p>
                </button>
                
                <button 
                  onClick={() => setDirtyHandsMode(true)}
                  className="feature-card" 
                >
                  <div className="feature-icon" style={{ color: 'var(--primary)' }}>
                    <Hand size={36} style={{ margin: '0 auto', display: 'block' }} />
                  </div>
                  <h4>Manos Sucias</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Modo cocina</p>
                </button>

                <button 
                  onClick={() => setShowPlanner(true)}
                  className="feature-card" 
                >
                  <div className="feature-icon" style={{ color: 'var(--primary)' }}>
                    <Calendar size={36} style={{ margin: '0 auto', display: 'block' }} />
                  </div>
                  <h4>Planner</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Semanal</p>
                </button>

                <button 
                  onClick={() => setShowShoppingList(true)}
                  className="feature-card" 
                >
                  <div className="feature-icon" style={{ color: 'var(--secondary)' }}>
                    <ShoppingCart size={36} style={{ margin: '0 auto', display: 'block' }} />
                  </div>
                  <h4>Compras</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Lista lista</p>
                </button>

                <button 
                  onClick={() => setShowDiario(true)}
                  className="feature-card" 
                >
                  <div className="feature-icon" style={{ color: 'var(--primary)' }}>
                    <BookOpen size={36} style={{ margin: '0 auto', display: 'block' }} />
                  </div>
                  <h4>Diario</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Mis platos</p>
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Hoy estoy <span style={{ textTransform: 'lowercase' }}>{activeMood}</span> 🌿</h3>
                  {customRecipes.length > 0 && (
                    <span style={{ 
                      backgroundColor: 'var(--secondary)', 
                      color: 'white', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '100px', 
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      +{customRecipes.length} tuyas
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{filteredRecipes.length} recetas para ti</span>
              </div>
              
              <RecipeGrid recipes={filteredRecipes} onRecipeClick={handleRecipeClick} />
              
              <CoachCulinario type="mood" mood={activeMood} />
            </section>
          </>
        ) : (
          <section className="container animate-fade" style={{ paddingTop: '4rem' }}>
            <button 
              onClick={() => setDirtyHandsMode(false)}
              className="btn"
              style={{ marginBottom: '2rem' }}
            >
              Salir del Modo Lectura
            </button>
            <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Modo Manos Sucias</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Selecciona una receta para ver los pasos en formato gigante
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {allRecipes.map(recipe => (
                <div 
                  key={recipe.id} 
                  className="glass"
                  style={{ padding: '1.5rem', cursor: 'pointer', transition: 'var(--transition)' }}
                  onClick={() => handleStartCooking(recipe)}
                >
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{recipe.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {recipe.steps?.length || 0} pasos • {recipe.time}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Mood Selector Sticky Bottom */}
      <div className="glass" style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        zIndex: 1001,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px' }}>¿CÓMO ESTÁS?</span>
        {moods.map(mood => (
          <button
            key={mood.name}
            onClick={() => setActiveMood(mood.name)}
            className="btn"
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              backgroundColor: activeMood === mood.name ? mood.color : 'transparent',
              color: activeMood === mood.name ? 'white' : 'var(--text-main)',
              border: 'none',
              borderRadius: '100px',
              transition: 'var(--transition)'
            }}
          >
            {mood.name}
          </button>
        ))}
      </div>

      {/* Modals */}
      {showAddRecipe && (
        <AddRecipe onClose={() => setShowAddRecipe(false)} onSave={handleSaveRecipe} />
      )}

      {showAlchemist && (
        <Alchemist recipes={allRecipes} onClose={() => setShowAlchemist(false)} onSaveRecipe={handleSaveRecipe} />
      )}

      {showSmartFridge && (
        <SmartFridge recipes={allRecipes} onClose={() => setShowSmartFridge(false)} />
      )}

      {showPlanner && (
        <WeeklyPlanner recipes={allRecipes} onClose={() => setShowPlanner(false)} />
      )}

      {showShoppingList && (
        <ShoppingList onClose={() => setShowShoppingList(false)} />
      )}

      {showDiario && (
        <Diario onClose={() => setShowDiario(false)} />
      )}

      {showAIPrompt && (
        <AIPrompt recipes={allRecipes} onClose={() => setShowAIPrompt(false)} />
      )}

      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)}
          onStartCooking={handleStartCooking}
          onOpenAI={handleOpenAI}
        />
      )}

      {cookingRecipe && (
        <CookingMode 
          recipe={cookingRecipe} 
          onClose={() => setCookingRecipe(null)} 
        />
      )}
    </div>
  );
}

export default App;
