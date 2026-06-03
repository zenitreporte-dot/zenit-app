'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SECCIONES, TODAS_LAS_PREGUNTAS } from '@/lib/preguntas'
import { ZenitLogo } from '@/components/LogoZenit'

function generarToken() {
  return 'sk_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
}
function leerTokenDeCookie() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/ikigai_session=([^;]+)/)
  return match ? match[1] : null
}
function guardarTokenEnCookie(token) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `ikigai_session=${token}; expires=${expires}; path=/; SameSite=Lax`
}
function leerAfiliadoDeCookie() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/ikigai_ref=([^;]+)/)
  return match ? match[1] : null
}

function PantallaBienvenida({ onEmpezar }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-zenit-navy">
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center mb-5">
          <ZenitLogo size={40} />
        </div>
        <h1 className="font-serif text-3xl text-zenit-cream mb-2">
          Conócete en 20 minutos
        </h1>
        <p className="text-zenit-cream/50 mb-8">
          20 preguntas para encontrar tu propósito de vida
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8 text-left">
          {[
            { num: '01', nombre: 'Lo que Amas', color: '#c9a84c' },
            { num: '02', nombre: 'En lo que Eres Bueno', color: '#90aed4' },
            { num: '03', nombre: 'Por lo que te Pagan', color: '#8ec48e' },
            { num: '04', nombre: 'Lo que el Mundo Necesita', color: '#c9a84c' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3 flex items-center gap-3 bg-zenit-navy-mid border border-zenit-amber/10">
              <span className="font-serif text-sm opacity-40" style={{ color: s.color }}>{s.num}</span>
              <span className="text-xs font-medium text-zenit-cream/60">{s.nombre}</span>
            </div>
          ))}
        </div>

        <div className="bg-zenit-navy-mid rounded-2xl p-4 mb-8 text-sm text-left space-y-3">
          {[
            'Tarda entre 10 y 15 minutos',
            'Responde con honestidad — la IA detecta respuestas genéricas',
            'Tu progreso se guarda automáticamente',
            'Tus respuestas son privadas y solo las usa la IA para tu reporte',
          ].map((txt, i) => (
            <p key={i} className="flex items-start gap-3 text-zenit-cream/50">
              <span className="text-zenit-amber mt-0.5 flex-shrink-0">—</span>
              <span>{txt}</span>
            </p>
          ))}
        </div>

        <button
          onClick={onEmpezar}
          className="w-full py-4 rounded-full text-zenit-navy font-bold text-lg shadow-md transition-all hover:opacity-90 bg-zenit-amber"
        >
          Comenzar →
        </button>
      </div>
    </div>
  )
}

