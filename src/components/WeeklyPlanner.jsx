import React, { useState } from 'react';
import { X, Calendar, Plus, Trash2, Download } from 'lucide-react';

const WEEKDAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const WeeklyPlanner = ({ recipes, onClose }) => {
  const [mealPlan, setMealPlan] = useState(() => {
    const saved = localStorage.getItem('milenaroma_mealplan');
    if (saved) return JSON.parse(saved);
    return WEEKDAYS.map(day => ({ day, meals: { lunch: null, dinner: null } }));
  });

  const [showRecipePicker, setShowRecipePicker] = useState({ day: null, meal: null });

  React.useEffect(() => {
    localStorage.setItem('milenaroma_mealplan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  const addMeal = (dayIndex, mealType, recipe) => {
    setMealPlan(prev => prev.map((day, i) => 
      i === dayIndex ? { ...day, meals: { ...day.meals, [mealType]: recipe } } : day
    ));
    setShowRecipePicker({ day: null, meal: null });
  };

  const removeMeal = (dayIndex, mealType) => {
    setMealPlan(prev => prev.map((day, i) => 
      i === dayIndex ? { ...day, meals: { ...day.meals, [mealType]: null } } : day
    ));
  };

  const generateShoppingList = () => {
    const allIngredients = [];
    
    mealPlan.forEach(day => {
      [day.meals.lunch, day.meals.dinner].forEach(recipe => {
        if (recipe) {
          allIngredients.push(...recipe.ingredients);
        }
      });
    });

    const uniqueIngredients = [...new Set(allIngredients)];
    localStorage.setItem('milenaroma_shoppinglist', JSON.stringify(uniqueIngredients));
    
    const text = uniqueIngredients.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista-compras-milen aroma.txt';
    a.click();
  };

  const hasMeals = mealPlan.some(day => day.meals.lunch || day.meals.dinner);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      overflow: 'auto'
    }}>
      <div style={{
        backgroundColor: 'var(--background)',
        minHeight: '100vh',
        padding: '2rem'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          maxWidth: '1000px',
          margin: '0 auto 2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              backgroundColor: 'var(--primary)', 
              borderRadius: '12px', 
              padding: '0.75rem',
              color: 'white'
            }}>
              <Calendar size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>Planificador Semanal</h2>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Organiza tus comidas de la semana
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {hasMeals && (
              <button
                onClick={generateShoppingList}
                className="btn"
                style={{ backgroundColor: 'var(--secondary)', color: 'white' }}
              >
                <Download size={18} />
                Exportar Lista
              </button>
            )}
            <button 
              onClick={onClose}
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '0.75rem',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Week Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {mealPlan.map((day, dayIndex) => (
            <div
              key={day.day}
              className="glass"
              style={{ padding: '1.25rem' }}
            >
              <h3 style={{ 
                fontSize: '1rem', 
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '2px solid var(--accent)'
              }}>
                {day.day}
              </h3>

              {/* Comida */}
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
                  ALMUERZO
                </p>
                {day.meals.lunch ? (
                  <div style={{
                    backgroundColor: 'var(--accent)',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    position: 'relative'
                  }}>
                    <button
                      onClick={() => removeMeal(dayIndex, 'lunch')}
                      style={{
                        position: 'absolute',
                        top: '0.25rem',
                        right: '0.25rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <X size={14} />
                    </button>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>{day.meals.lunch.title}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowRecipePicker({ day: dayIndex, meal: 'lunch' })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px dashed var(--accent)',
                      borderRadius: '12px',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.875rem',
                      transition: 'var(--transition)'
                    }}
                  >
                    <Plus size={16} />
                    Añadir
                  </button>
                )}
              </div>

              {/* Cena */}
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
                  CENA
                </p>
                {day.meals.dinner ? (
                  <div style={{
                    backgroundColor: 'var(--accent)',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    position: 'relative'
                  }}>
                    <button
                      onClick={() => removeMeal(dayIndex, 'dinner')}
                      style={{
                        position: 'absolute',
                        top: '0.25rem',
                        right: '0.25rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <X size={14} />
                    </button>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>{day.meals.dinner.title}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowRecipePicker({ day: dayIndex, meal: 'dinner' })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px dashed var(--accent)',
                      borderRadius: '12px',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.875rem',
                      transition: 'var(--transition)'
                    }}
                  >
                    <Plus size={16} />
                    Añadir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recipe Picker Modal */}
        {showRecipePicker.day !== null && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 2001
          }}>
            <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '1.5rem', maxHeight: '80vh', overflow: 'auto' }}>
              <h3 style={{ marginBottom: '1rem' }}>Selecciona una receta</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recipes.map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => addMeal(showRecipePicker.day, showRecipePicker.meal, recipe)}
                    style={{
                      padding: '1rem',
                      border: '2px solid var(--accent)',
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'var(--transition)'
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>{recipe.title}</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {recipe.time} • {recipe.difficulty}
                    </p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowRecipePicker({ day: null, meal: null })}
                className="btn"
                style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyPlanner;
