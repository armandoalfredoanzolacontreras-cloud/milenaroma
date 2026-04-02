import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Volume2, ChefHat, Lightbulb } from 'lucide-react';

const CookingMode = ({ recipe, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const chefTips = [
    { tip: "Mise en place: tener todo cortado antes de encender = paz mental", when: 0 },
    { tip: "Las especias liberan más aroma con calor. No las metas frías a la olla.", when: 1 },
    { tip: "¿Duda en el timing? Un minuto extra puede arruinar. Mejor menos que más.", when: 2 },
    { tip: "El reposo de la carne importa. 5 minutos cambian todo.", when: 3 },
    { tip: "Salsa es igual a reducir.小火慢炖 = magia lenta.", when: 4 },
    { tip: "¿Muy líquido? Una colher de maicena disuelta lo resuelve.", when: 5 },
    { tip: "El emplatado es la mitad del plato. Hazlo bonito.", when: 6 },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const speakStep = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(recipe.steps[currentStep]);
        utterance.lang = 'es-ES';
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const progress = ((currentStep + 1) / recipe.steps.length) * 100;
  
  const currentTip = chefTips.find(t => t.when === currentStep) || chefTips[0];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'var(--primary)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.25rem' }}>{recipe.title}</h2>
          <p style={{ opacity: 0.7, fontSize: '0.875rem' }}>Paso {currentStep + 1} de {recipe.steps.length}</p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            transition: 'var(--transition)'
          }}
        >
          <X size={24} />
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '4px',
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: '100%'
      }}>
        <div style={{
          height: '100%',
          backgroundColor: 'var(--secondary)',
          width: `${progress}%`,
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: 'clamp(1.5rem, 5vw, 3rem)',
          fontWeight: 600,
          fontFamily: 'var(--font-display)',
          maxWidth: '900px',
          lineHeight: 1.4,
          animation: 'fadeIn 0.5s ease'
        }}>
          {recipe.steps[currentStep]}
        </div>
        
        {/* Chef Tip */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem 1.5rem',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          maxWidth: '500px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.25rem'
          }}>
            <ChefHat size={14} style={{ color: 'var(--secondary)' }} />
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>
              Consejo del Chef
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
            {currentTip.tip}
          </p>
        </div>
      </div>

      {/* Voice Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '1rem'
      }}>
        <button
          onClick={speakStep}
          style={{
            background: isSpeaking ? 'var(--secondary)' : 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            transition: 'var(--transition)'
          }}
        >
          <Volume2 size={28} />
        </button>
      </div>

      {/* Navigation */}
      <div style={{
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          style={{
            background: currentStep === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '16px',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: 500,
            opacity: currentStep === 0 ? 0.5 : 1,
            transition: 'var(--transition)'
          }}
        >
          <ChevronLeft size={24} />
          Anterior
        </button>

        {/* Step Dots */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {recipe.steps.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentStep(index)}
              style={{
                width: index === currentStep ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: index === currentStep ? 'var(--secondary)' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          disabled={currentStep === recipe.steps.length - 1}
          style={{
            background: currentStep === recipe.steps.length - 1 ? 'var(--secondary)' : 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '16px',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: currentStep === recipe.steps.length - 1 ? 'not-allowed' : 'pointer',
            color: currentStep === recipe.steps.length - 1 ? 'white' : 'var(--primary)',
            fontSize: '1.125rem',
            fontWeight: 500,
            opacity: currentStep === recipe.steps.length - 1 ? 0.5 : 1,
            transition: 'var(--transition)'
          }}
        >
          {currentStep === recipe.steps.length - 1 ? '¡Listo!' : 'Siguiente'}
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default CookingMode;
