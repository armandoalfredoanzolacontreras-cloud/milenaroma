import { useState, useRef } from 'react'
import { Camera, Upload, Trash2, Heart, Share2, Image } from 'lucide-react'
import { useRecipes } from '../context/RecipeContext'

export default function Photos() {
  const { photos, addPhoto, deletePhoto, recipes } = useRecipes()
  const fileInputRef = useRef(null)
  const [selectedRecipe, setSelectedRecipe] = useState('')
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = () => {
    if (!preview) return
    addPhoto({
      image: preview,
      recipeId: selectedRecipe || null,
      caption,
      date: new Date().toISOString()
    })
    setPreview(null)
    setCaption('')
    setSelectedRecipe('')
  }

  const handleDelete = (id) => {
    if (confirm('¿Eliminar esta foto?')) {
      deletePhoto(id)
    }
  }

  const likedPhotos = photos.filter(p => p.liked)

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <h1 className="font-display text-2xl font-bold text-[var(--primary)] mb-6">📸 Mis Fotos</h1>

      {/* Upload Section */}
      <div className="glass p-4 rounded-3xl mb-6">
        <h2 className="font-semibold mb-3">Subir nueva foto</h2>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!preview ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-8 border-2 border-dashed border-[var(--primary)]/30 rounded-2xl flex flex-col items-center gap-2 text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
          >
            <Camera className="w-10 h-10" />
            <span>Toca para tomar o seleccionar foto</span>
          </button>
        ) : (
          <div className="space-y-3">
            <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
            <input
              type="text"
              placeholder="Agrega un caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="text-sm"
            />
            <select
              value={selectedRecipe}
              onChange={(e) => setSelectedRecipe(e.target.value)}
              className="text-sm"
            >
              <option value="">Sin receta relacionada</option>
              {recipes.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={() => setPreview(null)} className="flex-1 btn btn-secondary py-2">
                Cancelar
              </button>
              <button onClick={handleUpload} className="flex-1 btn btn-primary py-2">
                <Upload className="w-4 h-4" /> Subir
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Photo Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.image}
                alt={photo.caption || 'Foto'}
                className="w-full aspect-square object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-3">
                <button
                  onClick={() => addPhoto({ ...photo, liked: !photo.liked })}
                  className={`p-2 rounded-full ${photo.liked ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  <Heart className={`w-5 h-5 ${photo.liked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="p-2 rounded-full bg-red-500 text-white"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              {photo.caption && (
                <p className="text-xs mt-1 text-[var(--text-muted)]">{photo.caption}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--text-muted)]">
          <Image className="w-16 h-16 mx-auto mb-3 opacity-30" />
          <p>No tienes fotos aún</p>
          <p className="text-sm">¡Sube tu primera creación!</p>
        </div>
      )}
    </div>
  )
}
