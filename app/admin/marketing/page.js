'use client'
// ============================================================
// Marketing — /admin/marketing
// ============================================================
import { useState, useEffect } from 'react'

const C = {
  dark: '#2E2060',
  purple: '#534AB7',
  green: '#059669',
  amber: '#D97706',
}

const PRECIO = 25000
const COMISION = 10000

function formatCOP(n) {
  return `$${Math.round(n || 0).toLocaleString('es-CO')} COP`
}

// ── WhatsApp message templates ────────────────────────────────
const PLANTILLAS = {
  casual: (codigo, url) => `¡Hola! 😊 Si quieres descubrir tu propósito de vida, prueba IkigAI — es increíble. Yo lo hice y me cambió la perspectiva. ¡Cuesta solo $25.000 COP! Aquí el link con mi código de descuento: ${url}`,
  profesional: (codigo, url) => `Hola, te comparto una herramienta que ayuda a identificar tu Ikigai (propósito de vida) mediante inteligencia artificial. El reporte personalizado tiene un costo de $25.000 COP. Puedes acceder aquí: ${url}`,
  emocional: (codigo, url) => `¿Alguna vez te has preguntado cuál es tu verdadero propósito? 💜 IkigAI me ayudó a encontrar el mío y fue una experiencia profunda y transformadora. Por solo $25.000 COP puedes tener el tuyo. Te comparto mi enlace especial: ${url}`,
}

