import React, { useState, useEffect } from 'react';
import { X, Camera, Heart, Edit2, Trash2, Star } from 'lucide-react';

const Diario = ({ onClose }) => {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('milenaroma_diario');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    recipeName: '',
    notes: '',
    rating: 5,
    image: null,
    imagePreview: null
  });

  useEffect(() => {
    localStorage.setItem('milenaroma_diario', JSON.stringify(entries));
  }, [entries]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: file, imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: editingEntry ? editingEntry.id : Date.now(),
      recipeName: formData.recipeName,
      notes: formData.notes,
      rating: formData.rating,
      image: formData.imagePreview,
      date: editingEntry ? editingEntry.date : new Date().toISOString().split('T')[0]
    };

    if (editingEntry) {
      setEntries(entries.map(entry => entry.id === editingEntry.id ? newEntry : entry));
    } else {
      setEntries([newEntry, ...entries]);
    }

    setFormData({ recipeName: '', notes: '', rating: 5, image: null, imagePreview: null });
    setShowForm(false);
    setEditingEntry(null);
  };

  const editEntry = (entry) => {
    setEditingEntry(entry);
    setFormData({
      recipeName: entry.recipeName,
      notes: entry.notes,
      rating: entry.rating,
      image: null,
      imagePreview: entry.image
    });
    setShowForm(true);
  };

  const deleteEntry = (id) => {
    if (confirm('¿Eliminar esta entrada del diario?')) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

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
          maxWidth: '800px',
          margin: '0 auto 2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              backgroundColor: 'var(--primary)', 
              borderRadius: '12px', 
              padding: '0.75rem',
              color: 'white'
            }}>
              <Heart size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>Diario de Milena</h2>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Tu legado culinario
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              <Camera size={18} />
              Nueva Entrada
            </button>
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

        {/* Entries Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {entries.map(entry => (
            <div
              key={entry.id}
              className="glass"
              style={{ overflow: 'hidden' }}
            >
              {entry.image && (
                <div style={{
                  height: '200px',
                  backgroundImage: `url(${entry.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: 0,
                    right: 0,
                    padding: '1rem',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    color: 'white'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>{entry.date}</p>
                  </div>
                </div>
              )}
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>{entry.recipeName}</h3>
                
                {/* Rating */}
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={16}
                      fill={star <= entry.rating ? 'var(--secondary)' : 'none'}
                      stroke={star <= entry.rating ? 'var(--secondary)' : 'var(--text-muted)'}
                    />
                  ))}
                </div>

                {/* Notes */}
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.9rem', 
                  color: 'var(--text-muted)',
                  lineHeight: 1.6
                }}>
                  {entry.notes}
                </p>

                {/* Actions */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--accent)'
                }}>
                  <button
                    onClick={() => editEntry(entry)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      color: '#e74c3c'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📔</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Tu diario está vacío</h3>
            <p style={{ marginBottom: '1.5rem' }}>Comienza a documentar tus creaciones culinarias y añade notas para mejorar tus recetas</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              <Camera size={18} />
              Crear primera entrada
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
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
          <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>
              {editingEntry ? 'Editar Entrada' : 'Nueva Entrada del Diario'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  padding: '2rem',
                  border: '2px dashed var(--accent)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: formData.imagePreview ? 'transparent' : 'var(--accent)'
                }}>
                  {formData.imagePreview ? (
                    <img 
                      src={formData.imagePreview} 
                      alt="Preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                    />
                  ) : (
                    <>
                      <Camera size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                      <p style={{ margin: 0, color: 'var(--text-muted)' }}>Subir foto del plato</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Recipe Name */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Nombre de la receta
                </label>
                <input
                  type="text"
                  value={formData.recipeName}
                  onChange={(e) => setFormData({ ...formData, recipeName: e.target.value })}
                  required
                  placeholder="Ej: Risotto de hongos..."
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '12px',
                    border: '2px solid var(--accent)',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Rating */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Valoración
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem'
                      }}
                    >
                      <Star
                        size={28}
                        fill={star <= formData.rating ? 'var(--secondary)' : 'none'}
                        stroke={star <= formData.rating ? 'var(--secondary)' : 'var(--text-muted)'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Notas de la Chef
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ej: Añadir más romero la próxima vez, quedó perfecto..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '12px',
                    border: '2px solid var(--accent)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEntry(null);
                    setFormData({ recipeName: '', notes: '', rating: 5, image: null, imagePreview: null });
                  }}
                  className="btn"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {editingEntry ? 'Guardar Cambios' : 'Crear Entrada'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diario;
