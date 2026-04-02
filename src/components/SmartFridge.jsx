import React, { useState } from 'react';
import { Search, X, Sparkles, RefreshCw } from 'lucide-react';

const SmartFridge = ({ recipes, onClose }) => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const allIngredients = [...new Set(recipes.flatMap(r => r.ingredients.map(i => i.toLowerCase().replace(/[^a-záéíóúñ\s]/g, '').trim())))];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length > 1) {
      const filtered = allIngredients.filter(i => 
        i.includes(value.toLowerCase()) && !ingredients.includes(i)
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addIngredient = (ingredient) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
    setInputValue('');
    setSuggestions([]);
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const findRecipes = () => {
    if (ingredients.length === 0) return [];
    
    return recipes
      .map(recipe => {
        const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase().replace(/[^a-záéíóúñ\s]/g, '').trim());
        const matchCount = ingredients.filter(ing => 
          recipeIngredients.some(ri => ri.includes(ing) || ing.includes(ri))
        ).length;
        return { ...recipe, matchCount };
      })
      .filter(r => r.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);
  };

  const matchingRecipes = findRecipes();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass" style={{
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              backgroundColor: 'var(--primary)', 
              borderRadius: '12px', 
              padding: '0.75rem',
              color: 'white'
            }}>
              <Search size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>SmartFridge</h2>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                ¿Qué tienes en tu cocina?
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: 'var(--text-muted)'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Ingredient Input */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && suggestions.length > 0) {
                addIngredient(suggestions[0]);
              }
            }}
            placeholder="Escribe un ingrediente..."
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              borderRadius: '16px',
              border: '2px solid var(--accent)',
              fontSize: '1rem',
              backgroundColor: 'white',
              outline: 'none',
              transition: 'var(--transition)'
            }}
          />
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          
          {suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              marginTop: '0.5rem',
              overflow: 'hidden',
              zIndex: 10
            }}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => addIngredient(suggestion)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Ingredients */}
        {ingredients.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {ingredients.map((ing, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '100px',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {ing}
                  <button
                    onClick={() => removeIngredient(ing)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'white',
                      padding: 0,
                      display: 'flex'
                    }}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {ingredients.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles size={18} style={{ color: 'var(--secondary)' }} />
              <h3 style={{ margin: 0, fontSize: '1.125rem' }}>
                {matchingRecipes.length} recetas encontradas
              </h3>
            </div>

            {matchingRecipes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {matchingRecipes.slice(0, 5).map(recipe => (
                  <div
                    key={recipe.id}
                    style={{
                      padding: '1.25rem',
                      backgroundColor: 'var(--accent)',
                      borderRadius: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{recipe.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {recipe.matchCount} ingredientes en común
                      </p>
                    </div>
                    <div style={{
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {Math.round((recipe.matchCount / recipe.ingredients.length) * 100)}% compatible
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <RefreshCw size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                <p>No encontramos recetas exactas, pero puedes probar con otros ingredientes</p>
              </div>
            )}
          </div>
        )}

        {ingredients.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥕</div>
            <p>Añade los ingredientes que tengas y te sugeriremos recetas deliciosas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartFridge;
