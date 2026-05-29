'use client'
// ============================================================
// Retiros — /admin/retiros
// ============================================================
import { useState, useEffect } from 'react'

function formatCOP(n) {
  return `$${(n || 0).toLocaleString('es-CO')} COP`
}

function StatusBadge({ status }) {
  const map = {
    paid:     { label: 'Pagado',    bg: 'rgba(52,211,153,0.1)',  color: '#34D399' },
    rejected: { label: 'Rechazado', bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' },
    pending:  { label: 'Pendiente', bg: 'rgba(201,168,76,0.1)',  color: '#c9a84c' },
  }
  const s = map[status] || map.pending
  return (
    <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

export default function RetirosPage() {
  const [data, setData]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [procesando, setProcesando] = useState(null)
  const [histOpen, setHistOpen]     = useState(false)

  function cargar() {
    setLoading(true)
    fetch(`/api/admin/stats?secret=${process.env.NEXT_PUBLIC_ADMIN_SECRET}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  async function procesarRetiro(id, accion) {
    setProcesando(id)
    try {
      await fetch('/api/admin/retiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_ADMIN_SECRET, retiro_id: id, accion }),
      })
      cargar()
    } finally {
      setProcesando(null)
    }
  }

  const pendientes = data?.retiros?.filter(r => r.status === 'pending') || []
  const historial  = data?.retiros?.filter(r => r.status !== 'pending') || []

  return (
    <div className="p-6 max-w-4xl">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zenit-amber">Retiros</h1>
        <p className="text-sm text-zenit-cream/30 mt-1">Gestión de solicitudes de pago a afiliados</p>
      </div>

      {/* ── Pendientes ────────────────────────────────────── */}
      <p className="text-xs font-bold tracking-widest text-zenit-cream/30 mb-3">
        PENDIENTES {!loading && `(${pendientes.length})`}
      </p>

      {loading ? (
        <div className="space-y-4 mb-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-zenit-navy-mid rounded-2xl border border-zenit-amber/10 p-5">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-zenit-navy rounded w-32" />
                <div className="h-8 bg-zenit-navy rounded w-40" />
                <div className="h-3 bg-zenit-navy rounded w-64" />
              </div>
            </div>
          ))}
        </div>
      ) : pendientes.length === 0 ? (
        <div className="bg-zenit-navy-mid rounded-2xl border border-zenit-amber/10 p-12 text-center mb-8">
          <p className="font-serif text-zenit-amber/30 text-4xl mb-3">—</p>
          <p className="text-zenit-cream/40 text-sm font-medium">No hay retiros pendientes</p>
          <p className="text-zenit-cream/20 text-xs mt-1">Estás al día con los pagos</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {pendientes.map(r => (
            <div key={r.id} className="bg-zenit-navy-mid rounded-2xl border border-zenit-amber/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono font-bold text-sm text-zenit-amber">{r.affiliate_codigo}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-3xl font-bold mb-2 text-zenit-amber">{formatCOP(r.amount)}</p>
                  <p className="text-sm text-zenit-cream/60 capitalize mb-1">
                    <span className="font-semibold">{r.metodo}</span> → {r.datos_pago}
                  </p>
                  <p className="text-xs text-zenit-cream/30">
                    {new Date(r.created_at).toLocaleString('es-CO', {
                      day: 'numeric', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => procesarRetiro(r.id, 'paid')}
                    disabled={procesando === r.id}
                    className="px-4 py-2.5 rounded-xl text-zenit-navy text-sm font-bold bg-zenit-amber disabled:opacity-50 hover:opacity-90 transition-opacity"
                  >
                    {procesando === r.id ? '...' : '✓ Ya pagué'}
                  </button>
                  <button
                    onClick={() => procesarRetiro(r.id, 'rejected')}
                    disabled={procesando === r.id}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Historial (accordion) ─────────────────────────── */}
      <button
        onClick={() => setHistOpen(!histOpen)}
        className="w-full text-left px-5 py-4 bg-zenit-navy-mid rounded-2xl border border-zenit-amber/10 flex items-center justify-between"
      >
        <p className="text-xs font-bold tracking-widest text-zenit-cream/30">
          HISTORIAL {!loading && `(${historial.length})`}
        </p>
        <span className="text-zenit-cream/30 text-sm">{histOpen ? '▲' : '▼'}</span>
      </button>

      {histOpen && (
        <div className="bg-zenit-navy-mid rounded-2xl border border-zenit-amber/10 mt-1 overflow-hidden">
          {historial.length === 0 ? (
            <div className="p-8 text-center text-zenit-cream/30 text-sm">No hay historial aún</div>
          ) : (
            <div className="divide-y divide-zenit-navy">
              {historial.map(r => (
                <div key={r.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono font-bold text-sm text-zenit-amber">{r.affiliate_codigo}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-xs text-zenit-cream/40 capitalize">{r.metodo} → {r.datos_pago}</p>
                    <p className="text-xs text-zenit-cream/30 mt-0.5">
                      {new Date(r.created_at).toLocaleString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <p className="font-bold text-sm text-zenit-amber whitespace-nowrap">{formatCOP(r.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
