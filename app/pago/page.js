'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ZenitLogo } from '@/components/LogoZenit'

export default function PantallaDePago() {
  const router = useRouter()
  const [sessionToken, setSessionToken] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [cargandoPago, setCargandoPago] = useState(false)
  const [cargandoPrueba, setCargandoPrueba] = useState(false)
  const [error, setError] = useState(null)
  const [totalReportes, setTotalReportes] = useState(null)

  useEffect(() => {
    const token = sessionStorage.getItem('ikigai_token')
    const sid = sessionStorage.getItem('ikigai_session_id')
    if (!token) { router.replace('/formulario'); return }
    setSessionToken(token)
    setSessionId(sid)

    // Si ya pagó, redirigir directo al reporte
    if (sid) {
      fetch(`/api/reporte/ver?session_id=${sid}`)
        .then(r => r.json())
        .then(d => { if (d.id) router.replace(`/reporte/${sid}`) })
        .catch(() => {})
    }

    fetch('/api/stats/reportes')
      .then(r => r.json())
      .then(d => { if (d.total) setTotalReportes(d.total) })
      .catch(() => {})
  }, [])

  async function handlePagar() {
    if (!sessionToken) return
    setCargandoPago(true)
    setError(null)
    try {
      const res = await fetch('/api/pago/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: sessionToken }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.session_id) { router.replace(`/reporte/${data.session_id}`); return }
        throw new Error(data.error || 'Error al crear el pago')
      }
      window.location.href = data.checkout_url
    } catch (e) {
      setError(e.message)
      setCargandoPago(false)
    }
  }

  async function handleModoPrueba() {
    if (!sessionId) { setError('No hay sesión activa. Completa el formulario primero.'); return }
    setCargandoPrueba(true)
    setError(null)
    try {
      const res = await fetch('/api/reporte/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, modo_prueba: true }),
      })
      const data = await res.json()

      if (data.bloqueado) {
        router.push(`/reporte/bloqueado?categoria=${data.categoria}`)
        return
      }
      if (data.ok && data.reporte_id) {
        router.push(`/reporte/${sessionId}`)
        return
      }
      router.push(`/reporte/${sessionId}?generando=true`)
    } catch (e) {
      setError(e.message)
      setCargandoPrueba(false)
    }
  }

  return (
    <div className="min-h-screen bg-zenit-navy flex flex-col">
      <header className="px-6 py-5 border-b border-zenit-navy-mid flex items-center justify-between">
        <ZenitLogo size={32} />
        <span className="text-xs text-zenit-cream/30 flex items-center gap-1.5">
          <span>🔒</span> Pago seguro · Mercado Pago
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">

          {totalReportes && (
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-zenit-navy-mid text-zenit-amber border border-zenit-amber/20">
                {totalReportes} personas ya conocen su propósito
              </span>
            </div>
          )}

          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-zenit-cream mb-3">¡Tu reporte está listo!</h1>
            <p className="text-zenit-cream/60 text-lg">
              La IA analizó tus 20 respuestas y generó tu reporte personalizado de propósito de vida.
            </p>
          </div>

          {/* Preview borroso */}
          <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg border border-zenit-amber/10">
            <div className="p-8 bg-zenit-navy-mid select-none"
              style={{ filter: 'blur(6px)', userSelect: 'none', pointerEvents: 'none' }}>
              <h3 className="font-serif text-xl text-zenit-cream mb-4">Tu Propósito Central</h3>
              <p className="text-zenit-cream/70 mb-6 leading-relaxed">
                Tu propósito de vida gira en torno a conectar personas con conocimiento de formas creativas y significativas. Tienes una capacidad única para simplificar lo complejo...
              </p>
              <h3 className="font-serif text-xl text-zenit-cream mb-3">Tu Arquetipo</h3>
              <p className="text-zenit-cream/70">El Arquitecto de Impacto — alguien que construye sistemas...</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {['Hoja de ruta a 180 días', 'Alertas de caminos equivocados', 'Habilidades clave', 'Frase de cierre'].map(item => (
                  <div key={item} className="bg-zenit-navy rounded-xl p-3">
                    <p className="font-semibold text-zenit-cream text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ background: 'linear-gradient(to bottom, rgba(26,27,46,0) 0%, rgba(26,27,46,0.97) 55%)' }}>
              <div className="text-center px-6 pt-24">
                <div className="w-10 h-10 rounded-xl bg-zenit-navy-mid border border-zenit-amber/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-zenit-amber/60 text-xl">🔒</span>
                </div>
                <p className="font-serif text-xl text-zenit-cream mb-1">Reporte completo generado</p>
                <p className="text-zenit-cream/40 text-sm">8 secciones · Análisis personalizado · Hoja de ruta a 180 días</p>
              </div>
            </div>
          </div>

          {/* Lo que incluye */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {[
              'Tu propósito central',
              'Análisis de 4 dimensiones',
              'Tu arquetipo personal',
              'Alertas de caminos equivocados',
              'Habilidades a desarrollar',
              'Hoja de ruta a 180 días',
            ].map((texto) => (
              <div key={texto} className="flex items-center gap-2 bg-zenit-navy-mid rounded-xl p-3">
                <span className="text-zenit-amber flex-shrink-0">✓</span>
                <p className="text-sm text-zenit-cream/70">{texto}</p>
              </div>
            ))}
          </div>

          {/* Precio y CTA */}
          <div className="text-center">
            <div className="mb-1">
              <span className="font-serif text-4xl sm:text-5xl text-zenit-amber">$25.000</span>
              <span className="text-zenit-cream/40 ml-2">COP</span>
            </div>
            <p className="text-zenit-cream/40 text-sm mb-6">Pago único · Descarga inmediata en PDF · Tuyo para siempre</p>

            {error && (
              <div className="mb-4 p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <button onClick={handlePagar} disabled={cargandoPago}
              className="w-full py-5 rounded-full text-zenit-navy font-bold text-xl shadow-lg transition-all hover:opacity-90 disabled:opacity-60 bg-zenit-amber">
              {cargandoPago ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-zenit-navy border-t-transparent rounded-full animate-spin" />
                  Redirigiendo a Mercado Pago...
                </span>
              ) : 'Desbloquear mi reporte — $25.000 COP'}
            </button>
            <p className="mt-3 text-xs text-zenit-cream/30">Pago seguro · Tarjeta, PSE, Nequi y más</p>

          </div>
        </div>
      </main>
    </div>
  )
}
