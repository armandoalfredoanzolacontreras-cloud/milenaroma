import React from 'react';
import { Clock, BarChart, ChefHat } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="glass animate-fade" style={{ 
      overflow: 'hidden', 
      transition: 'var(--transition)',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        height: '200px', 
        backgroundColor: 'var(--accent)', 
        position: 'relative' 
      }}>
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--primary)'
        }}>
          {recipe.mood}
        </div>
        {/* Image Placeholder */}
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--primary-light)',
          opacity: 0.5
        }}>
          <ChefHat size={48} />
        </div>
      </div>
      
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{recipe.title}</h3>
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: '0.875rem', 
          marginBottom: '1.5rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {recipe.description}
        </p>
        
        <div style={{ 
          marginTop: 'auto',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(0,0,0,0.05)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Clock size={14} />
            {recipe.time}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <BarChart size={14} />
            {recipe.difficulty}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
