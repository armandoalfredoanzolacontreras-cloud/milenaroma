import React from 'react';
import { Sparkles, ChefHat, Heart } from 'lucide-react';

const Hero = () => {
  return (
    <section className="container animate-fade" style={{ marginTop: '4rem', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'var(--accent)',
        padding: '0.5rem 1.25rem',
        borderRadius: '100px',
        color: 'var(--primary)',
        fontSize: '0.875rem',
        fontWeight: 600,
        marginBottom: '1.5rem'
      }}>
        <Sparkles size={16} />
        Bienvenida a tu cocina personal
      </div>
      
      <h2 style={{ 
        fontSize: 'clamp(2rem, 6vw, 3.5rem)', 
        lineHeight: 1.15,
        marginBottom: '1.5rem',
        maxWidth: '700px',
        margin: '0 auto 1.5rem'
      }}>
        MilenAroma
        <span style={{ 
          display: 'block', 
          fontSize: '1.1rem', 
          fontWeight: 400, 
          color: 'var(--text-muted)',
          marginTop: '0.5rem',
          fontFamily: 'var(--font-main)'
        }}>
          donde cada plato cuenta una historia
        </span>
      </h2>
      
      <p style={{ 
        fontSize: '1.1rem', 
        color: 'var(--text-muted)', 
        maxWidth: '550px',
        margin: '0 auto 2rem',
        lineHeight: 1.7
      }}>
        Tu asistente culinario favorito. Explora recetas adaptadas a tu humor, 
        planifica deliciosas comidas y descubre el chef que llevas dentro.
      </p>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
        marginBottom: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          color: 'var(--text-muted)'
        }}>
          <ChefHat size={18} style={{ color: 'var(--secondary)' }} />
          <span>+50 recetas</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          color: 'var(--text-muted)'
        }}>
          <Heart size={18} style={{ color: '#e74c3c' }} />
          <span>Hecho con amor</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
