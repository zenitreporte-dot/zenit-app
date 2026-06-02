'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ZenitIcon } from '@/components/LogoZenit'

const METODOS_PAGO = [
  { value: 'nequi', label: 'Nequi', placeholder: '3XX XXX XXXX' },
  { value: 'breb', label: 'Bre-B', placeholder: 'Tu llave Bre-B (celular, cédula o email)' },
  { value: 'daviplata', label: 'Daviplata', placeholder: '3XX XXX XXXX' },
  { value: 'bancolombia', label: 'Bancolombia', placeholder: 'Número de cuenta' },
]

export default function PanelAfiliado() {
  const { codigo } = useParams()
  const router = useRouter()

  const [cargando, setCargando] = useState(true)
  const [error404, setError404] = useState(false)
  const [data, setData] = useState(null)
  const [copiado, setCopiado] = useState(false)

  const [modalRetiro, setModalRetiro] = useState(false)
  const [metodo, setMetodo] = useState('nequi')
  const [datosPago, setDatosPago] = useState('')
  const [tipoCuenta, setTipoCuenta] = useState('ahorros')
  const [nombreRetiro, setNombreRetiro] = useState('')
  const [cedulaRetiro, setCedulaRetiro] = useState('')
  const [emailRetiro, setEmailRetiro] = useState('')
  const [enviandoRetiro, setEnviandoRetiro] = useState(false)
  const [errorRetiro, setErrorRetiro] = useState('')
  const [exitoRetiro, setExitoRetiro] = useState(false)

  const codigoUpper = codigo?.toUpperCase()
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://zenit.app'
  const linkAfiliado = `${baseUrl}/ref/${codigoUpper}`

  useEffect(() => {
    if (!codigoUpper) return

    // Verificar sesión primero
    fetch(`/api/afiliados/verificar-sesion?codigo=${codigoUpper}`)
      .then(r => r.json())
      .then(sesion => {
        if (!sesion.autorizado) {
          setCargando(false)
          if (sesion.razon === 'codigo_diferente' && sesion.propiocodigo) {
            router.replace(`/afiliados/${sesion.propiocodigo}`)
            return
          }
          router.replace(`/afiliados/login`)
          return
        }
        // Sesión válida — cargar datos
        fetch(`/api/afiliados/por-codigo?codigo=${codigoUpper}`)
          .then(r => r.json())
          .then(d => {
            if (d.error) { setError404(true); return }
            setData(d)
          })
          .catch(() => setError404(true))
          .finally(() => setCargando(false))
      })
      .catch(() => { setCargando(false); router.replace('/afiliados/login') })
  }, [codigoUpper])

  function copiarLink() {
    navigator.clipboard.writeText(linkAfiliado)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  async function solicitarRetiro(e) {
    e.preventDefault()
    if (!nombreRetiro.trim()) { setErrorRetiro('Ingresa tu nombre completo'); return }
    if (!cedulaRetiro.trim()) { setErrorRetiro('Ingresa tu número de cédula'); return }
    if (!emailRetiro.trim()) { setErrorRetiro('Ingresa tu correo para el comprobante'); return }
    if (!datosPago.trim()) { setErrorRetiro('Ingresa tu número o cuenta de pago'); return }
    setEnviandoRetiro(true)
    setErrorRetiro('')
    const tipoCuentaInfo = metodo === 'bancolombia' ? ` | Tipo: ${tipoCuenta}` : ''
    const datosPagoCompleto = `${datosPago.trim()}${tipoCuentaInfo} | Nombre: ${nombreRetiro.trim()} | Cédula: ${cedulaRetiro.trim()} | Email: ${emailRetiro.trim()}`
    try {
      const res = await fetch('/api/afiliados/retiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigoUpper, metodo, datos_pago: datosPagoCompleto }),
      })
      const result = await res.json()
      if (result.error) { setErrorRetiro(result.error); return }
      setExitoRetiro(true)
      const r2 = await fetch(`/api/afiliados/por-codigo?codigo=${codigoUpper}`)
      const d2 = await r2.json()
      if (!d2.error) setData(d2)
    } catch {
      setErrorRetiro('Error de conexión. Intenta de nuevo.')
    } finally {
      setEnviandoRetiro(false)
    }
  }

  function formatCOP(n) {
    return `$${(n || 0).toLocaleString('es-CO')} COP`
  }
  function formatFecha(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  function badgeRetiro(status) {
    const map = {
      pending: { label: 'Pendiente', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
      paid: { label: 'Pagado ✓', color: '#34D399', bg: 'rgba(52,211,153,0.15)' },
      rejected: { label: 'Rechazado', color: '#F87171', bg: 'rgba(248,113,113,0.15)' },
    }
    const s = map[status] || map.pending
    return (
      <span style={{ color: s.color, backgroundColor: s.bg }}
        className="text-xs font-semibold px-2 py-0.5 rounded-full">
        {s.label}
      </span>
    )
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zenit-navy">
        <div className="w-10 h-10 border-4 border-zenit-amber border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error404) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-zenit-navy">
        <div className="bg-zenit-navy-mid rounded-3xl p-8 max-w-sm w-full text-center border border-zenit-amber/10">
          <div className="w-12 h-12 rounded-full bg-zenit-navy border border-zenit-amber/20 flex items-center justify-center mx-auto mb-4">
            <span className="font-serif text-zenit-amber/40 text-sm">?</span>
          </div>
          <h1 className="font-serif text-xl text-zenit-cream mb-2">Código no encontrado</h1>
          <p className="text-zenit-cream/50 text-sm mb-6">El código <strong className="text-zenit-cream">{codigoUpper}</strong> no existe en nuestro sistema.</p>
          <a href="/afiliados/unirse"
            className="inline-block px-6 py-3 rounded-full text-zenit-navy font-bold text-sm bg-zenit-amber">
            Unirse al programa
          </a>
        </div>
      </div>
    )
  }

  const { afiliado, stats, retiros } = data
  const tieneRetiroPendiente = retiros?.some(r => r.status === 'pending')

  return (
    <div className="min-h-screen py-10 px-4 bg-zenit-navy">
      <div className="max-w-lg mx-auto space-y-5">

        {/* Header */}
        <div className="text-center mb-2">
          <div className="flex justify-center items-center gap-2 mb-3">
            <ZenitIcon size={28} />
            <span className="font-sans font-bold text-xl tracking-wide text-zenit-amber">zenit</span>
          </div>
          <p className="text-sm font-semibold text-zenit-amber/70">Programa de Afiliados</p>
          <h1 className="font-serif text-2xl text-zenit-cream mt-1">
            Hola, {afiliado.nombre?.split(' ')[0] || 'Afiliado'}
          </h1>
          <p className="text-xs text-zenit-cream/30 mt-0.5">Miembro desde {formatFecha(afiliado.miembro_desde)}</p>
        </div>

        {/* Tu link */}
        <div className="bg-zenit-navy-mid rounded-3xl p-5 border border-zenit-amber/10">
          <p className="text-xs font-semibold text-zenit-cream/40 uppercase tracking-wide mb-3">Tu link de referido</p>
          <div className="bg-zenit-navy rounded-2xl px-4 py-3 mb-3 border border-zenit-amber/10">
            <p className="font-mono text-sm font-bold break-all text-zenit-amber">{linkAfiliado}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copiarLink}
              className="flex-1 py-2.5 rounded-full font-semibold text-sm transition-all"
              style={{
                backgroundColor: copiado ? '#34D399' : '#c9a84c',
                color: '#1a1b2e'
              }}>
              {copiado ? '✓ Copiado' : 'Copiar link'}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Descubre tu propósito de vida con Zenit\n${linkAfiliado}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-full font-semibold text-sm border-2 text-zenit-amber"
              style={{ borderColor: '#c9a84c' }}>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Clics', value: stats.clicks },
            { label: 'Ventas', value: stats.ventas },
            { label: 'Conversión', value: stats.clicks > 0 ? `${Math.round(stats.ventas / stats.clicks * 100)}%` : '—' },
          ].map(s => (
            <div key={s.label} className="bg-zenit-navy-mid rounded-2xl p-4 text-center border border-zenit-amber/10">
              <p className="font-serif text-2xl text-zenit-cream">{s.value}</p>
              <p className="text-xs text-zenit-cream/30">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Wallet */}
        <div className="bg-zenit-navy-mid rounded-3xl p-5 border border-zenit-amber/10">
          <p className="text-xs font-semibold text-zenit-cream/40 uppercase tracking-wide mb-4">Tu billetera</p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-zenit-cream/50">Total ganado</span>
            <span className="font-semibold text-zenit-cream">{formatCOP(stats.ganado)}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-zenit-cream/50">Disponible para retirar</span>
            <span className="font-serif text-xl text-zenit-amber">{formatCOP(stats.disponible)}</span>
          </div>

          {stats.disponible >= 50000 ? (
            tieneRetiroPendiente ? (
              <div className="p-3 bg-amber-900/20 border border-amber-500/30 rounded-xl text-amber-400 text-sm text-center">
                ⏳ Tienes una solicitud de retiro en revisión
              </div>
            ) : (
              <button
                onClick={() => { setModalRetiro(true); setExitoRetiro(false); setErrorRetiro('') }}
                className="w-full py-3 rounded-full text-zenit-navy font-bold bg-zenit-amber">
                Solicitar retiro
              </button>
            )
          ) : (
            <div className="p-3 bg-zenit-navy border border-zenit-navy-mid rounded-xl text-zenit-cream/40 text-sm text-center">
              Mínimo $50.000 COP para retirar (5 ventas)
              {stats.ganado > 0 && stats.disponible === 0 && ' · Retiro en proceso'}
            </div>
          )}
        </div>

        {/* Historial de retiros */}
        {retiros && retiros.length > 0 && (
          <div className="bg-zenit-navy-mid rounded-3xl p-5 border border-zenit-amber/10">
            <p className="text-xs font-semibold text-zenit-cream/40 uppercase tracking-wide mb-4">Historial de retiros</p>
            <div className="space-y-3">
              {retiros.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-zenit-navy last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-zenit-cream">{formatCOP(r.amount)}</p>
                    <p className="text-xs text-zenit-cream/30">{r.metodo} · {formatFecha(r.created_at)}</p>
                  </div>
                  {badgeRetiro(r.status)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cómo funciona */}
        <div className="bg-zenit-navy-mid rounded-3xl p-5 border border-zenit-amber/10">
          <p className="text-xs font-semibold text-zenit-cream/40 uppercase tracking-wide mb-4">Cómo funciona</p>
          <div className="space-y-3">
            {[
              { paso: '1', texto: 'Comparte tu link único con amigos, familia o redes sociales' },
              { paso: '2', texto: 'Cuando alguien paga su reporte usando tu link, ganas $10.000 COP' },
              { paso: '3', texto: 'Acumula y solicita tu retiro cuando tengas mínimo $50.000 COP (5 ventas)' },
            ].map(p => (
              <div key={p.paso} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-zenit-navy mt-0.5 bg-zenit-amber">
                  {p.paso}
                </div>
                <p className="text-sm text-zenit-cream/60">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zenit-cream/20 pb-4">
          Zenit · Programa de Afiliados · Código: <span className="font-mono font-bold text-zenit-cream/40">{codigoUpper}</span>
        </p>
      </div>

      {/* Modal de retiro */}
      {modalRetiro && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0"
          onClick={e => { if (e.target === e.currentTarget) setModalRetiro(false) }}>
          <div className="bg-zenit-navy-mid rounded-3xl p-6 w-full max-w-md border border-zenit-amber/10">
            {exitoRetiro ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-zenit-amber/20 border border-zenit-amber/40 flex items-center justify-center mx-auto mb-4">
                  <span className="text-zenit-amber text-xl font-serif">✓</span>
                </div>
                <h2 className="font-serif text-xl text-zenit-cream mb-2">¡Solicitud enviada!</h2>
                <p className="text-zenit-cream/50 text-sm mb-6">Revisaremos tu solicitud y te transferiremos en 1-3 días hábiles.</p>
                <button onClick={() => setModalRetiro(false)}
                  className="w-full py-3 rounded-full text-zenit-navy font-bold bg-zenit-amber">
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-lg text-zenit-cream">Solicitar retiro</h2>
                  <button onClick={() => setModalRetiro(false)} className="text-zenit-cream/30 hover:text-zenit-cream text-xl leading-none">✕</button>
                </div>

                <div className="bg-zenit-navy rounded-2xl p-3 mb-5 text-center border border-zenit-amber/10">
                  <p className="text-xs text-zenit-cream/40 mb-1">Monto a retirar</p>
                  <p className="font-serif text-2xl text-zenit-amber">{formatCOP(stats.disponible)}</p>
                </div>

                <form onSubmit={solicitarRetiro} className="space-y-4">

                  {/* Datos personales */}
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={nombreRetiro}
                      onChange={e => setNombreRetiro(e.target.value)}
                      placeholder="Nombre completo"
                      className="w-full border-2 border-zenit-navy rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zenit-amber bg-zenit-navy text-zenit-cream placeholder-zenit-cream/30"
                      required
                    />
                    <input
                      type="text"
                      value={cedulaRetiro}
                      onChange={e => setCedulaRetiro(e.target.value)}
                      placeholder="Número de cédula"
                      className="w-full border-2 border-zenit-navy rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zenit-amber bg-zenit-navy text-zenit-cream placeholder-zenit-cream/30"
                      required
                    />
                    <input
                      type="email"
                      value={emailRetiro}
                      onChange={e => setEmailRetiro(e.target.value)}
                      placeholder="Correo para el comprobante"
                      className="w-full border-2 border-zenit-navy rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zenit-amber bg-zenit-navy text-zenit-cream placeholder-zenit-cream/30"
                      required
                    />
                  </div>

                  {/* Método de pago */}
                  <div>
                    <label className="text-sm font-semibold text-zenit-cream/60 block mb-2">Método de pago</label>
                    <div className="grid grid-cols-2 gap-2">
                      {METODOS_PAGO.map(m => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => setMetodo(m.value)}
                          className="py-2 px-3 rounded-full text-sm font-semibold border-2 transition-all"
                          style={{
                            borderColor: metodo === m.value ? '#c9a84c' : '#2d2e4a',
                            color: metodo === m.value ? '#c9a84c' : 'rgba(245,240,232,0.4)',
                            backgroundColor: metodo === m.value ? 'rgba(201,168,76,0.1)' : 'transparent',
                          }}>
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={datosPago}
                      onChange={e => setDatosPago(e.target.value)}
                      placeholder={METODOS_PAGO.find(m => m.value === metodo)?.placeholder}
                      className="w-full border-2 border-zenit-navy rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zenit-amber bg-zenit-navy text-zenit-cream placeholder-zenit-cream/30"
                      required
                    />
                    {metodo === 'bancolombia' && (
                      <div className="grid grid-cols-2 gap-2">
                        {['ahorros', 'corriente'].map(tipo => (
                          <button
                            key={tipo}
                            type="button"
                            onClick={() => setTipoCuenta(tipo)}
                            className="py-2 px-3 rounded-full text-sm font-semibold border-2 transition-all capitalize"
                            style={{
                              borderColor: tipoCuenta === tipo ? '#c9a84c' : '#2d2e4a',
                              color: tipoCuenta === tipo ? '#c9a84c' : 'rgba(245,240,232,0.4)',
                              backgroundColor: tipoCuenta === tipo ? 'rgba(201,168,76,0.1)' : 'transparent',
                            }}>
                            {tipo}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {errorRetiro && (
                    <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm">{errorRetiro}</div>
                  )}

                  <button
                    type="submit"
                    disabled={enviandoRetiro}
                    className="w-full py-3 rounded-full text-zenit-navy font-bold disabled:opacity-60 bg-zenit-amber">
                    {enviandoRetiro ? 'Enviando solicitud...' : `Solicitar ${formatCOP(stats.disponible)}`}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
