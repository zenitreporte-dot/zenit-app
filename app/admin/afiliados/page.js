'use client'
import { useState, useEffect } from 'react'

function formatCOP(n) {
  return `$${(n || 0).toLocaleString('es-CO')}`
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={copy}
      className="text-xs px-2.5 py-1 rounded-lg border transition-all"
      style={{
        borderColor: copied ? '#34D399' : 'rgba(201,168,76,0.2)',
        color: copied ? '#34D399' : 'rgba(245,240,232,0.3)',
      }}
    >
      {copied ? '✓ Copiado' : 'Copiar'}
    </button>
  )
}

function SkeletonRow() {
  return (
    <div className="px-6 py-4 grid grid-cols-5 gap-4 items-center">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse bg-zenit-navy rounded h-3" />
      ))}
    </div>
  )
}

export default function AfiliadosPage() {
  const [data, setData]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [form, setForm]           = useState({ nombre: '', email: '', codigo: '' })
  const [creando, setCreando]     = useState(false)
  const [resultado, setResultado] = useState(null)
  const [origin, setOrigin]       = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
    cargar()
  }, [])

  function cargar() {
    setLoading(true)
    fetch(`/api/admin/afiliados-lista?secret=${process.env.NEXT_PUBLIC_ADMIN_SECRET}`)
      .then(r => r.json())
      .then(d => setData(d.afiliados || []))
      .finally(() => setLoading(false))
  }

  async function crearAfiliado(e) {
    e.preventDefault()
    setCreando(true)
    setResultado(null)
    try {
      const res = await fetch('/api/admin/crear-afiliado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.NEXT_PUBLIC_ADMIN_SECRET,
          nombre: form.nombre,
          email: form.email,
          codigo: form.codigo || undefined,
        }),
      })
      const d = await res.json()
      setResultado(d)
      if (d.ok) { setForm({ nombre: '', email: '', codigo: '' }); cargar() }
    } catch {
      setResultado({ error: 'Error de conexión' })
    } finally {
      setCreando(false)
    }
  }

  const afiliados = data || []

  return (
    <div className="p-6 max-w-5xl">

      <div className="mb-6">
        <h1 className="font-serif text-2xl text-zenit-cream">Afiliados</h1>
        <p className="text-sm text-zenit-cream/30 mt-1">Gestiona influencers y compradores afiliados</p>
      </div>

      {/* Crear afiliado */}
      <div className="bg-zenit-navy-mid rounded-2xl border border-zenit-amber/10 p-6 mb-6">
        <p className="text-xs font-bold tracking-widest text-zenit-cream/30 mb-4">CREAR AFILIADO INFLUENCER</p>
        <form onSubmit={crearAfiliado} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              className="bg-zenit-navy border border-zenit-navy-mid rounded-xl px-4 py-2.5 text-sm text-zenit-cream placeholder-zenit-cream/20 focus:outline-none focus:border-zenit-amber/40"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="bg-zenit-navy border border-zenit-navy-mid rounded-xl px-4 py-2.5 text-sm text-zenit-cream placeholder-zenit-cream/20 focus:outline-none focus:border-zenit-amber/40"
              required
            />
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Código personalizado (ej: VALENTINA) — opcional"
              value={form.codigo}
              onChange={e => setForm(f => ({ ...f, codigo: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) }))}
              className="flex-1 bg-zenit-navy border border-zenit-navy-mid rounded-xl px-4 py-2.5 text-sm font-mono text-zenit-cream placeholder-zenit-cream/20 focus:outline-none focus:border-zenit-amber/40"
            />
            <button
              type="submit"
              disabled={creando}
              className="px-5 py-2.5 rounded-xl text-zenit-navy font-bold text-sm disabled:opacity-60 bg-zenit-amber whitespace-nowrap"
            >
              {creando ? '...' : '+ Crear'}
            </button>
          </div>

          {resultado?.ok && (
            <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-xl text-sm text-green-400 flex items-center justify-between flex-wrap gap-2">
              <span>Código <strong className="font-mono">{resultado.codigo}</strong> creado —{' '}
                <a href={`/afiliados/${resultado.codigo}`} target="_blank" rel="noopener noreferrer" className="underline">Ver panel →</a>
              </span>
              <CopyButton text={`${origin}/ref/${resultado.codigo}`} />
            </div>
          )}
          {resultado?.error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-sm text-red-400">
              {resultado.error}
            </div>
          )}
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-zenit-navy-mid rounded-2xl border border-zenit-amber/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-zenit-amber/10 flex items-center justify-between">
          <p className="text-xs font-bold tracking-widest text-zenit-cream/30">TODOS LOS AFILIADOS</p>
          <p className="text-xs text-zenit-cream/20">{afiliados.length} total</p>
        </div>

        <div className="px-6 py-3 border-b border-zenit-navy hidden md:grid grid-cols-6 text-xs font-bold tracking-widest text-zenit-cream/20">
          <span className="col-span-2">AFILIADO</span>
          <span>CÓDIGO</span>
          <span className="text-center">VENTAS</span>
          <span className="text-right">GANADO</span>
          <span className="text-right">DISPONIBLE</span>
        </div>

        {loading ? (
          <div className="divide-y divide-zenit-navy">
            {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : afiliados.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-zenit-amber/30 text-4xl mb-3">—</p>
            <p className="text-zenit-cream/30 text-sm">Aún no hay afiliados</p>
          </div>
        ) : (
          <div className="divide-y divide-zenit-navy">
            {afiliados.map((a, i) => (
              <div key={i} className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">

                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-zenit-cream">
                        {a.nombre || a.codigo}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: a.session_id ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.05)',
                          color: a.session_id ? '#c9a84c' : 'rgba(245,240,232,0.3)',
                        }}
                      >
                        {a.session_id ? 'Comprador' : 'Influencer'}
                      </span>
                    </div>
                    {a.email && <p className="text-xs text-zenit-cream/30">{a.email}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/afiliados/${a.codigo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-bold text-sm text-zenit-amber hover:underline"
                    >
                      {a.codigo}
                    </a>
                    <CopyButton text={`${origin}/ref/${a.codigo}`} />
                  </div>

                  <p className="text-center font-bold text-zenit-cream">{a.ventas}</p>
                  <p className="text-right font-semibold text-zenit-amber">{formatCOP(a.ganado)} COP</p>
                  <p className="text-right font-semibold text-green-400">{formatCOP(a.disponible)} COP</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
