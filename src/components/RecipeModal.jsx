import React, { useState } from 'react';
import { X, Clock, BarChart, ChefHat, Play, Shuffle, ExternalLink } from 'lucide-react';

const RecipeModal = ({ recipe, onClose, onStartCooking, onOpenAI }) => {
  const [showSubstitutions, setShowSubstitutions] = useState(false);

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
      padding: '1rem',
      overflow: 'auto'
    }}>
      <div className="glass" style={{
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{
              display: 'inline-block',
              backgroundColor: 'var(--primary)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '100px',
              fontSize: '0.75rem',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              {recipe.mood}
            </div>
            <h2 style={{ margin: 0 }}>{recipe.title}</h2>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>{recipe.description}</p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'var(--accent)',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem',
              cursor: 'pointer',
              color: 'var(--primary)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Meta Info */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: 'var(--accent)',
          borderRadius: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.9rem' }}>{recipe.time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.9rem' }}>{recipe.difficulty}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            {recipe.tags.map(tag => (
              <span key={tag} style={{
                backgroundColor: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '100px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Ingredientes</h3>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '0.5rem'
          }}>
            {recipe.ingredients.map((ing, index) => (
              <li key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--secondary)'
                }} />
                {ing}
              </li>
            ))}
          </ul>
        </div>

        {/* Substitutions */}
        {recipe.substitutions && Object.keys(recipe.substitutions).length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => setShowSubstitutions(!showSubstitutions)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--secondary)'
              }}
            >
              <Shuffle size={16} />
              No tengo esto - Ver sustituciones
            </button>
            
            {showSubstitutions && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'var(--accent)',
                borderRadius: '12px'
              }}>
                {Object.entries(recipe.substitutions).map(([original, substitute]) => (
                  <div key={original} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 0'
                  }}>
                    <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      {original}
                    </span>
                    <span style={{ color: 'var(--primary)' }}>→</span>
                    <span style={{ fontWeight: 500 }}>{substitute}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Steps Preview */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Pasos</h3>
          <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
            {recipe.steps.map((step, index) => (
              <li key={index} style={{
                padding: '0.75rem 0',
                borderBottom: index < recipe.steps.length - 1 ? '1px solid var(--accent)' : 'none',
                fontSize: '0.95rem',
                lineHeight: 1.6
              }}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onStartCooking(recipe)}
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center', padding: '1rem' }}
          >
            <Play size={20} />
            Empezar a Cocinar
          </button>
          <button
            onClick={() => onOpenAI(recipe)}
            style={{
              flex: 1,
              padding: '1rem',
              backgroundColor: 'var(--secondary)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: 500,
              transition: 'var(--transition)'
            }}
          >
            <ExternalLink size={18} />
            Consultar IA
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
