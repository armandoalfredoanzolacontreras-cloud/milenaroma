import { useState } from 'react'
import { ArrowLeft, Copy, Check } from 'lucide-react'

const conversions = [
  { celsius: 150, fahrenheit: 300, desc: 'Bajo' },
  { celsius: 180, fahrenheit: 350, desc: 'Medio' },
  { celsius: 200, fahrenheit: 400, desc: 'Alto' },
  { celsius: 220, fahrenheit: 425, desc: 'Muy Alto' },
]

export default function Calculator() {
  const [tab, setTab] = useState('temp')

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-10 glass mx-4 mt-4 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => window.history.back()} className="text-[var(--primary)]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-semibold text-[var(--primary)]">Calculadora</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('temp')} className={`px-4 py-2 rounded-full text-sm ${tab === 'temp' ? 'bg-[var(--primary)] text-white' : 'glass'}`}>🌡️ Temp</button>
          <button onClick={() => setTab('vol')} className={`px-4 py-2 rounded-full text-sm ${tab === 'vol' ? 'bg-[var(--primary)] text-white' : 'glass'}`}>🥛 Vol</button>
          <button onClick={() => setTab('peso')} className={`px-4 py-2 rounded-full text-sm ${tab === 'peso' ? 'bg-[var(--primary)] text-white' : 'glass'}`}>⚖️ Peso</button>
        </div>
      </div>

      <div className="px-4 py-4">
        {tab === 'temp' && (
          <div className="space-y-2">
            <h3 className="font-semibold mb-3">Temperaturas del Horno</h3>
            {conversions.map((c, i) => (
              <div key={i} className="glass p-4 flex justify-between items-center rounded-xl">
                <div>
                  <span className="font-bold text-[var(--primary)]">{c.celsius}°C</span>
                  <span className="text-[var(--text-muted)] mx-2">=</span>
                  <span className="font-bold text-[var(--secondary)]">{c.fahrenheit}°F</span>
                </div>
                <span className="text-sm text-[var(--text-muted)]">{c.desc}</span>
              </div>
            ))}
            <div className="glass p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <p className="text-sm text-amber-700 dark:text-amber-300">💡 Tip: Siempre precalienta el horno 10-15 min antes.</p>
            </div>
          </div>
        )}

        {tab === 'vol' && (
          <div className="space-y-2">
            <h3 className="font-semibold mb-3">Conversiones de Volumen</h3>
            {[
              { from: '1 taza', to: '240 ml' },
              { from: '1 cdda', to: '15 ml' },
              { from: '1 cdta', to: '5 ml' },
              { from: '1 oz', to: '30 ml' },
            ].map((v, i) => (
              <div key={i} className="glass p-4 rounded-xl">
                <span className="font-semibold">{v.from}</span>
                <span className="text-[var(--text-muted)] mx-3">=</span>
                <span>{v.to}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'peso' && (
          <div className="space-y-2">
            <h3 className="font-semibold mb-3">Conversiones de Peso</h3>
            {[
              { from: '1 oz', to: '28 g' },
              { from: '1 lb', to: '454 g' },
              { from: '100 g', to: '3.5 oz' },
              { from: '1 kg', to: '2.2 lb' },
            ].map((v, i) => (
              <div key={i} className="glass p-4 rounded-xl">
                <span className="font-semibold">{v.from}</span>
                <span className="text-[var(--text-muted)] mx-3">=</span>
                <span>{v.to}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
