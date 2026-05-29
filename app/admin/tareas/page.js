'use client'
// ============================================================
// Tareas — /admin/tareas  (localStorage)
// ============================================================
import { useState, useEffect } from 'react'

const C = {
  dark: '#2E2060',
  purple: '#534AB7',
}

const PRIORIDADES = {
  alta:  { label: 'Alta',  emoji: '🔴', color: '#FEE2E2', text: '#991B1B' },
  media: { label: 'Media', emoji: '🟡', color: '#FEF3C7', text: '#92400E' },
  baja:  { label: 'Baja',  emoji: '🟢', color: '#D1FAE5', text: '#065F46' },
}

const PRIORIDAD_ORDER = { alta: 0, media: 1, baja: 2 }

const QUICK_CHIPS = [
  '📞 Llamar a influencer',
  '💸 Revisar pago',
  '📸 Publicar en Instagram',
  '📊 Revisar métricas',
]

const LS_KEY = 'ikigai_admin_tareas'

function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function PrioridadBadge({ p }) {
  const pr = PRIORIDADES[p]
  if (!pr) return null
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-bold"
      style={{ backgroundColor: pr.color, color: pr.text }}
    >
      {pr.emoji} {pr.label}
    </span>
  )
}

export default function TareasPage() {
  const [tareas, setTareas]       = useState([])
  const [loaded, setLoaded]       = useState(false)
  const [texto, setTexto]         = useState('')
  const [prioridad, setPrioridad] = useState('media')
  const [tab, setTab]             = useState('pendientes')

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setTareas(JSON.parse(raw))
    } catch {}
    setLoaded(true)
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(LS_KEY, JSON.stringify(tareas))
  }, [tareas, loaded])

  function agregar(textoTarea, pri = prioridad) {
    if (!textoTarea.trim()) return
    setTareas(prev => [{
      id: generarId(),
      texto: textoTarea.trim(),
      completada: false,
      prioridad: pri,
      creadaEn: new Date().toISOString(),
    }, ...prev])
    setTexto('')
  }

  function toggleCompletada(id) {
    setTareas(prev => prev.map(t => t.id === id ? { ...t, completada: !t.completada } : t))
  }

  function eliminar(id) {
    setTareas(prev => prev.filter(t => t.id !== id))
  }

  const pendientes   = tareas.filter(t => !t.completada).sort((a, b) => PRIORIDAD_ORDER[a.prioridad] - PRIORIDAD_ORDER[b.prioridad])
  const completadas  = tareas.filter(t => t.completada).sort((a, b) => new Date(b.creadaEn) - new Date(a.creadaEn))

  return (
    <div className="p-6 max-w-2xl">

      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: C.dark }}>Tareas</h1>
        <p className="text-sm text-gray-400 mt-1">Tu lista de pendientes del negocio</p>
      </div>

      {/* ── Add task ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <p className="text-xs font-bold tracking-widest text-gray-400 mb-3">NUEVA TAREA</p>

        <form
          onSubmit={e => { e.preventDefault(); agregar(texto) }}
          className="flex gap-2 mb-3"
        >
          <input
            type="text"
            placeholder="Escribe una tarea..."
            value={texto}
            onChange={e => setTexto(e.target.value)}
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
          />
          <select
            value={prioridad}
            onChange={e => setPrioridad(e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-white"
          >
            <option value="alta">🔴 Alta</option>
            <option value="media">🟡 Media</option>
            <option value="baja">🟢 Baja</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl text-white font-bold text-sm whitespace-nowrap"
            style={{ backgroundColor: C.purple }}
          >
            Agregar
          </button>
        </form>

        {/* Quick chips */}
        <div className="flex flex-wrap gap-2">
          {QUICK_CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => agregar(chip)}
              className="text-xs px-3 py-1.5 rounded-full border-2 border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors"
            >
              + {chip}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────── */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'pendientes', label: `Pendientes (${pendientes.length})` },
          { id: 'completadas', label: `Completadas (${completadas.length})` },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all"
            style={{
              backgroundColor: tab === t.id ? C.purple : 'white',
              borderColor: tab === t.id ? C.purple : '#E5E7EB',
              color: tab === t.id ? 'white' : '#6B7280',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Task list ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {tab === 'pendientes' && (
          pendientes.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl mb-3">🎉</p>
              <p className="text-gray-500 font-semibold">Todo listo</p>
              <p className="text-gray-300 text-sm mt-1">No hay tareas pendientes</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {pendientes.map(t => (
                <div key={t.id} className="flex items-center gap-3 px-5 py-4">
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => toggleCompletada(t.id)}
                    className="w-4 h-4 rounded cursor-pointer accent-purple-600 flex-shrink-0"
                  />
                  <p className="flex-1 text-sm text-gray-700">{t.texto}</p>
                  <PrioridadBadge p={t.prioridad} />
                  <button
                    onClick={() => eliminar(t.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'completadas' && (
          completadas.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-400 text-sm">No hay tareas completadas aún</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {completadas.map(t => (
                <div key={t.id} className="flex items-center gap-3 px-5 py-4">
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => toggleCompletada(t.id)}
                    className="w-4 h-4 rounded cursor-pointer accent-purple-600 flex-shrink-0"
                  />
                  <p className="flex-1 text-sm text-gray-400 line-through">{t.texto}</p>
                  <PrioridadBadge p={t.prioridad} />
                  <button
                    onClick={() => eliminar(t.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
