import { useState } from 'react'
import { Users, UserPlus, Search, MessageCircle, Send, Crown } from 'lucide-react'

const MOCK_FRIENDS = [
  { id: '1', name: 'María García', avatar: '👩‍🍳', status: 'online', recipes: 45 },
  { id: '2', name: 'Carlos López', avatar: '👨‍🍳', status: 'online', recipes: 32 },
  { id: '3', name: 'Ana Martínez', avatar: '👩', status: 'offline', recipes: 28 },
  { id: '4', name: 'Pedro Sánchez', avatar: '👨', status: 'online', recipes: 56 },
]

export default function Friends() {
  const [friends, setFriends] = useState(MOCK_FRIENDS)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [newFriendEmail, setNewFriendEmail] = useState('')
  const [activeTab, setActiveTab] = useState('friends')
  const [messages, setMessages] = useState({})

  const filteredFriends = friends.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddFriend = () => {
    if (!newFriendEmail) return
    const newFriend = {
      id: Date.now().toString(),
      name: newFriendEmail.split('@')[0] || 'Nuevo Amigo',
      avatar: '👤',
      status: 'offline',
      recipes: 0
    }
    setFriends([...friends, newFriend])
    setNewFriendEmail('')
    setShowAddFriend(false)
  }

  const handleSendMessage = (friendId, message) => {
    setMessages(prev => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), { from: 'me', text: message, time: new Date().toISOString() }]
    }))
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <h1 className="font-display text-2xl font-bold text-[var(--primary)] mb-6">👥 Amigos</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2 rounded-xl font-medium ${
            activeTab === 'friends' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--accent)]'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Mis Amigos
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-2 rounded-xl font-medium ${
            activeTab === 'requests' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--accent)]'
          }`}
        >
          <UserPlus className="w-4 h-4 inline mr-2" />
          Solicitudes
        </button>
      </div>

      {activeTab === 'friends' && (
        <>
          {/* Search & Add */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Buscar amigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <button
              onClick={() => setShowAddFriend(true)}
              className="btn btn-primary px-4"
            >
              <UserPlus className="w-5 h-5" />
            </button>
          </div>

          {/* Add Friend Modal */}
          {showAddFriend && (
            <div className="glass p-4 rounded-3xl mb-4">
              <h3 className="font-semibold mb-3">Añadir Amigo</h3>
              <input
                type="email"
                placeholder="Email del amigo..."
                value={newFriendEmail}
                onChange={(e) => setNewFriendEmail(e.target.value)}
                className="mb-3"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowAddFriend(false)} className="flex-1 btn btn-secondary py-2">
                  Cancelar
                </button>
                <button onClick={handleAddFriend} className="flex-1 btn btn-primary py-2">
                  Enviar Solicitud
                </button>
              </div>
            </div>
          )}

          {/* Friends List */}
          <div className="space-y-3">
            {filteredFriends.map(friend => (
              <div key={friend.id} className="glass p-4 rounded-2xl flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-2xl">
                    {friend.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--surface)] ${
                    friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{friend.name}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{friend.recipes} recetas • {
                    friend.status === 'online' ? 'En línea' : 'Desconectado'
                  }</p>
                </div>
                <button className="p-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {filteredFriends.length === 0 && (
            <div className="text-center py-12 text-[var(--text-muted)]">
              <Users className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p>No tienes amigos aún</p>
              <p className="text-sm">¡Invita a otros cocineros!</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'requests' && (
        <div className="text-center py-12 text-[var(--text-muted)]">
          <UserPlus className="w-16 h-16 mx-auto mb-3 opacity-30" />
          <p>No hay solicitudes pendientes</p>
          <p className="text-sm">Las solicitudes de amigos aparecerán aquí</p>
        </div>
      )}
    </div>
  )
}