export default function MarketingPage() {
  const [data, setData]             = useState(null)
  const [loading, setLoading]       = useState(true)

  // ROI calculator
  const [nInfluencers, setNInfluencers]       = useState(5)
  const [seguidores, setSeguidores]           = useState(5000)
  const [tasaClic, setTasaClic]               = useState(1)
  const [tasaConversion, setTasaConversion]   = useState(2)

  // WhatsApp generator
  const [waCode, setWaCode]       = useState('')
  const [waTono, setWaTono]       = useState('casual')
  const [waMensaje, setWaMensaje] = useState('')
  const [waCopied, setWaCopied]   = useState(false)
  const [origin, setOrigin]       = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
    fetch(`/api/admin/stats?secret=${process.env.NEXT_PUBLIC_ADMIN_SECRET}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  // ROI calcs
  const clicksTotales    = Math.round(nInfluencers * seguidores * (tasaClic / 100))
  const ventasEstimadas  = Math.round(clicksTotales * (tasaConversion / 100))
  const ingresosBrutos   = ventasEstimadas * PRECIO
  const comisionesTotal  = ventasEstimadas * COMISION
  const ingresosNetos    = ingresosBrutos - comisionesTotal

  // WhatsApp
  function generarMensaje() {
    if (!waCode.trim()) return
    const url = `${origin}/ref/${waCode.trim().toUpperCase()}`
    setWaMensaje(PLANTILLAS[waTono](waCode.trim().toUpperCase(), url))
  }

  function copiarMensaje() {
    navigator.clipboard.writeText(waMensaje).then(() => {
      setWaCopied(true)
      setTimeout(() => setWaCopied(false), 2000)
    })
  }

  function abrirWhatsApp() {
    if (!waMensaje) return
    window.open(`https://wa.me/?text=${encodeURIComponent(waMensaje)}`, '_blank')
  }

  // Top performers
  const top3 = (data?.ranking || []).slice(0, 3)
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="p-6 max-w-4xl space-y-8">

      <div>
        <h1 className="text-2xl font-bold" style={{ color: C.dark }}>Marketing</h1>
        <p className="text-sm text-gray-400 mt-1">Herramientas para crecer con afiliados</p>
      </div>

      {/* ── A: Top performers ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-xs font-bold tracking-widest text-gray-400 mb-4">TOP AFILIADOS</p>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-14" />
            ))}
          </div>
        ) : top3.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">Aún no hay afiliados con ventas</p>
        ) : (
          <div className="space-y-3">
            {top3.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ backgroundColor: i === 0 ? '#FFFBEB' : '#F9FAFB' }}
              >
                <span className="text-2xl">{medals[i]}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-800">{a.nombre || a.codigo}</p>
                  <p className="font-mono text-xs text-gray-400">{a.codigo}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm" style={{ color: C.purple }}>{a.ventas} ventas</p>
                  <p className="text-xs text-amber-600 font-semibold">{formatCOP(a.ganado)}</p>
                </div>
              </div>
            ))}

            {top3[0] && (
              <div className="mt-4 p-3 rounded-xl border-2 border-dashed border-purple-200 text-center">
                <p className="text-xs text-gray-400">Código más activo del mes</p>
                <p className="font-mono font-bold text-xl mt-1" style={{ color: C.dark }}>
                  {top3[0].codigo}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── B: ROI Calculator ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-xs font-bold tracking-widest text-gray-400 mb-5">CALCULADORA DE ROI CON INFLUENCERS</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Inputs */}
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-600">Influencers</label>
                <span className="text-sm font-bold" style={{ color: C.purple }}>{nInfluencers}</span>
              </div>
              <input type="range" min={1} max={20} value={nInfluencers} onChange={e => setNInfluencers(+e.target.value)} className="w-full accent-purple-600" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-600">Seguidores promedio</label>
                <span className="text-sm font-bold" style={{ color: C.purple }}>{seguidores.toLocaleString('es-CO')}</span>
              </div>
              <input
                type="number"
                value={seguidores}
                onChange={e => setSeguidores(Math.max(100, +e.target.value))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-600">Tasa de clic</label>
                <span className="text-sm font-bold" style={{ color: C.purple }}>{tasaClic}%</span>
              </div>
              <input type="range" min={0.1} max={5} step={0.1} value={tasaClic} onChange={e => setTasaClic(+e.target.value)} className="w-full accent-purple-600" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-600">Tasa de conversión</label>
                <span className="text-sm font-bold" style={{ color: C.purple }}>{tasaConversion}%</span>
              </div>
              <input type="range" min={0.5} max={10} step={0.5} value={tasaConversion} onChange={e => setTasaConversion(+e.target.value)} className="w-full accent-purple-600" />
            </div>
          </div>

          {/* Results */}
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold tracking-widest text-gray-400 mb-3">PROYECCIÓN</p>
            {[
              { label: 'Clics estimados',   val: clicksTotales.toLocaleString('es-CO'),  color: '#6B7280' },
              { label: 'Ventas estimadas',   val: ventasEstimadas.toLocaleString('es-CO'), color: C.purple },
              { label: 'Ingresos brutos',    val: formatCOP(ingresosBrutos),               color: C.green },
              { label: 'Comisiones',         val: formatCOP(comisionesTotal),               color: C.amber },
              { label: 'Ingresos netos',     val: formatCOP(ingresosNetos),                 color: C.dark },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="font-bold text-sm" style={{ color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── C: WhatsApp message generator ─────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-xs font-bold tracking-widest text-gray-400 mb-5">GENERADOR DE MENSAJE WHATSAPP</p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Código de afiliado</label>
              <input
                type="text"
                placeholder="Ej: VALENTINA"
                value={waCode}
                onChange={e => setWaCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Tono</label>
              <div className="flex gap-2">
                {['casual', 'profesional', 'emocional'].map(t => (
                  <button
                    key={t}
                    onClick={() => setWaTono(t)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all capitalize"
                    style={{
                      backgroundColor: waTono === t ? C.purple : 'white',
                      borderColor: waTono === t ? C.purple : '#E5E7EB',
                      color: waTono === t ? 'white' : '#6B7280',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={generarMensaje}
            disabled={!waCode.trim()}
            className="px-5 py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-40"
            style={{ backgroundColor: C.purple }}
          >
            Generar mensaje
          </button>

          {waMensaje && (
            <div>
              <textarea
                readOnly
                value={waMensaje}
                rows={5}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none bg-gray-50"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={copiarMensaje}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all"
                  style={{
                    borderColor: waCopied ? C.green : '#E5E7EB',
                    color: waCopied ? C.green : '#6B7280',
                  }}
                >
                  {waCopied ? '✓ Copiado' : '📋 Copiar'}
                </button>
                <button
                  onClick={abrirWhatsApp}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: '#25D366' }}
                >
                  📱 Abrir en WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