export default function Formulario() {
  const router = useRouter()
  const [pantalla, setPantalla] = useState('bienvenida')
  const [sessionToken, setSessionToken] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [respuestas, setRespuestas] = useState({})
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [respuestaActual, setRespuestaActual] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)
  const [animando, setAnimando] = useState(false)

  const totalPreguntas = TODAS_LAS_PREGUNTAS.length
  const pregunta = TODAS_LAS_PREGUNTAS[preguntaActual]
  const seccionIndex = Math.floor(preguntaActual / 5)
  const seccion = SECCIONES[seccionIndex]
  const numeroPreguntaEnSeccion = (preguntaActual % 5) + 1

  useEffect(() => {
    let token = leerTokenDeCookie()
    if (!token) {
      token = generarToken()
      guardarTokenEnCookie(token)
    }
    setSessionToken(token)

    fetch(`/api/formulario/sesion?token=${token}`)
      .then(r => r.json())
      .then(({ session }) => {
        if (session && session.answers && Object.keys(session.answers).length > 0) {
          setRespuestas(session.answers)
          setSessionId(session.id)
          const ultimaRespuesta = Object.keys(session.answers).length
          if (ultimaRespuesta < totalPreguntas) {
            setPreguntaActual(ultimaRespuesta)
            if (ultimaRespuesta > 0) setPantalla('formulario')
          }
        }
      })
      .catch(() => {})
  }, [])

  const guardarSeccion = useCallback(async (respuestasActualizadas, seccionCompletada, esUltima) => {
    if (!sessionToken) return
    setGuardando(true)
    try {
      const referred_by = leerAfiliadoDeCookie()
      const res = await fetch('/api/formulario/sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_token: sessionToken,
          answers: respuestasActualizadas,
          current_step: seccionCompletada,
          completed: esUltima,
          referred_by,
        }),
      })
      const data = await res.json()
      if (data.session_id) setSessionId(data.session_id)
    } catch (e) {
      console.error('Error guardando:', e)
    } finally {
      setGuardando(false)
    }
  }, [sessionToken])

  function handleSiguiente() {
    if (!respuestaActual.trim()) {
      setError('Escribe tu respuesta antes de continuar.')
      return
    }
    if (respuestaActual.trim().length < 30) {
      setError('Agrega un poco más de detalle para que la IA pueda hacer un análisis personalizado.')
      return
    }
    setError(null)

    const nuevasRespuestas = { ...respuestas, [pregunta.id]: respuestaActual.trim() }
    setRespuestas(nuevasRespuestas)

    setAnimando(true)
    setTimeout(() => {
      const esUltimaPreguntaDeLaSeccion = (preguntaActual + 1) % 5 === 0
      const esLaUltimaPregunta = preguntaActual === totalPreguntas - 1

      if (esUltimaPreguntaDeLaSeccion || esLaUltimaPregunta) {
        const seccionTerminada = Math.ceil((preguntaActual + 1) / 5)
        guardarSeccion(nuevasRespuestas, seccionTerminada, esLaUltimaPregunta)
      }

      if (esLaUltimaPregunta) {
        if (sessionId) sessionStorage.setItem('ikigai_session_id', sessionId)
        sessionStorage.setItem('ikigai_token', sessionToken)
        router.push('/pago')
      } else {
        setPreguntaActual(prev => prev + 1)
        setRespuestaActual(nuevasRespuestas[TODAS_LAS_PREGUNTAS[preguntaActual + 1]?.id] || '')
        setAnimando(false)
      }
    }, 300)
    // Seguro: desbloquear botón después de 800ms por si algo falla
    setTimeout(() => setAnimando(false), 800)
  }

  function handleAnterior() {
    if (preguntaActual === 0) return
    setAnimando(true)
    setTimeout(() => {
      const indicePrev = preguntaActual - 1
      setPreguntaActual(indicePrev)
      setRespuestaActual(respuestas[TODAS_LAS_PREGUNTAS[indicePrev].id] || '')
      setError(null)
      setAnimando(false)
    }, 200)
  }

  useEffect(() => {
    if (pregunta) setRespuestaActual(respuestas[pregunta.id] || '')
  }, [preguntaActual])

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSiguiente()
  }

  if (pantalla === 'bienvenida') {
    return <PantallaBienvenida onEmpezar={() => setPantalla('formulario')} />
  }

  if (!sessionToken || !pregunta || !seccion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zenit-navy">
        <div className="w-8 h-8 border-4 border-zenit-amber border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen transition-colors duration-700 flex flex-col"
      style={{ backgroundColor: seccion.colorFondo }}>

      <header className="px-6 pt-5 pb-2">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{seccion.icono}</span>
              <div>
                <p className="text-xs font-medium opacity-60" style={{ color: seccion.colorTexto }}>
                  Sección {seccionIndex + 1} de 4
                </p>
                <p className="font-semibold text-sm leading-tight" style={{ color: seccion.colorTexto }}>
                  {seccion.nombre}
                </p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {SECCIONES.map((s, i) => (
                <div key={i} className="w-2 h-2 rounded-full transition-all"
                  style={{ backgroundColor: i <= seccionIndex ? seccion.colorBoton : 'rgba(255,255,255,0.4)' }} />
              ))}
            </div>
          </div>

          <div className="w-full bg-white bg-opacity-50 rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(numeroPreguntaEnSeccion / 5) * 100}%`, backgroundColor: seccion.colorBoton }} />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-6">
        <div className="w-full max-w-2xl"
          style={{ opacity: animando ? 0 : 1, transform: animando ? 'translateY(8px)' : 'translateY(0)', transition: 'all 0.3s ease' }}>

          <p className="text-xs font-medium mb-2 opacity-60" style={{ color: seccion.colorTexto }}>
            Pregunta {numeroPreguntaEnSeccion} de 5
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl font-normal mb-6 leading-snug" style={{ color: seccion.colorTexto }}>
            {pregunta.texto}
          </h2>

          <div className="relative">
            <textarea
              value={respuestaActual}
              onChange={e => { setRespuestaActual(e.target.value); setError(null) }}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu respuesta aquí..."
              rows={4}
              className="w-full rounded-2xl p-4 text-zenit-navy placeholder-zenit-navy/40 resize-none outline-none text-base shadow-sm"
              style={{
                backgroundColor: 'rgba(245, 240, 232, 0.92)',
                border: error ? '2px solid #ef4444' : '2px solid transparent',
              }}
              autoFocus
            />
            <div className="flex justify-between mt-1.5 px-1">
              <span className="text-xs opacity-50" style={{ color: seccion.colorTexto }}>
                {respuestaActual.length < 30 ? 'Agrega un poco más de detalle para un análisis personalizado' : '✓ Buena respuesta'}
              </span>
            </div>
          </div>

          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          {guardando && <p className="mt-2 text-xs opacity-50" style={{ color: seccion.colorTexto }}>Guardando progreso...</p>}
        </div>
      </main>

      <footer className="px-6 pb-8">
        <div className="max-w-2xl mx-auto flex gap-3">
          {preguntaActual > 0 && (
            <button onClick={handleAnterior}
              className="flex-shrink-0 px-5 py-4 rounded-full font-semibold transition-all hover:opacity-80 bg-white/20 text-zenit-cream border border-white/30">
              ← Atrás
            </button>
          )}
          <button onClick={handleSiguiente} disabled={guardando}
            className="flex-1 py-4 rounded-full font-bold text-lg text-zenit-navy transition-all hover:opacity-90 disabled:opacity-60 shadow-md bg-zenit-amber">
            {guardando ? 'Guardando...' : preguntaActual === totalPreguntas - 1 ? '¡Ver mi reporte! →' : 'Siguiente →'}
          </button>
        </div>
      </footer>
    </div>
  )
}
