'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ZenitLogo, ZenitIcon } from '@/components/LogoZenit'

const MENSAJES_CARGA = [
  { texto: 'Analizando lo que amas...' },
  { texto: 'Identificando tus fortalezas...' },
  { texto: 'Explorando tu potencial económico...' },
  { texto: 'Conectando con lo que el mundo necesita...' },
  { texto: 'Buscando patrones en tus respuestas...' },
  { texto: 'Sintetizando tu propósito central...' },
  { texto: 'Construyendo tu hoja de ruta...' },
  { texto: 'Finalizando tu reporte personalizado...' },
]

function PantallaGenerando() {
  const [mensajeActual, setMensajeActual] = useState(0)
  const [progreso, setProgreso] = useState(5)

  useEffect(() => {
    const intervaloMensaje = setInterval(() => {
      setMensajeActual(prev => (prev + 1) % MENSAJES_CARGA.length)
    }, 4000)

    const intervaloProgreso = setInterval(() => {
      setProgreso(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 3
      })
    }, 1500)

    return () => { clearInterval(intervaloMensaje); clearInterval(intervaloProgreso) }
  }, [])

  const mensaje = MENSAJES_CARGA[mensajeActual]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-zenit-navy">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <ZenitLogo size={40} />
        </div>

        <h2 className="font-serif text-zenit-cream text-xl mb-2 transition-all duration-500" key={`t-${mensajeActual}`}>
          {mensaje.texto}
        </h2>
        <p className="text-zenit-cream/40 text-sm mb-10">
          Analizando cada detalle de tus respuestas...
        </p>

        <div className="w-full bg-zenit-navy-mid rounded-full h-2 mb-3">
          <div className="h-2 rounded-full bg-zenit-amber transition-all duration-1000"
            style={{ width: `${progreso}%` }} />
        </div>
        <p className="text-zenit-cream/30 text-xs">Este proceso toma entre 20 y 60 segundos</p>

        <div className="flex justify-center gap-2 mt-10">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-zenit-amber"
              style={{ opacity: i === 0 ? 0.9 : i === 1 ? 0.6 : i === 2 ? 0.4 : 0.2 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function PaginaReporteContent() {
  const { session_id } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const reporteRef = useRef(null)

  const [reporte, setReporte] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [generando, setGenerando] = useState(searchParams.get('generando') === 'true')
  const [error, setError] = useState(null)
  const [nombre, setNombre] = useState('')
  const [seccionActiva, setSeccionActiva] = useState(1)

  useEffect(() => {
    if (!session_id) return

    const cargarReporte = async () => {
      let data
      try {
        const res = await fetch(`/api/reporte/ver?session_id=${session_id}`)
        data = await res.json()
      } catch (e) {
        return false
      }

      if (data.error) {
        if (data.error.includes('generando') || data.error.includes('Espera')) return false
        if (data.error.includes('pagada') || data.error.includes('pago')) {
          router.replace('/pago')
          return true
        }
        setError(data.error)
        setCargando(false)
        return true
      }

      setReporte(data)
      setGenerando(false)
      setCargando(false)
      // Extraer nombre si está en sessionStorage o en las respuestas
      const nombreGuardado = sessionStorage.getItem('ikigai_nombre')
      if (nombreGuardado) setNombre(nombreGuardado.split(' ')[0])
      return true
    }

    const dispararGeneracion = () => {
      fetch('/api/reporte/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.ok) cargarReporte()
        })
        .catch(() => {})
    }

    if (generando) {
      dispararGeneracion()
      const intervalo = setInterval(async () => {
        const listo = await cargarReporte()
        if (listo) clearInterval(intervalo)
      }, 4000)
      setTimeout(() => cargarReporte(), 15000)
      return () => clearInterval(intervalo)
    } else {
      // Intentar cargar — si no existe, disparar generación y polling
      cargarReporte().then(listo => {
        if (!listo) {
          setGenerando(true)
          dispararGeneracion()
          const intervalo = setInterval(async () => {
            const done = await cargarReporte()
            if (done) clearInterval(intervalo)
          }, 4000)
          setTimeout(() => clearInterval, 120000) // cleanup máximo 2min
        }
      })
    }
  }, [session_id, generando])

  useEffect(() => {
    if (!reporte) return

    const handleScroll = () => {
      const secciones = document.querySelectorAll('[data-seccion]')
      const OFFSET = 140

      const alFondo = window.innerHeight + window.scrollY >= document.body.scrollHeight - 60
      if (alFondo) {
        const nums = Array.from(secciones).map(el => parseInt(el.dataset.seccion))
        setSeccionActiva(Math.max(...nums))
        return
      }

      let seccionVisible = 1
      secciones.forEach(el => {
        const top = el.getBoundingClientRect().top + window.scrollY
        if (window.scrollY + OFFSET >= top) {
          seccionVisible = parseInt(el.dataset.seccion)
        }
      })
      setSeccionActiva(seccionVisible)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reporte])

  function handleDescargarPDF() {
    window.open(`/api/reporte/pdf?session_id=${session_id}`, '_blank')
  }

  if (generando || (cargando && !error)) return <PantallaGenerando />

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-zenit-navy">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <a href="/formulario" className="text-zenit-amber">← Volver al formulario</a>
        </div>
      </div>
    )
  }

  if (!reporte) return null

  const { content, generated_at } = reporte
  const secciones = [
    { id: 1, titulo: 'Tu Propósito' },
    { id: 2, titulo: 'Para quién' },
    { id: 3, titulo: 'Las 4 Dimensiones' },
    { id: 4, titulo: 'Las 4 Intersecciones' },
    { id: 5, titulo: 'Tu Arquetipo' },
    { id: 6, titulo: 'Alertas' },
    { id: 7, titulo: 'Habilidades' },
    { id: 8, titulo: 'Hoja de Ruta' },
    { id: 9, titulo: 'Tu Ikigai Cotidiano' },
    { id: 10, titulo: 'Tu Frase' },
  ]

  return (
    <div className="min-h-screen bg-zenit-navy">
      <header className="px-6 py-4 border-b border-zenit-navy-mid sticky top-0 bg-zenit-navy z-20 print:hidden">
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center">
            <ZenitIcon size={28} />
          </div>
          <div className="flex justify-center">
            <span className="font-sans font-bold text-lg tracking-wide text-zenit-amber">zenit</span>
          </div>
          <div className="flex justify-end items-center gap-3">
            <span className="text-xs text-zenit-cream/30 hidden sm:block">Tu reporte</span>
            <button onClick={handleDescargarPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-80 bg-zenit-navy-mid text-zenit-amber border border-zenit-amber/20">
              Descargar PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex gap-0 lg:gap-8 px-4 lg:px-6">

        <aside className="hidden lg:block w-52 flex-shrink-0 print:hidden">
          <div className="sticky top-24 py-8">
            <p className="text-xs font-semibold text-zenit-cream/30 uppercase tracking-wide mb-4">Secciones</p>
            <nav className="space-y-1">
              {secciones.map(s => (
                <a key={s.id} href={`#seccion-${s.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
                  style={{
                    backgroundColor: seccionActiva === s.id ? 'rgba(201,168,76,0.15)' : 'transparent',
                    color: seccionActiva === s.id ? '#c9a84c' : 'rgba(245,240,232,0.3)',
                    fontWeight: seccionActiva === s.id ? '600' : '400',
                  }}>
                  <span className="font-serif text-xs opacity-50">{String(s.id).padStart(2, '0')}.</span>
                  <span>{s.titulo}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 py-8 space-y-8 max-w-2xl" ref={reporteRef}>

          <div id="seccion-1" data-seccion="1" className="rounded-3xl overflow-hidden border border-zenit-amber/20"
            style={{ background: 'linear-gradient(135deg, #1a1b2e 0%, #2d2e4a 100%)' }}>
            <div className="p-8 sm:p-10">
              {nombre && (
                <p className="text-zenit-cream/40 text-sm mb-4">
                  Hola {nombre}, aquí está tu análisis
                </p>
              )}
              <p className="text-zenit-amber/60 text-xs font-semibold tracking-widest uppercase mb-3">
                Tu arquetipo
              </p>
              <h1 className="font-serif text-zenit-cream text-3xl sm:text-4xl mb-5 leading-tight">
                {content.arquetipo?.nombre}
              </h1>
              <p className="text-zenit-cream/80 text-lg leading-relaxed mb-6">
                {content.ikigai_central}
              </p>
              <div className="border-t border-zenit-amber/20 pt-5">
                <p className="text-zenit-amber/60 text-xs mb-2">Tu frase</p>
                <p className="text-zenit-cream font-semibold text-lg italic">
                  "{content.frase_cierre}"
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4">
              {[
                { color: '#c9a84c', nombre: 'Amas' },
                { color: '#e8c97a', nombre: 'Talento' },
                { color: '#f5f0e8', nombre: 'Valor' },
                { color: '#c9a84c', nombre: 'Impacto' },
              ].map(c => (
                <div key={c.nombre} className="py-3 text-center border-t border-zenit-amber/10">
                  <div className="w-1.5 h-1.5 rounded-full mx-auto mb-1.5" style={{ backgroundColor: c.color }} />
                  <p className="text-zenit-cream/40 text-xs">{c.nombre}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sección 2 — Para quién */}
          <SeccionReporte id="seccion-2" numero={2} titulo="Para quién">
            <div className="rounded-xl p-5 bg-zenit-navy-mid/40 border border-zenit-amber/10">
              <p className="text-xs text-zenit-amber/50 font-semibold tracking-widest uppercase mb-3">
                Las personas que cambian con lo que haces
              </p>
              <p className="text-zenit-cream/75 leading-relaxed">{content.para_quien}</p>
            </div>
            {content.contexto_reconocido && (
              <div className="mt-3 rounded-xl p-4 bg-zenit-navy border border-zenit-navy-mid">
                <p className="text-xs text-zenit-cream/30 font-semibold uppercase tracking-widest mb-2">Tu contexto real</p>
                <p className="text-sm text-zenit-cream/55 leading-relaxed italic">{content.contexto_reconocido}</p>
              </div>
            )}
          </SeccionReporte>

          {/* Sección 3 — Las 4 Dimensiones */}
          <SeccionReporte id="seccion-3" numero={3} titulo="Las 4 Dimensiones">
            <div className="space-y-4">
              <DimensionItem acento="#c9a84c" titulo="Lo que Amas"
                texto={content.analisis_circulos?.lo_que_amas} />
              <DimensionItem acento="#e8c97a" titulo="En lo que Eres Bueno"
                texto={content.analisis_circulos?.en_lo_que_eres_bueno} />
              <DimensionItem acento="#f5f0e8" titulo="Por lo que te Pueden Pagar"
                texto={content.analisis_circulos?.por_lo_que_te_pueden_pagar} />
              <DimensionItem acento="#c9a84c" titulo="Lo que el Mundo Necesita"
                texto={content.analisis_circulos?.lo_que_el_mundo_necesita} />
            </div>
          </SeccionReporte>

          {/* Sección 4 — Las 4 Intersecciones */}
          <SeccionReporte id="seccion-4" numero={4} titulo="Las 4 Intersecciones">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InterseccionCard titulo="Pasión" subtitulo="Amas + Eres bueno"
                texto={content.intersecciones?.pasion} />
              <InterseccionCard titulo="Misión" subtitulo="Amas + Mundo necesita"
                texto={content.intersecciones?.mision} />
              <InterseccionCard titulo="Vocación" subtitulo="Eres bueno + Mundo necesita"
                texto={content.intersecciones?.vocacion} />
              <InterseccionCard titulo="Profesión" subtitulo="Eres bueno + Te pagan"
                texto={content.intersecciones?.profesion} />
            </div>
          </SeccionReporte>

          {/* Sección 5 — Tu Arquetipo */}
          <SeccionReporte id="seccion-5" numero={5} titulo="Tu Arquetipo">
            <div className="py-4">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <p className="font-serif text-2xl text-zenit-amber">{content.arquetipo?.nombre}</p>
                {content.arquetipo?.orientacion && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                    style={{
                      backgroundColor: content.arquetipo.orientacion === 'calling'
                        ? 'rgba(201,168,76,0.12)'
                        : content.arquetipo.orientacion === 'career'
                          ? 'rgba(144,174,212,0.12)'
                          : 'rgba(245,240,232,0.06)',
                      color: content.arquetipo.orientacion === 'calling'
                        ? '#c9a84c'
                        : content.arquetipo.orientacion === 'career'
                          ? '#90aed4'
                          : 'rgba(245,240,232,0.4)',
                    }}>
                    {content.arquetipo.orientacion === 'calling' ? 'Calling' :
                      content.arquetipo.orientacion === 'career' ? 'Career' : 'Job → Calling'}
                  </span>
                )}
              </div>
              <p className="text-zenit-cream/70 leading-relaxed">{content.arquetipo?.descripcion}</p>
            </div>
          </SeccionReporte>

          {/* Sección 6 — Alertas */}
          <SeccionReporte id="seccion-6" numero={6} titulo="Alertas">
            <div className="space-y-3">
              {(content.alertas || []).map((alerta, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-red-950/20 border border-red-500/15">
                  <span className="text-red-400/60 flex-shrink-0 font-serif text-lg leading-snug">—</span>
                  <p className="text-zenit-cream/70 text-sm leading-relaxed">{alerta}</p>
                </div>
              ))}
            </div>
          </SeccionReporte>

          {/* Sección 7 — Habilidades */}
          <SeccionReporte id="seccion-7" numero={7} titulo="Habilidades a Desarrollar">
            <div className="space-y-4">
              {(content.habilidades || []).map((h, i) => (
                <div key={i} className="p-4 rounded-xl border border-zenit-navy-mid bg-zenit-navy-mid/40">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-serif text-zenit-amber/60 text-sm w-5 flex-shrink-0">{i + 1}.</span>
                    <p className="font-semibold text-zenit-cream">{h.nombre}</p>
                  </div>
                  <p className="text-sm text-zenit-cream/55 mb-1 pl-8">
                    <span className="font-medium text-zenit-cream/70">Por qué:</span> {h.por_que}
                  </p>
                  <p className="text-sm text-zenit-cream/55 pl-8">
                    <span className="font-medium text-zenit-cream/70">Cómo:</span> {h.como}
                  </p>
                </div>
              ))}
            </div>
          </SeccionReporte>

          {/* Sección 8 — Hoja de Ruta */}
          <SeccionReporte id="seccion-8" numero={8} titulo="Hoja de Ruta">
            <div className="space-y-6">
              <PeriodoRuta titulo="Primeros 30 días" acento="#c9a84c" acciones={content.hoja_de_ruta?.dias_30} />
              <div className="border-t border-zenit-amber/10" />
              <PeriodoRuta titulo="Próximos 90 días" acento="#e8c97a" acciones={content.hoja_de_ruta?.dias_90} />
              <div className="border-t border-zenit-amber/10" />
              <PeriodoRuta titulo="A 180 días" acento="#f5f0e8" acciones={content.hoja_de_ruta?.dias_180} />
            </div>
          </SeccionReporte>

          {/* Sección 9 — Micro Ikigai */}
          {content.micro_ikigai && (
            <SeccionReporte id="seccion-9" numero={9} titulo="Tu Ikigai de Hoy">
              <div className="rounded-xl p-5 bg-zenit-navy-mid/40 border border-zenit-amber/10">
                <p className="text-xs text-zenit-amber/50 font-semibold tracking-widest uppercase mb-3">
                  Lo que ya tienes — sin esperar ningún cambio
                </p>
                <p className="text-zenit-cream/75 leading-relaxed">{content.micro_ikigai}</p>
              </div>
            </SeccionReporte>
          )}

          {/* Sección 10 — Tu Frase */}
          <div id="seccion-10" data-seccion="10"
            className="rounded-3xl p-10 text-center border border-zenit-amber/20"
            style={{ background: 'linear-gradient(135deg, #1a1b2e 0%, #2d2e4a 100%)' }}>
            <p className="text-zenit-amber/50 text-xs tracking-widest uppercase mb-4">Tu frase</p>
            <p className="font-serif text-zenit-cream text-2xl leading-relaxed">
              "{content.frase_cierre}"
            </p>
            <p className="text-zenit-cream/20 text-xs mt-6">
              Generado el {generated_at ? new Date(generated_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : 'hoy'}
            </p>
          </div>

          <div className="pt-4 pb-12 print:hidden">
            <div className="bg-zenit-navy-mid rounded-2xl p-6 border border-zenit-amber/10">
              <p className="font-semibold mb-1 text-zenit-cream">¿Te ayudó este reporte?</p>
              <p className="text-zenit-cream/50 text-sm mb-4">
                Comparte Zenit y gana $10.000 COP por cada persona que pague.
              </p>
              <a href={`/afiliados/unirse?session_id=${session_id}`}
                className="inline-block px-6 py-3 rounded-full text-zenit-navy font-semibold text-sm bg-zenit-amber">
                Quiero mi link de afiliado →
              </a>
            </div>
          </div>
        </main>
      </div>

    </div>
  )
}

function SeccionReporte({ id, numero, titulo, children }) {
  return (
    <section id={id} data-seccion={numero} className="rounded-2xl overflow-hidden border border-zenit-navy-mid">
      <div className="px-5 py-4 flex items-center gap-4 bg-zenit-navy-mid">
        <span className="font-serif text-zenit-amber/40 text-sm w-5 flex-shrink-0">{numero}.</span>
        <h2 className="font-serif text-base text-zenit-cream">{titulo}</h2>
      </div>
      <div className="px-5 py-5 bg-zenit-navy">{children}</div>
    </section>
  )
}

function DimensionItem({ titulo, acento, texto }) {
  return (
    <div className="rounded-xl p-4 bg-zenit-navy-mid border border-zenit-navy">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: acento }} />
        <p className="font-semibold text-sm text-zenit-cream/80">{titulo}</p>
      </div>
      <p className="text-zenit-cream/60 text-sm leading-relaxed pl-3.5">{texto}</p>
    </div>
  )
}

function InterseccionCard({ titulo, subtitulo, texto }) {
  return (
    <div className="p-4 rounded-xl bg-zenit-navy-mid border border-zenit-navy">
      <p className="font-semibold text-zenit-cream text-sm mb-0.5">{titulo}</p>
      <p className="text-xs text-zenit-cream/30 mb-3">{subtitulo}</p>
      <p className="text-sm text-zenit-cream/60 leading-relaxed">{texto}</p>
    </div>
  )
}

function PeriodoRuta({ titulo, acento, acciones }) {
  return (
    <div>
      <p className="font-semibold mb-3 text-sm text-zenit-cream/70 flex items-center gap-2">
        <span className="w-2 h-px inline-block" style={{ backgroundColor: acento }} />
        {titulo}
      </p>
      <ul className="space-y-2">
        {(acciones || []).map((accion, i) => (
          <li key={i} className="flex gap-3 text-zenit-cream/60 text-sm">
            <span className="flex-shrink-0 text-zenit-amber/50">→</span>
            <span>{accion}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function PaginaReporte() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zenit-navy">
        <div className="w-10 h-10 border-4 border-zenit-amber border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaginaReporteContent />
    </Suspense>
  )
}
