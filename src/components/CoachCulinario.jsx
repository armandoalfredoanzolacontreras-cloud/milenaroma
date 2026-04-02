import React, { useState, useEffect } from 'react';
import { ChefHat, Lightbulb, Heart, RefreshCw } from 'lucide-react';

const CoachCulinario = ({ type = 'tip', mood = null }) => {
  const tips = {
    // Tips generales
    tip: [
      { text: "Ojo con el fuego: el aceite de oliva extra virgen no es para freír a alta temperatura. Guardémoslo para aderezar.", icon: "🔥" },
      { text: "Si la receta pide 'Harina PAN', estamos hablando de maíz precocido. Perfecto para arepas, no para panes de trigo.", icon: "🌽" },
      { text: "Sustitución rápida: yogur griego por crema agria. Funciona en salsas y aderezos.", icon: "💡" },
      { text: "El ajo que está germinado (verdecito por dentro) amarga. Retira el brote antes de picar.", icon: "🧄" },
      { text: "Un poco de ácido (limón, vinagre) realza cualquier guiso. Un toque que cambia todo.", icon: "🍋" },
      { text: "La sal se增减 con el fuego. Prueba al final y ajusta, siempre puedes añadir más.", icon: "🧂" },
      { text: "¿No tienes caldo? Agua con una pastilla funciona, pero un chorrito de vino blanco le da otra vida.", icon: "🍷" },
    ],
    
    // Tips por mood
    Relajada: [
      { text: "Día tranquilo = cocina sin prisa. Aprovecha para dorar bien la cebolla, eso es la base de todo.", icon: "🌿" },
      { text: "Las mejores recetas son las que improvisamos. ¿Qué tal cambiar el pollo por garbanzos?", icon: "✨" },
      { text: "Un risotto no se apura. Remover despacio es parte de la magia.", icon: "🍚" },
    ],
    
    'Con Prisa': [
      { text: "Regla de oro: corta todo antes de encender el fuego. Así no corres de un lado a otro.", icon: "⚡" },
      { text: "Los huevos son tus aliados. Tortilla en 5 minutos, siempre salvador.", icon: "🍳" },
      { text: "¿Y si haces un bowl? Arroz, proteína, verdura. Todo junto y rico.", icon: "🥗" },
    ],
    
    Anfitriona: [
      { text: "Un plato bien presentado vale el doble. No escatimes en el emplatado.", icon: "👑" },
      { text: "Prepara lo que puedas la noche anterior. El día D, solo calientas y sirves.", icon: "📋" },
      { text: "La salsa marca la diferencia. Si puedes hacer una reducción, hazla.", icon: "🫕" },
    ],
    
    // Tips para alchemist
    alchemist: [
      { text: "El curry en polvo no es solo para currys. Pruébalo en huevos, aguacate o popcorn.", icon: "🍛" },
      { text: "El comino y el limón son mejores amigos. Siempre van juntos.", icon: "🌟" },
      { text: "¿Tienes resto de verduras? Salteado con ajo y salsa de soja. Receta nueva lista.", icon: "🥬" },
    ],
    
    // Tips para cooking mode
    cooking: [
      { text: "Mise en place: tener todo cortado antes de cocinar. Lo dice cualquier chef profesional.", icon: "👨‍🍳" },
      { text: "La carne reposa después de cocinar. 5 minutos hacen miracles.", icon: "🥩" },
      { text: "¿Doblegar el panque? Un toque de vapor (agua en la bandeja) y quedan super suaves.", icon: "🧁" },
    ],
    
    // Tips para guardar/success
    success: [
      { text: "¡Receta guardada! Ahora toca probarla y añadir tus notas personales.", icon: "📝" },
      { text: "Esa receta ahora es tuya. Personalízala, hazla tuya.", icon: "✨" },
      { text: "Guardado. ¿Le pondrás una foto cuando la cocines?", icon: "📸" },
    ]
  };

  const getTips = () => {
    if (type === 'mood' && mood && tips[mood]) {
      return tips[mood];
    }
    return tips[type] || tips.tip;
  };

  const [currentTip, setCurrentTip] = useState(null);

  useEffect(() => {
    const availableTips = getTips();
    const randomIndex = Math.floor(Math.random() * availableTips.length);
    setCurrentTip(availableTips[randomIndex]);
  }, [type, mood]);

  const refreshTip = () => {
    const availableTips = getTips();
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * availableTips.length);
    } while (availableTips[newIndex] === currentTip && availableTips.length > 1);
    setCurrentTip(availableTips[newIndex]);
  };

  if (!currentTip) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: 'rgba(212, 163, 115, 0.1)',
      borderRadius: '12px',
      marginTop: '1rem'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'var(--secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        flexShrink: 0
      }}>
        <ChefHat size={16} style={{ color: 'white' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.25rem'
        }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Consejo del Chef
          </span>
          <button
            onClick={refreshTip}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              color: 'var(--text-muted)',
              opacity: 0.6
            }}
          >
            <RefreshCw size={12} />
          </button>
        </div>
        <p style={{ 
          margin: 0, 
          fontSize: '0.9rem', 
          color: 'var(--text-main)',
          lineHeight: 1.5 
        }}>
          {currentTip.text}
        </p>
      </div>
    </div>
  );
};

export default CoachCulinario;
