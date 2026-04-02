import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Check, Trash2, Share2 } from 'lucide-react';

const CATEGORIES = {
  'Frutas y Verduras': ['tomate', 'cebolla', 'ajo', 'lechuga', 'zanahoria', 'pimiento', 'brócoli', 'espárragos', 'hongos', 'espinacas'],
  'Carnes y Pescados': ['pollo', 'carne', 'cerdo', 'vacuno', 'salmón', 'trucha', 'pato', 'magret'],
  'Lácteos': ['mantequilla', 'queso', 'parmesano', 'leche', 'crema', 'yogur'],
  'Granos y Pasta': ['arroz', 'pasta', 'pan', 'harina'],
  'Condimentos': ['sal', 'pimienta', 'aceite', 'vinagre', 'miel', 'eneldo', 'perejil', 'tomillo', 'romero'],
  'Vinos y Licores': ['vino blanco', 'vino tinto', 'vinagre balsámico'],
  'Otros': []
};

const ShoppingList = ({ onClose }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('milenaroma_shoppinglist');
    return saved ? JSON.parse(saved) : [];
  });
  const [newItem, setNewItem] = useState('');
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem('milenaroma_checked');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('milenaroma_shoppinglist', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('milenaroma_checked', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
    setCheckedItems(checkedItems.filter(i => i !== index));
  };

  const toggleCheck = (index) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter(i => i !== index));
    } else {
      setCheckedItems([...checkedItems, index]);
    }
  };

  const clearChecked = () => {
    setItems(items.filter((_, i) => !checkedItems.includes(i)));
    setCheckedItems([]);
  };

  const getCategory = (item) => {
    const lowerItem = item.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORIES)) {
      if (keywords.some(kw => lowerItem.includes(kw))) {
        return category;
      }
    }
    return 'Otros';
  };

  const groupedItems = items.reduce((acc, item, index) => {
    const category = getCategory(item);
    if (!acc[category]) acc[category] = [];
    acc[category].push({ item, index });
    return acc;
  }, {});

  const shareList = () => {
    const text = `🛒 Lista de Compras MilenAroma\n\n${items.map((item, i) => `☐ ${item}`).join('\n')}`;
    if (navigator.share) {
      navigator.share({ title: 'Lista de Compras', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Lista copiada al portapapeles');
    }
  };

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
      <div className="glass" style={{
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              backgroundColor: 'var(--primary)', 
              borderRadius: '12px', 
              padding: '0.75rem',
              color: 'white'
            }}>
              <ShoppingCart size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>Lista de Compras</h2>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {items.length} artículos
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {checkedItems.length > 0 && (
              <button
                onClick={clearChecked}
                className="btn"
                style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '0.5rem 1rem' }}
              >
                <Trash2 size={16} />
                Limpiar
              </button>
            )}
            <button 
              onClick={shareList}
              className="btn"
              style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.5rem 1rem' }}
            >
              <Share2 size={16} />
            </button>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                color: 'var(--text-muted)'
              }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Add Item Input */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="Añadir artículo..."
            style={{
              flex: 1,
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              border: '2px solid var(--accent)',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
          <button
            onClick={addItem}
            className="btn btn-primary"
            style={{ padding: '0 1.25rem' }}
          >
            +
          </button>
        </div>

        {/* Items List */}
        {items.length > 0 ? (
          <div>
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ 
                  fontSize: '0.75rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px',
                  color: 'var(--text-muted)',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid var(--accent)'
                }}>
                  {category}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {categoryItems.map(({ item, index }) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: checkedItems.includes(index) ? 'rgba(0,0,0,0.03)' : 'white',
                        borderRadius: '12px',
                        transition: 'var(--transition)'
                      }}
                    >
                      <button
                        onClick={() => toggleCheck(index)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          border: `2px solid ${checkedItems.includes(index) ? 'var(--primary)' : 'var(--accent)'}`,
                          backgroundColor: checkedItems.includes(index) ? 'var(--primary)' : 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          flexShrink: 0
                        }}
                      >
                        {checkedItems.includes(index) && <Check size={14} />}
                      </button>
                      <span style={{
                        flex: 1,
                        textDecoration: checkedItems.includes(index) ? 'line-through' : 'none',
                        color: checkedItems.includes(index) ? 'var(--text-muted)' : 'var(--text-main)'
                      }}>
                        {item}
                      </span>
                      <button
                        onClick={() => removeItem(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-muted)',
                          padding: '0.25rem',
                          opacity: 0.5
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
            <p>Tu lista está vacía</p>
            <p style={{ fontSize: '0.875rem' }}>Añade artículos o genera una desde el planificador</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
