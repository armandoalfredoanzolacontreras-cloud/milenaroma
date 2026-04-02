import React, { useState } from 'react';
import { X, Plus, Youtube, FileText, Link, Check, Loader, Wand2, Clipboard, Copy, Search, Sparkles } from 'lucide-react';

const AddRecipe = ({ onClose, onSave }) => {
  const [mode, setMode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [],
    steps: [],
    time: '',
    difficulty: 'Fácil',
    mood: 'Relajada',
    tags: [],
    youtubeUrl: '',
    pdfUrl: '',
    textContent: '',
    transcript: ''
  });
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [extracted, setExtracted] = useState(false);

  const addIngredient = (ingredient = currentIngredient) => {
    if (ingredient.trim()) {
      setFormData({ ...formData, ingredients: [...formData.ingredients, ingredient.trim()] });
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (index) => {
    setFormData({ ...formData, ingredients: formData.ingredients.filter((_, i) => i !== index) });
  };

  const addStep = (step = currentStep) => {
    if (step.trim()) {
      setFormData({ ...formData, steps: [...formData.steps, step.trim()] });
      setCurrentStep('');
    }
  };

  const removeStep = (index) => {
    setFormData({ ...formData, steps: formData.steps.filter((_, i) => i !== index) });
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag.trim()] });
      setCurrentTag('');
    }
  };

  const removeTag = (index) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
  };

  const extractYouTubeId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  const fetchYouTubeData = async (url) => {
    const videoId = extractYouTubeId(url);
    if (!videoId) return null;

    try {
      // Intentar con noembed
      const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
      const data = await response.json();
      return {
        title: data.title || '',
        author: data.author_name || '',
        thumbnail: data.thumbnail_url || ''
      };
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
      return null;
    }
  };

  const parseRecipeFromText = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const ingredients = [];
    const steps = [];
    let title = '';
    let description = '';
    let time = '';

    // Detectar tiempo - múltiples patrones
    const timePatterns = [
      /(?:tiempo|duración|demora):?\s*(\d+\s*(?:min|mins|minutos|horas?|hs?))/i,
      /(\d+)\s*(?:min|mins|minutos|horas?|h)\b/i,
      /(?:en|listo en|preparar en)\s*(\d+\s*(?:min|mins|minutos|horas?|h))/i,
      /(?:takes|ready in)\s*(\d+\s*(?:min|minutes?|hours?|hrs?))/i
    ];
    
    for (const pattern of timePatterns) {
      const match = text.match(pattern);
      if (match) {
        time = match[0].replace(/^(?:tiempo|duración|demora|en|listo en|preparar en|takes|ready in):?\s*/i, '').trim();
        break;
      }
    }

    // Patrones para detectar ingredientes (más exhaustivo)
    const ingredientPatterns = [
      /^[\-\•\*●▪]\s*(.+)/,                    // - ingrediente, • ingrediente
      /^\d+[\.\)]\s*(.+)/,                     // 1. ingrediente
      /^(?:\d+[\.,]?\d*)\s*(?:g|gr|kg|ml|l|cc|cdta|cda|cucharada|cucharadita|taza|tazas|pieza|piezas|diente|dientes|manojo|manojos|lata|latas|pizca|pizcas|ración|raciones|litro|litros|gramo|gramos|mililitro|mililitros)\s+(.+)/i,
      /^(?:un(?:a)?|unos|unas|medio|media|un cuarto)\s+(.+)/i,  // una cebolla, medio limón
      /^[\d\s\/]+\s*(?:de\s+)?(?:(?:g|gr|kg|ml|l|oz|lb|libra|libras|onza|onzas)\s+)?(?:de\s+)?(.+)/i
    ];

    // Patrones para detectar pasos
    const stepPatterns = [
      /^(\d+)[\.\)\-:]\s*(.+)/,                // 1. Paso, 1) Paso
      /^(?:paso|step)\s*(\d+)[\.\)\-:]\s*(.+)/i,  // Paso 1: ...
      /^(?:primero|segundo|tercero|luego|después|finalmente),?\s*(.+)/i,  // Primero, ...
      /^\d+\s*[-–—]\s*(.+)/,                    // 1 - Paso
      /^(?:→|➤|➡)\s*(.+)/                      // → Paso
    ];

    // Palabras clave para identificar secciones
    const isIngredientSection = (line) => /ingredient[e]?s?|材料|材料|ingrédients/i.test(line);
    const isStepSection = (line) => /paso[s]?|step[s]?|instrucciones|preparación|elaboración|método|procedimiento|procedimiento/i.test(line);

    let currentSection = 'header'; // header, ingredients, steps

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return;

      // Detectar cambio de sección
      if (isIngredientSection(trimmedLine)) {
        currentSection = 'ingredients';
        return;
      }
      if (isStepSection(trimmedLine)) {
        currentSection = 'steps';
        return;
      }

      // Header: título y descripción
      if (currentSection === 'header') {
        // Primera línea no vacía = título
        if (!title && trimmedLine.length > 2 && trimmedLine.length < 150) {
          // Verificar que no sea una palabra de sección
          if (!/(?:ingredient|paso|step|instrucc)/i.test(trimmedLine)) {
            title = trimmedLine.replace(/^#+\s*/, '').replace(/[:\s]+$/, '');
            return;
          }
        }
        // Segunda o tercera línea = descripción
        if (title && !description && trimmedLine.length > 15) {
          description = trimmedLine;
          return;
        }
      }

      // Buscar ingredientes
      if (currentSection === 'ingredients' || currentSection === 'header') {
        let ingredientFound = false;
        
        for (const pattern of ingredientPatterns) {
          const match = trimmedLine.match(pattern);
          if (match) {
            let ingredient = match[1] || match[0];
            ingredient = ingredient.replace(/^[\-\•\*\d+\.\)]\s*/, '').trim();
            
            // Si encontró una cantidad, incluirla
            const quantityMatch = trimmedLine.match(/^[\-\•\*\d+\.\)]\s*(.+)/);
            if (quantityMatch) {
              ingredient = quantityMatch[1].trim();
            }
            
            if (ingredient.length > 2 && ingredient.length < 200) {
              ingredients.push(ingredient);
              ingredientFound = true;
              break;
            }
          }
        }
        
        // Si estamos en sección de ingredientes y no encontró patrón, podría ser ingrediente
        if (!ingredientFound && currentSection === 'ingredients' && trimmedLine.length > 2 && trimmedLine.length < 200) {
          // Verificar que no sea un paso (oraciones largas con verbos)
          const isLikelyStep = /^(?:mezclar|cocinar|hornear|freír|hervir|cortar|picar|pelar|limpiar|preparar|servir|añadir|agregar|incorporar|dejar|retirar|reservar)/i.test(trimmedLine);
          if (!isLikelyStep && !trimmedLine.includes(' y ') && !trimmedLine.includes(',')) {
            // Probablemente un ingrediente simple
          } else if (trimmedLine.match(/(?:g|gr|kg|ml|l|cucharada|taza|pieza|diente)\b/i)) {
            ingredients.push(trimmedLine);
          }
        }
      }

      // Buscar pasos
      if (currentSection === 'steps') {
        for (const pattern of stepPatterns) {
          const match = trimmedLine.match(pattern);
          if (match) {
            const step = match[2] || match[1];
            if (step.length > 5) {
              steps.push(step.trim());
              return;
            }
          }
        }
        
        // Si estamos en sección de pasos y es una línea larga, probablemente es un paso
        if (trimmedLine.length > 20 && !trimmedLine.match(/^\d+\s*(g|gr|kg|ml)/i)) {
          steps.push(trimmedLine);
        }
      }
    });

    // Si no se detectó sección pero hay números seguidos de texto, son pasos
    if (steps.length === 0 && ingredients.length > 0) {
      lines.forEach(line => {
        const stepMatch = line.trim().match(/^(\d+)[\.\)\-:]\s*(.+)/);
        if (stepMatch && stepMatch[2].length > 10) {
          steps.push(stepMatch[2].trim());
        }
      });
    }

    return { title, description, ingredients, steps, time };
  };

  const handleYouTubeUrlChange = async (url) => {
    setFormData({ ...formData, youtubeUrl: url });
    
    const videoId = extractYouTubeId(url);
    if (videoId && (url.includes('youtube.com') || url.includes('youtu.be'))) {
      setIsLoading(true);
      
      try {
        const data = await fetchYouTubeData(url);
        if (data) {
          setFormData(prev => ({
            ...prev,
            youtubeUrl: url,
            title: prev.title || data.title
          }));
        }
      } catch (error) {
        console.error('Error:', error);
      }
      
      setIsLoading(false);
    }
  };

  const handleTextPaste = (text) => {
    const parsed = parseRecipeFromText(text);
    
    setFormData(prev => ({
      ...prev,
      textContent: text,
      title: prev.title || parsed.title,
      description: prev.description || parsed.description,
      time: prev.time || parsed.time,
      ingredients: parsed.ingredients.length > 0 ? parsed.ingredients : prev.ingredients,
      steps: parsed.steps.length > 0 ? parsed.steps : prev.steps
    }));
  };

  const handleTranscriptPaste = (text) => {
    setFormData(prev => ({ ...prev, transcript: text }));
    const parsed = parseRecipeFromText(text);
    
    if (parsed.ingredients.length > 0 || parsed.steps.length > 0) {
      setFormData(prev => ({
        ...prev,
        transcript: text,
        ingredients: [...new Set([...prev.ingredients, ...parsed.ingredients])],
        steps: [...new Set([...prev.steps, ...parsed.steps])],
        time: prev.time || parsed.time
      }));
    }
  };

  const handleExtractRecipe = async () => {
    const videoId = extractYouTubeId(formData.youtubeUrl);
    
    if (!formData.youtubeUrl.trim() && !formData.transcript.trim()) {
      alert('Chef dice: Necesito el enlace del video Y la transcripción. Sin uno de los dos, no puedo hacer magia.');
      return;
    }

    setIsLoading(true);
    
    try {
      let parsed = { title: '', description: '', ingredients: [], steps: [], time: '' };
      
      if (formData.transcript.trim()) {
        parsed = parseRecipeFromText(formData.transcript);
      }
      
      if (videoId) {
        const ytData = await fetchYouTubeData(formData.youtubeUrl);
        if (ytData) {
          parsed.title = parsed.title || ytData.title;
          parsed.description = parsed.description || `Video de ${ytData.author}`;
        }
      }
      
      const timeMatch = formData.transcript.match(/(\d+)\s*(?:min|mins|minutos|horas?|h)\b/i);
      if (timeMatch && !parsed.time) {
        parsed.time = timeMatch[0];
      }
      
      const difficultyMatch = formData.transcript.match(/(?:difícil|dificultad\s*[:\-]?\s*)(?:alta|fácil|media|muy\s*fácil|muy\s*difícil)/i);
      if (difficultyMatch) {
        const diff = difficultyMatch[0].toLowerCase();
        if (diff.includes('fácil') && !diff.includes('difícil')) parsed.difficulty = 'Fácil';
        else if (diff.includes('media')) parsed.difficulty = 'Media';
        else if (diff.includes('difícil') || diff.includes('alta')) parsed.difficulty = 'Alta';
      }
      
      setFormData(prev => ({
        ...prev,
        title: parsed.title || prev.title,
        description: parsed.description || prev.description,
        ingredients: parsed.ingredients.length > 0 ? parsed.ingredients : prev.ingredients,
        steps: parsed.steps.length > 0 ? parsed.steps : prev.steps,
        time: parsed.time || prev.time
      }));
      
      setExtracted(true);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Chef dice: Algo salió mal. Intenta de nuevo.');
    }
    
    setIsLoading(false);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Chef dice: Toda receta merece un nombre. ¿Cómo la llamamos?');
      return;
    }
    if (formData.ingredients.length === 0 && formData.steps.length === 0) {
      alert('Chef dice: Al menos un ingrediente y un paso, que esto no es sopa sin nada.');
      return;
    }

    const newRecipe = {
      id: Date.now(),
      title: formData.title,
      description: formData.description || `Receta${mode === 'youtube' ? ' de YouTube' : ''}`,
      ingredients: formData.ingredients,
      steps: formData.steps,
      time: formData.time || '30 min',
      difficulty: formData.difficulty,
      mood: formData.mood,
      tags: formData.tags.length > 0 ? formData.tags : ['casera'],
      source: mode,
      youtubeUrl: formData.youtubeUrl,
      pdfUrl: formData.pdfUrl
    };

    onSave(newRecipe);
    onClose();
  };

  if (!mode) {
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
        <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ margin: 0 }}>Nueva Receta</h2>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                ¡Añade tu creación favorita!
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            ¿De dónde viene esta delicia?
          </p>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <button onClick={() => setMode('manual')} className="btn btn-primary" style={{ padding: '1.5rem', justifyContent: 'flex-start', gap: '1rem' }}>
              <Plus size={24} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, margin: 0 }}>Desde cero</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>Escribe tu receta paso a paso</p>
              </div>
            </button>

            <button onClick={() => setMode('youtube')} className="btn" style={{ padding: '1.5rem', justifyContent: 'flex-start', gap: '1rem', backgroundColor: '#FF0000', color: 'white' }}>
              <Youtube size={24} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, margin: 0 }}>De YouTube</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>Pega el enlace y extraemos la info</p>
              </div>
            </button>

            <button onClick={() => setMode('text')} className="btn" style={{ padding: '1.5rem', justifyContent: 'flex-start', gap: '1rem', backgroundColor: '#2C4A3E', color: 'white' }}>
              <FileText size={24} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, margin: 0 }}>Pegar texto</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>Copia la receta y la organizamos</p>
              </div>
            </button>

            <button onClick={() => setMode('link')} className="btn" style={{ padding: '1.5rem', justifyContent: 'flex-start', gap: '1rem', backgroundColor: '#4285F4', color: 'white' }}>
              <Link size={24} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, margin: 0 }}>De un blog o web</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>Guarda el enlace para después</p>
              </div>
            </button>

            <button onClick={() => setMode('pdf')} className="btn" style={{ padding: '1.5rem', justifyContent: 'flex-start', gap: '1rem', backgroundColor: '#E74C3C', color: 'white' }}>
              <FileText size={24} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, margin: 0 }}>Documento PDF</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>Subir o enlazar PDF</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <button onClick={() => setMode(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ← Volver
            </button>
            <h2 style={{ margin: 0 }}>
              {mode === 'youtube' && '📺 Desde YouTube'}
              {mode === 'manual' && '✏️ Crear Receta'}
              {mode === 'text' && '📝 Pegar Texto'}
              {mode === 'link' && '🔗 Desde Enlace'}
              {mode === 'pdf' && '📄 Desde PDF'}
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          {/* YouTube Input */}
          {mode === 'youtube' && (
            <>
              <div className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>🎬 Enlace del video</h3>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    value={formData.youtubeUrl}
                    onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    style={{
                      flex: 1,
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '2px solid var(--accent)',
                      fontSize: '1rem'
                    }}
                  />
                  {isLoading && <Loader size={24} className="animate-spin" style={{ color: 'var(--secondary)' }} />}
                </div>
                
                {formData.youtubeUrl && extractYouTubeId(formData.youtubeUrl) && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '12px', overflow: 'hidden' }}>
                      <iframe
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        src={`https://www.youtube.com/embed/${extractYouTubeId(formData.youtubeUrl)}`}
                        title="YouTube video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Transcript Box + Extract Button */}
              <div className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>📝 Transcripción / Descripción</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  En YouTube, haz clic en "...Mostrar más" debajo del video para ver la descripción,
                  o usa el botón de transcripción (tres puntos → "Mostrar transcripción").
                </p>

                <textarea
                  value={formData.transcript}
                  onChange={(e) => {
                    setFormData({ ...formData, transcript: e.target.value });
                    setExtracted(false);
                  }}
                  placeholder={`Pega aquí la transcripción o descripción del video. Por ejemplo:

Ingredientes:
- 2 huevos
- 1 taza de harina
- 200ml de leche
- Azúcar al gusto

Pasos:
1. Mezclar los ingredientes secos
2. Añadir los huevos y batir
3. Agregar la leche poco a poco
4. Cocinar en sartén caliente...`}
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: extracted ? '2px solid #27ae60' : '2px solid var(--accent)',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
                
                <button 
                  onClick={handleExtractRecipe}
                  className="btn btn-primary"
                  disabled={isLoading}
                  style={{ 
                    width: '100%', 
                    marginTop: '1rem', 
                    justifyContent: 'center',
                    padding: '1rem',
                    fontSize: '1rem',
                    background: isLoading ? '#95a5a6' : (extracted ? '#27ae60' : undefined)
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Extrayendo receta...
                    </>
                  ) : extracted ? (
                    <>
                      <Check size={20} />
                      ¡Receta extraída! Edita abajo si necesitas
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Extraer Receta Completa
                    </>
                  )}
                </button>

                {extracted && (
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    backgroundColor: 'rgba(39, 174, 96, 0.1)', 
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: 0, color: '#27ae60', fontWeight: 500 }}>
                      ✨ Se extrajeron {formData.ingredients.length} ingredientes y {formData.steps.length} pasos
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Text Input */}
          {mode === 'text' && (
            <div className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>📝 Pegar receta</h3>
              <textarea
                value={formData.textContent}
                onChange={(e) => handleTextPaste(e.target.value)}
                placeholder={`Pega aquí el texto de la receta. Detecto automáticamente:

Ejemplo:
Pollo con limón
Una receta fresca y rápida

Ingredientes:
- 2 pechugas de pollo
- 1 limón
- 2 dientes de ajo
- Aceite de oliva
- Sal y pimienta

Pasos:
1. Marinar el pollo con limón y ajo
2. Calentar el aceite en la sartén
3. Cocinar el pollo 5 minutos por lado
4. Servir con ensalada`}
                rows={12}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid var(--accent)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
              {formData.ingredients.length > 0 || formData.steps.length > 0 ? (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--accent)', borderRadius: '12px' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, fontSize: '0.9rem' }}>
                    ✨ Datos extraídos automáticamente:
                  </p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>
                    {formData.ingredients.length} ingredientes • {formData.steps.length} pasos
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Link Input */}
          {mode === 'link' && (
            <div className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>🔗 Enlace web</h3>
              <input
                type="text"
                value={formData.pdfUrl}
                onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                placeholder="https://ejemplo.com/receta..."
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid var(--accent)',
                  fontSize: '1rem'
                }}
              />
            </div>
          )}

          {/* PDF Input */}
          {mode === 'pdf' && (
            <div className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>📄 Documento PDF</h3>
              <input
                type="text"
                value={formData.pdfUrl}
                onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                placeholder="Nombre o enlace al PDF..."
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid var(--accent)',
                  fontSize: '1rem'
                }}
              />
            </div>
          )}

          {/* Basic Info */}
          <div className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>📋 Información básica</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={mode === 'youtube' ? (extracted ? 'Título detectado' : 'Se completará al extraer...') : 'Nombre de la receta'}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: extracted ? '2px solid #27ae60' : '2px solid var(--accent)',
                  fontSize: '1rem',
                  backgroundColor: formData.title ? 'rgba(233, 237, 198, 0.3)' : 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descripción de la receta"
                rows={2}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid var(--accent)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tiempo</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="30 min"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: '2px solid var(--accent)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Dificultad</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: '2px solid var(--accent)',
                    fontSize: '0.9rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option>Fácil</option>
                  <option>Media</option>
                  <option>Alta</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Estado</label>
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: '2px solid var(--accent)',
                    fontSize: '0.9rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option>Relajada</option>
                  <option>Con Prisa</option>
                  <option>Anfitriona</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>🥕 Ingredientes {formData.ingredients.length > 0 && <span style={{ fontWeight: 400, fontSize: '0.9rem', color: 'var(--secondary)' }}>({formData.ingredients.length})</span>}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                placeholder="Ej: 300g de arroz..."
                style={{
                  flex: 1,
                  padding: '0.875rem 1rem',
                  borderRadius: '12px',
                  border: '2px solid var(--accent)',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <button onClick={() => addIngredient()} className="btn btn-primary" style={{ padding: '0 1.25rem' }}>+</button>
            </div>
            {formData.ingredients.length > 0 ? (
              <div style={{ 
                backgroundColor: 'rgba(233, 237, 198, 0.3)', 
                borderRadius: '12px', 
                padding: '0.5rem',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {formData.ingredients.map((ing, index) => (
                  <div key={index} style={{ 
                    padding: '0.875rem 1rem', 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    marginBottom: '0.375rem',
                    display: 'flex', 
                    alignItems: 'center',
                    fontSize: '1rem',
                    lineHeight: 1.5,
                    border: '1px solid #e8e8e8'
                  }}>
                    <span style={{ 
                      flex: 1, 
                      color: '#1a1a1a', 
                      fontWeight: 500,
                      letterSpacing: '0.01em'
                    }}>
                      {ing}
                    </span>
                    <button 
                      onClick={() => removeIngredient(index)} 
                      title="Eliminar"
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: '#999', 
                        padding: '0.25rem 0.5rem', 
                        fontSize: '1.25rem', 
                        lineHeight: 1,
                        flexShrink: 0,
                        marginLeft: '0.5rem'
                      }}
                    >×</button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '12px', fontSize: '0.9rem' }}>
                {mode === 'youtube' ? (extracted ? 'Ingredientes detectados arriba' : 'Usa el botón "Extraer Receta Completa"') : 'Añade los ingredientes'}
              </p>
            )}
          </div>

          {/* Steps */}
          <div className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>👨‍🍳 Pasos {formData.steps.length > 0 && <span style={{ fontWeight: 400, fontSize: '0.9rem', color: 'var(--secondary)' }}>({formData.steps.length})</span>}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={currentStep}
                onChange={(e) => setCurrentStep(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())}
                placeholder="Describe el paso..."
                style={{
                  flex: 1,
                  padding: '0.875rem 1rem',
                  borderRadius: '12px',
                  border: '2px solid var(--accent)',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <button onClick={() => addStep()} className="btn btn-primary" style={{ padding: '0 1.25rem' }}>+</button>
            </div>
            {formData.steps.length > 0 ? (
              <div style={{ 
                backgroundColor: 'rgba(233, 237, 198, 0.3)', 
                borderRadius: '12px', 
                padding: '0.5rem',
                maxHeight: '350px',
                overflowY: 'auto'
              }}>
                {formData.steps.map((step, index) => (
                  <div key={index} style={{ 
                    padding: '1rem', 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    marginBottom: '0.375rem',
                    display: 'flex', 
                    gap: '1rem',
                    alignItems: 'flex-start',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    border: '1px solid #e8e8e8'
                  }}>
                    <span style={{ 
                      backgroundColor: '#3d6b4f', 
                      color: 'white', 
                      minWidth: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      flexShrink: 0
                    }}>{index + 1}</span>
                    <span style={{ flex: 1, wordBreak: 'break-word', color: '#1a1a1a', fontWeight: 400 }}>{step}</span>
                    <button 
                      onClick={() => removeStep(index)}
                      title="Eliminar"
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: '#999', 
                        padding: '0.25rem 0.5rem', 
                        fontSize: '1.25rem', 
                        lineHeight: 1,
                        flexShrink: 0
                      }}
                    >×</button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '12px', fontSize: '0.9rem' }}>
                {mode === 'youtube' ? (extracted ? 'Pasos detectados arriba' : 'Usa el botón "Extraer Receta Completa"') : 'Añade los pasos'}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', justifyContent: 'center' }}
          >
            <Check size={20} />
            Guardar Receta
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
