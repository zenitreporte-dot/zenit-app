'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ZenitLogo, ZenitIcon } from '@/components/LogoZenit'

function PagoExitosoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [intentos, setIntentos] = useState(0)
  const [estado, setEstado] = useState('verificando')

  useEffect(() => {
    if (!sessionId) return

    // Disparar generación inmediatamente — no depender del webhook
    fetch('/api/reporte/generar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setEstado('listo')
          setTimeout(() => router.push(`/reporte/${sessionId}`), 1000)
        }
      })
      .catch(() => {
        // Si el fetch falla por timeout, el polling lo detectará
      })

    // Polling de respaldo cada 5s para detectar si ya existe
    const intervalo = setInterval(async () => {
      try {
        const res = await fetch(`/api/reporte/estado?session_id=${sessionId}`)
        const data = await res.json()

        if (data.listo) {
          clearInterval(intervalo)
          setEstado('listo')
          setTimeout(() => router.push(`/reporte/${sessionId}`), 1000)
          return
        }
      } catch (e) {}

      setIntentos(prev => {
        const nuevos = prev + 1
        if (nuevos > 24) { // 2 minutos máximo
          clearInterval(intervalo)
          setEstado('error')
        }
        return nuevos
      })
    }, 5000)

    return () => clearInterval(intervalo)
  }, [sessionId])

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zenit-navy">
        <div className="w-10 h-10 border-4 border-zenit-amber border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-zenit-navy">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <ZenitIcon size={44} />
        </div>

        {estado === 'verificando' && (
          <>
            <div className="w-16 h-16 rounded-full bg-zenit-navy-mid border border-zenit-amber/30 flex items-center justify-center mx-auto mb-6">
              <span className="w-6 h-6 border-2 border-zenit-amber border-t-transparent rounded-full animate-spin inline-block" />
            </div>
            <h1 className="font-serif text-2xl text-zenit-cream mb-3">
              ¡Pago recibido!
            </h1>
            <p className="text-zenit-cream/60 mb-6">
              La IA está analizando tus respuestas y generando tu reporte personalizado...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm mb-6 text-zenit-amber">
              <span className="w-4 h-4 border-2 border-zenit-amber border-t-transparent rounded-full animate-spin" />
              Generando tu reporte único...
            </div>
            <a href={`/reporte/${sessionId}`} className="text-xs text-zenit-cream/30 underline">
              ¿Ya terminó? Ver mi reporte →
            </a>
          </>
        )}

        {estado === 'listo' && (
          <>
            <div className="w-16 h-16 rounded-full bg-zenit-amber/20 border border-zenit-amber/40 flex items-center justify-center mx-auto mb-6">
              <span className="text-zenit-amber text-2xl font-serif">✓</span>
            </div>
            <h1 className="font-serif text-2xl text-zenit-cream mb-3">
              ¡Tu reporte está listo!
            </h1>
            <p className="text-zenit-amber">Redirigiendo...</p>
          </>
        )}

        {estado === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-zenit-navy-mid border border-zenit-amber/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-zenit-amber/60 font-serif text-2xl">⏳</span>
            </div>
            <h1 className="font-serif text-2xl text-zenit-cream mb-3">
              Tu reporte está siendo generado
            </h1>
            <p className="text-zenit-cream/60 mb-6">
              Está tomando más de lo usual. Haz clic aquí para verlo:
            </p>
            <a
              href={`/reporte/${sessionId}`}
              className="inline-block px-8 py-3 rounded-full text-zenit-navy font-semibold bg-zenit-amber"
            >
              Ver mi reporte →
            </a>
          </>
        )}

      </div>
    </div>
  )
}

export default function PagoExitoso() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zenit-navy">
        <div className="w-10 h-10 border-4 border-zenit-amber border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PagoExitosoContent />
    </Suspense>
  )
}
