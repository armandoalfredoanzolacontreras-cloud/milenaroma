import React, { useState } from 'react';
import { X, Sparkles, Send, Copy, ExternalLink } from 'lucide-react';

const AIPrompt = ({ recipes, onClose }) => {
  const [customIngredients, setCustomIngredients] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const generatePrompt = (type) => {
    let prompt = '';
    
    if (type === 'custom') {
      const ingredients = customIngredients.split(',').map(i => i.trim()).filter(i => i);
      if (ingredients.length === 0) return;
      
      prompt = `Tengo los siguientes ingredientes en casa: ${ingredients.join(', ')}. 
¿Podrías sugerirme una receta gourmet creativa y detallada con pasos paso a paso? 
Incluye sugerencias de presentación y maridaje si es posible.`;
    } else if (type === 'recipe' && selectedRecipe) {
      const ingredients = selectedRecipe.ingredients.join(', ');
      prompt = `Quiero cocinar "${selectedRecipe.title}". 
Ingredientes disponibles: ${ingredients}
¿Podrías darme variaciones creativas, sugerencias de presentación elegante, 
y posibles sustituciones gourmet para esta receta?`;
    }

    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
  };

  const openInChatGPT = () => {
    const url = `https://chat.openai.com/?prompt=${encodeURIComponent(generatedPrompt)}`;
    window.open(url, '_blank');
  };

  const openInGemini = () => {
    const url = `https://gemini.google.com/?prompt=${encodeURIComponent(generatedPrompt)}`;
    window.open(url, '_blank');
  };

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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px', 
              padding: '0.75rem',
              color: 'white'
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>Consultar a la IA</h2>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Genera prompts para ChatGPT o Gemini
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

        {/* Option 1: Custom Ingredients */}
        <div style={{ 
          padding: '1.5rem',
          backgroundColor: 'var(--accent)',
          borderRadius: '16px',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>🎨 Crear receta con ingredientes</h4>
          <textarea
            value={customIngredients}
            onChange={(e) => setCustomIngredients(e.target.value)}
            placeholder="Escribe los ingredientes separados por coma... ej: tomate, pollo, arroz"
            rows={3}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              border: '2px solid white',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none',
              marginBottom: '1rem'
            }}
          />
          <button
            onClick={() => generatePrompt('custom')}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Sparkles size={18} />
            Generar Prompt
          </button>
        </div>

        {/* Option 2: Based on Recipe */}
        <div style={{ 
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '16px',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>📋 Mejorar receta existente</h4>
          <select
            value={selectedRecipe?.id || ''}
            onChange={(e) => {
              const recipe = recipes.find(r => r.id === parseInt(e.target.value));
              setSelectedRecipe(recipe);
            }}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              border: '2px solid var(--accent)',
              fontSize: '0.95rem',
              outline: 'none',
              marginBottom: '1rem',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="">Selecciona una receta...</option>
            {recipes.map(recipe => (
              <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
            ))}
          </select>
          {selectedRecipe && (
            <button
              onClick={() => generatePrompt('recipe')}
              className="btn"
              style={{ 
                width: '100%', 
                justifyContent: 'center',
                backgroundColor: 'var(--primary)',
                color: 'white'
              }}
            >
              <Sparkles size={18} />
              Generar Prompt para {selectedRecipe.title}
            </button>
          )}
        </div>

        {/* Generated Prompt */}
        {generatedPrompt && (
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '2px solid var(--secondary)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0 }}>Prompt Generado</h4>
              <button
                onClick={copyToClipboard}
                style={{
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.8rem'
                }}
              >
                <Copy size={14} />
                Copiar
              </button>
            </div>
            <p style={{
              margin: 0,
              padding: '1rem',
              backgroundColor: 'var(--background)',
              borderRadius: '12px',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap'
            }}>
              {generatedPrompt}
            </p>

            <div style={{ 
              display: 'flex', 
              gap: '0.75rem',
              marginTop: '1rem'
            }}>
              <button
                onClick={openInChatGPT}
                className="btn"
                style={{ 
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: '#10a37f',
                  color: 'white'
                }}
              >
                <ExternalLink size={16} />
                ChatGPT
              </button>
              <button
                onClick={openInGemini}
                className="btn"
                style={{ 
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: '#1a73e8',
                  color: 'white'
                }}
              >
                <ExternalLink size={16} />
                Gemini
              </button>
            </div>
          </div>
        )}

        {/* Info Note */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}>
          💡 Los prompts se copiarán automáticamente. Puedes pegarlos en ChatGPT o Gemini para obtener sugerencias personalizadas.
        </div>
      </div>
    </div>
  );
};

export default AIPrompt;
