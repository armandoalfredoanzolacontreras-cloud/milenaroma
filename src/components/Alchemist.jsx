import React, { useState } from 'react';
import { Wand2, X, Plus, Sparkles, ChefHat, Clock, Save, Trash2 } from 'lucide-react';

const Alchemist = ({ onClose, onSaveRecipe }) => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const MAX_INGREDIENTS = 10;
  const MIN_INGREDIENTS = 2;

  const addIngredient = () => {
    if (inputValue.trim() && ingredients.length < MAX_INGREDIENTS) {
      const ing = inputValue.trim().toLowerCase();
      if (!ingredients.includes(ing)) {
        setIngredients([...ingredients, ing]);
      }
      setInputValue('');
    }
  };

  const removeIngredient = (ing) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const categorizeIngredient = (ing) => {
    const lower = ing.toLowerCase();
    const words = lower.split(/\s+/);
    
    const proteins = ['pollo', 'carne', 'cerdo', 'pavo', 'pato', 'conejo', 'cordero', 'ternera', 'vacuno', 'salmón', 'pescado', 'atún', 'merluza', 'gamba', 'camarón', 'marisco', 'huevos', 'huevo', 'tofu', 'tempeh', 'jamón', 'bacon', 'tocino', 'chorizo'];
    const vegetables = ['tomate', 'cebolla', 'ajo', 'pimiento', 'calabacín', 'berenjena', 'zanahoria', 'brócoli', 'espinaca', 'lechuga', 'col', 'coliflor', 'champiñon', 'champiñones', 'hongo', 'hongos', 'espárragos', 'espárrago', 'apio', 'pepino', 'calabaza', 'boniato', 'patata', 'maíz', 'guisantes', 'guisante', 'judías', 'judia', 'alubias', 'alubia', 'lentejas', 'lenteja', 'garbanzos', 'garbanzo', 'aceitunas', 'aceituna', 'puerro', 'nabo', 'remolacha', 'rucula', 'acelgas', 'alcachofa'];
    const carbs = ['arroz', 'pasta', 'pan', 'tortilla', 'quinoa', 'cuscús', 'bulgur', 'avena', 'espaguetis', 'macarrones', 'penne', 'fideos', 'noodles', 'patatas', 'patata'];
    const dairy = ['queso', 'leche', 'nata', 'yogur', 'mantequilla', 'crema', 'mozzarella', 'parmesano', 'feta', 'ricotta', 'cheddar', 'brie', 'gouda'];
    const fruits = ['limón', 'lima', 'naranja', 'manzana', 'pera', 'plátano', 'fresa', 'fresas', 'uva', 'melón', 'sandía', 'mango', 'piña', 'aguacate', 'naranjas'];
    const condiments = ['sal', 'pimienta', 'aceite', 'vinagre', 'miel', 'soja', 'salsa', 'mostaza', 'ketchup', 'mayonesa', 'curry', 'comino', 'pimentón', 'paprika', 'canela', 'nuez moscada'];
    const herbs = ['albahaca', 'perejil', 'cilantro', 'menta', 'romero', 'tomillo', 'orégano', 'eneldo', 'cebollino', 'laurel', 'hierbabuena'];
    
    for (const word of words) {
      if (proteins.includes(word)) return 'proteína';
      if (vegetables.includes(word)) return 'verdura';
      if (carbs.includes(word)) return 'carbohidrato';
      if (dairy.includes(word)) return 'lácteo';
      if (fruits.includes(word)) return 'fruta';
      if (condiments.includes(word)) return 'condimento';
      if (herbs.includes(word)) return 'hierba';
    }
    return 'otro';
  };

  const generateMagicRecipe = () => {
    if (ingredients.length < MIN_INGREDIENTS) return;

    setIsGenerating(true);

    setTimeout(() => {
      const categorized = ingredients.map(ing => ({
        name: ing,
        category: categorizeIngredient(ing)
      }));

      const proteins = categorized.filter(i => i.category === 'proteína').map(i => i.name);
      const vegetables = categorized.filter(i => i.category === 'verdura').map(i => i.name);
      const carbs = categorized.filter(i => i.category === 'carbohidrato').map(i => i.name);
      const others = categorized.filter(i => !['proteína', 'verdura', 'carbohidrato'].includes(i.category)).map(i => i.name);

      // Seleccionar tipo de receta según ingredientes
      let recipeType = 'Salteado';
      if (proteins.length > 0 && vegetables.length > 0) {
        recipeType = proteins.length > 1 ? 'Guiso' : 'Salteado';
      } else if (vegetables.length >= 2) {
        recipeType = 'Ensalada';
      } else if (carbs.length > 0) {
        recipeType = 'Pasta/Arroz';
      } else if (proteins.length > 0) {
        recipeType = 'Proteína';
      }

      // Generar receta dinámica
      const recipeData = generateRecipeContent(recipeType, ingredients, proteins, vegetables, carbs, others);

      const newRecipe = {
        id: Date.now(),
        title: recipeData.title,
        description: recipeData.description,
        ingredients: ingredients,
        steps: recipeData.steps,
        time: ingredients.length <= 3 ? '15-20 min' : '25-35 min',
        difficulty: ingredients.length <= 4 ? 'Fácil' : 'Media',
        mood: 'Relajada',
        tags: [...new Set(categorized.map(c => c.category))],
        isGenerated: true
      };

      setGeneratedRecipe(newRecipe);
      setIsGenerating(false);
    }, 1500);
  };

  const generateRecipeContent = (type, ings, proteins, vegetables, carbs, others) => {
    const ingsList = ings.join(', ');
    
    switch(type) {
      case 'Salteado':
        return {
          title: `Salteado de ${ings[0]}`,
          description: 'Un plato rápido y sabroso',
          steps: [
            `Corta ${vegetables.length > 0 ? vegetables.join(', ') : ings.slice(0, 2).join(', ')} en trozos adecuados`,
            proteins.length > 0 ? `Marca ${proteins[0]} en sartén caliente` : 'Calienta aceite en el wok',
            `Añade las verduras y saltea a fuego alto 3-4 minutos`,
            proteins.length > 0 ? `${proteins.length > 1 ? 'Incorpora ' + proteins.slice(1).join(', ') : 'Añade el resto de ingredientes'} y cocina 2 minutos más` : 'Cocina todo junto 2 minutos',
            'Sazona con sal y pimienta al gusto',
            'Sirve inmediatamente'
          ]
        };

      case 'Guiso':
        return {
          title: `Guiso de ${proteins[0] || ings[0]}`,
          description: 'Un guiso reconfortante y lleno de sabor',
          steps: [
            'Pica todas las verduras y corta la proteína en trozos',
            'Sofríe la cebolla hasta que esté transparente',
            proteins.length > 0 ? `Añade la ${proteins[0]} y sella por todos lados` : 'Añade las verduras principales',
            `Incorpora ${vegetables.length > 0 ? vegetables.join(', ') : ings.slice(0, 3).join(', ')}`,
            'Cubre con agua o caldo',
            'Cocina a fuego lento 25-30 minutos',
            'Ajusta la sazón y sirve caliente'
          ]
        };

      case 'Ensalada':
        return {
          title: `Ensalada de ${ings.slice(0, 2).join(' y ')}`,
          description: 'Una ensalada fresca y nutritiva',
          steps: [
            `Lava y corta ${ings.join(', ')} en trozos o láminas`,
            'Coloca todo en un bowl grande',
            'Prepara un aliño simple con aceite, limón y sal',
            'Mezcla bien todos los ingredientes',
            'Decora con hierbas frescas si tienes',
            'Sirve inmediatamente'
          ]
        };

      case 'Pasta/Arroz':
        return {
          title: `Preparación con ${carbs[0] || ings[0]}`,
          description: 'Una preparación deliciosa con tus ingredientes',
          steps: [
            `${carbs.length > 0 ? `Cocina ${carbs[0]} según las instrucciones` : 'Prepara los ingredientes'}`,
            `Mientras, pica ${vegetables.length > 0 ? vegetables.join(', ') : ings.filter(i => !carbs.includes(i)).slice(0, 3).join(', ')}`,
            proteins.length > 0 ? `Cocina ${proteins[0]} brevemente` : 'Sofríe las verduras',
            'Mezcla todo junto',
            proteins.length > 0 ? `Añade ${proteins[0]} a la preparación` : 'Sazona al gusto',
            'Sirve caliente'
          ]
        };

      default:
        return {
          title: `Plato con ${ings[0]}`,
          description: 'Una receta creada especialmente para ti',
          steps: [
            `Prepara todos los ingredientes: ${ingsList}`,
            'Lava y corta todo en trozos adecuados',
            'Cocina según el método que prefieras',
            'Sazona al gusto con lo que tengas',
            'Sirve y disfruta'
          ]
        };
    }
  };

  const saveGeneratedRecipe = () => {
    if (generatedRecipe && onSaveRecipe) {
      onSaveRecipe(generatedRecipe);
      setGeneratedRecipe(null);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(44, 74, 62, 0.95)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--background)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        position: 'relative',
        borderRadius: '24px'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'var(--accent)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--primary)'
        }}>
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--secondary) 0%, #E9C992 100%)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 10px 30px rgba(212, 163, 115, 0.4)'
          }}>
            <Wand2 size={28} style={{ color: 'white' }} />
          </div>
          <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem' }}>El Alquimista</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Dime qué ingredientes tienes y crearé una receta
          </p>
        </div>

        {/* Contador */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '1rem',
          fontSize: '0.85rem',
          color: ingredients.length >= MAX_INGREDIENTS ? 'var(--secondary)' : 'var(--text-muted)'
        }}>
          {ingredients.length} de {MAX_INGREDIENTS} ingredientes
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
            placeholder={`Escribe un ingrediente (máx ${MAX_INGREDIENTS})...`}
            disabled={ingredients.length >= MAX_INGREDIENTS}
            style={{
              flex: 1,
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              border: '2px solid var(--accent)',
              fontFamily: 'var(--font-main)',
              fontSize: '1rem',
              outline: 'none',
              opacity: ingredients.length >= MAX_INGREDIENTS ? 0.5 : 1
            }}
          />
          <button 
            onClick={addIngredient} 
            disabled={ingredients.length >= MAX_INGREDIENTS}
            style={{
              padding: '0 1rem',
              background: ingredients.length >= MAX_INGREDIENTS ? '#ccc' : 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.5rem',
              cursor: ingredients.length >= MAX_INGREDIENTS ? 'not-allowed' : 'pointer'
            }}
          >
            +
          </button>
        </div>

        {/* Ingredientes añadidos */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.5rem', 
          marginBottom: '1.5rem',
          minHeight: '60px',
          padding: ingredients.length > 0 ? '0.75rem' : '0',
          backgroundColor: ingredients.length > 0 ? 'rgba(233, 237, 198, 0.3)' : 'transparent',
          borderRadius: '12px'
        }}>
          {ingredients.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 'auto', textAlign: 'center', width: '100%' }}>
              Añade {MIN_INGREDIENTS}-{MAX_INGREDIENTS} ingredientes que tengas en casa
            </p>
          ) : (
            ingredients.map((ing, index) => (
              <span key={index} style={{
                backgroundColor: 'var(--secondary)',
                color: 'white',
                padding: '0.4rem 0.75rem',
                borderRadius: '100px',
                fontSize: '0.85rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {ing}
                <button 
                  onClick={() => removeIngredient(ing)} 
                  style={{ 
                    background: 'rgba(255,255,255,0.3)', 
                    border: 'none', 
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    padding: 0,
                    fontSize: '0.75rem'
                  }}
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>

        {/* Botón generar */}
        <button 
          onClick={generateMagicRecipe}
          disabled={ingredients.length < MIN_INGREDIENTS || isGenerating}
          style={{
            width: '100%', 
            padding: '1rem', 
            fontSize: '1rem',
            background: ingredients.length >= MIN_INGREDIENTS 
              ? 'linear-gradient(135deg, var(--secondary) 0%, #C6925A 100%)' 
              : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            cursor: ingredients.length >= MIN_INGREDIENTS ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
        >
          {isGenerating ? (
            <>
              <span>✨</span>
              Creando receta...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Crear Receta Mágica
            </>
          )}
        </button>

        {/* Receta generada */}
        {generatedRecipe && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              marginBottom: '1rem',
              color: 'var(--secondary)'
            }}>
              <Sparkles size={18} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--secondary)' }}>¡Receta Creada!</h3>
            </div>

            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '1.25rem',
              marginBottom: '1rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--primary)' }}>
                {generatedRecipe.title}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                {generatedRecipe.description}
              </p>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={14} />
                  {generatedRecipe.time}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ChefHat size={14} />
                  {generatedRecipe.difficulty}
                </span>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Ingredientes:</p>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {generatedRecipe.ingredients.map((ing, i) => (
                    <span key={i}>• {ing}{i < generatedRecipe.ingredients.length - 1 ? ', ' : ''}</span>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Pasos:</p>
                <ol style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.85rem' }}>
                  {generatedRecipe.steps.map((step, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem', color: 'var(--text-main)' }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={saveGeneratedRecipe}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontWeight: 500
                }}
              >
                <Save size={16} />
                Guardar
              </button>
              <button 
                onClick={generateMagicRecipe}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: 'var(--accent)',
                  color: 'var(--primary)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontWeight: 500
                }}
              >
                <Sparkles size={16} />
                Otra idea
              </button>
            </div>
          </div>
        )}

        {/* Tips */}
        {!generatedRecipe && ingredients.length >= MIN_INGREDIENTS && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'rgba(212, 163, 115, 0.1)', 
            borderRadius: '12px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>💡 Tip:</p>
            <p style={{ margin: 0 }}>La receta solo usará los ingredientes que añadas. ¡Sé creativo!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alchemist;
