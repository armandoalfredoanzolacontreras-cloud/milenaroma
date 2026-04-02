import React from 'react';
import { Plus } from 'lucide-react';

const Header = ({ onPlannerClick, onDiarioClick, onAddRecipeClick }) => {
  return (
    <header className="glass" style={{
      position: 'sticky',
      top: '1rem',
      margin: '1rem auto',
      width: 'calc(100% - 2rem)',
      zIndex: 1000,
      padding: '0.75rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ position: 'relative' }}>
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 32 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginTop: '4px' }}
          >
            <ellipse cx="16" cy="24" rx="10" ry="4" fill="#2C4A3E"/>
            <path d="M6 24V16C6 12 10 8 16 8C22 8 26 12 26 16V24" fill="#2C4A3E"/>
            <path d="M10 24C10 22 12 20 16 20C20 20 22 22 22 24" fill="#4A6E5D"/>
            <circle cx="16" cy="8" r="3" fill="#D4A373"/>
            <rect x="14" y="5" width="4" height="4" rx="1" fill="#D4A373"/>
          </svg>
          <h1 style={{ 
            fontSize: '1.5rem', 
            letterSpacing: '-0.5px',
            margin: 0,
            marginTop: '4px' 
          }}>
            MilenAroma
          </h1>
        </div>
      </div>
      
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={onAddRecipeClick}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--secondary)', 
            fontWeight: 600,
            background: 'none',
            border: '2px solid var(--secondary)',
            borderRadius: '12px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            transition: 'var(--transition)'
          }}
        >
          <Plus size={18} />
          Añadir
        </button>
        <button 
          onClick={onPlannerClick}
          style={{ 
            textDecoration: 'none', 
            color: 'var(--text-muted)', 
            fontWeight: 500,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontFamily: 'inherit'
          }}
        >
          Planner
        </button>
        <button 
          onClick={onDiarioClick}
          style={{ 
            textDecoration: 'none', 
            color: 'var(--text-muted)', 
            fontWeight: 500,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontFamily: 'inherit'
          }}
        >
          Diario
        </button>
      </nav>
      
      <button className="btn btn-primary">
        Empezar a cocinar
      </button>
    </header>
  );
};

export default Header;
