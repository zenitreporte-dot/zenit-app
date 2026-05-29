'use client'
// ============================================================
// Compradores — /admin/compradores
// ============================================================
import { useState, useEffect } from 'react'

function Skeleton() {
  return (
    <div className="divide-y divide-zenit-navy">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="animate-pulse bg-zenit-navy rounded h-3 w-32" />
            <div className="animate-pulse bg-zenit-navy rounded h-3 w-48" />
          </div>
          <div className="animate-pulse bg-zenit-navy rounded h-3 w-20" />
        </div>
      ))}
    </div>
  )
}

function FechaCorta({ iso }) {
  return (
    <span className="text-xs text-zenit-cream/30">
      {new Date(iso).toLocaleString('es-CO', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })}
    </span>
  )
}

export default function CompradoresPage() {
  const [data, setData]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [soloRef, setSoloRef]       = useState(false)
  const [confirmando, setConfirmando] = useState(null)
  const [refInput, setRefInput]     = useState({})
  const [msg, setMsg]               = useState({})

  function cargar() {
    setLoading(true)
    fetch(`/api/admin/stats?secret=${process.env.NEXT_PUBLIC_ADMIN_SECRET}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const compradores = data?.compradores || []
  const pendientes  = data?.pagosPendientes || []

  const filtrados = compradores.filter(s => {
    if (soloRef && !s.referred_by) return false
    if (search && !s.id?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  async function confirmarPago(sessionId) {
    setConfirmando(sessionId)
    setMsg(m => ({ ...m, [sessionId]: null }))
    try {
      const res = await fetch('/api/admin/confirmar-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.NEXT_PUBLIC_ADMIN_SECRET,
          session_id: sessionId,
          referred_by: refInput[sessionId] || undefined,
        }),
      })
      const d = await res.json()
      setMsg(m => ({ ...m, [sessionId]: d.ok ? `✓ ${d.msg}` : `✗ ${d.error}` }))
      if (d.ok) setTimeout(cargar, 1000)
    } catch {
      setMsg(m => ({ ...m, [sessionId]: '✗ Error de conexión' }))
    } finally {
      setConfirmando(null)
    }
  }

  return (
    <div className="p-6 max-w-5xl">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zenit-amber">Compradores</h1>
          <p className="text-sm text-zenit-cream/30 mt-1">
            {loading ? '...' : `${compradores.length} compras confirmadas`}
          </p>
        </div>
      </div>

      {/* ── Pagos sin confirmar (webhook falló) ─────────────── */}
      {!loading && pendientes.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest text-red-400/70 mb-3">
            ⚠ PAGOS SIN CONFIRMAR ({pendientes.length}) — webhook no procesado
          </p>
          <div className="bg-zenit-navy-mid rounded-2xl border border-red-500/20 overflow-hidden">
            <div className="divide-y divide-zenit-navy">
              {pendientes.map((s) => (
                <div key={s.id} className="px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                    <div>
                      <p className="font-mono text-sm text-zenit-cream font-bold">{s.id?.slice(0, 8)}...</p>
                      <p className="text-xs text-zenit-cream/30 mt-0.5 font-mono">{s.id}</p>
                      <FechaCorta iso={s.created_at} />
                      {s.referred_by && (
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-zenit-amber/10 text-zenit-amber font-bold">
                          {s.referred_by}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      {!s.referred_by && (
                        <input
                          type="text"
                          placeholder="Código afiliado (opcional)"
                          value={refInput[s.id] || ''}
                          onChange={e => setRefInput(r => ({ ...r, [s.id]: e.target.value.toUpperCase() }))}
                          className="bg-zenit-navy border border-zenit-navy-mid rounded-lg px-3 py-1.5 text-xs font-mono text-zenit-cream placeholder-zenit-cream/20 focus:outline-none focus:border-zenit-amber/40 w-48"
                        />
                      )}
                      <button
                        onClick={() => confirmarPago(s.id)}
                        disabled={confirmando === s.id}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
                      >
                        {confirmando === s.id ? 'Confirmando...' : 'Confirmar pago manualmente'}
                      </button>
                      {msg[s.id] && (
                        <p className={`text-xs ${msg[s.id].startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
                          {msg[s.id]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Filtros ─────────────────────────────────────────── */}
      <p className="text-xs font-bold tracking-widest text-zenit-cream/30 mb-3">COMPRAS CONFIRMADAS</p>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Buscar por session ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-zenit-navy-mid border border-zenit-navy rounded-xl px-4 py-2.5 text-sm text-zenit-cream placeholder-zenit-cream/20 focus:outline-none focus:border-zenit-amber/40"
        />
        <button
          onClick={() => setSoloRef(!soloRef)}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all whitespace-nowrap"
          style={{
            backgroundColor: soloRef ? 'rgba(201,168,76,0.15)' : 'transparent',
            borderColor: soloRef ? '#c9a84c' : 'rgba(201,168,76,0.2)',
            color: soloRef ? '#c9a84c' : 'rgba(245,240,232,0.3)',
          }}
        >
          Solo referidos
        </button>
      </div>

      {/* ── Tabla compradores ───────────────────────────────── */}
      <div className="bg-zenit-navy-mid rounded-2xl border border-zenit-amber/10 overflow-hidden">
        <div className="px-6 py-3 border-b border-zenit-navy hidden sm:grid grid-cols-4 text-xs font-bold tracking-widest text-zenit-cream/20">
          <span>SESIÓN</span>
          <span>FECHA</span>
          <span>REFERIDO POR</span>
          <span className="text-right">ACCIÓN</span>
        </div>

        {loading ? (
          <Skeleton />
        ) : filtrados.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-zenit-amber/30 text-4xl mb-3">—</p>
            <p className="text-zenit-cream/30 text-sm">
              {search || soloRef ? 'Sin resultados para ese filtro' : 'Aún no hay compradores'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zenit-navy">
            {filtrados.map((s, i) => (
              <div key={i} className="px-6 py-4 grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                <p className="font-mono text-sm text-zenit-cream font-bold">
                  {s.id?.slice(0, 8)}...
                </p>
                <FechaCorta iso={s.created_at} />
                <div>
                  {s.referred_by ? (
                    <span className="inline-block text-xs px-2.5 py-1 rounded-full font-bold bg-zenit-amber/10 text-zenit-amber">
                      {s.referred_by}
                    </span>
                  ) : (
                    <span className="inline-block text-xs px-2.5 py-1 rounded-full font-semibold bg-zenit-navy text-zenit-cream/30">
                      Orgánico
                    </span>
                  )}
                </div>
                <div className="sm:text-right">
                  <a
                    href={`/reporte/${s.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-zenit-amber hover:underline"
                  >
                    Ver reporte →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && filtrados.length > 0 && (
        <p className="text-xs text-zenit-cream/20 mt-3 text-right">
          Mostrando {filtrados.length} de {compradores.length}
        </p>
      )}
    </div>
  )
}
