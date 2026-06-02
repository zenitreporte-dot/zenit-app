'use client'
// ============================================================
// Página que ve el usuario cuando sus respuestas son bloqueadas
// por el filtro de seguridad. Maneja 2 casos:
// 1. Crisis — mostrar recursos de salud mental con calidez
// 2. Bloqueado — explicar que no podemos generar el reporte
// ============================================================
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { MENSAJES_BLOQUEO, CATEGORIAS } from '@/lib/filtroSeguridad'
import { ZenitIcon } from '@/components/LogoZenit'

function ReporteBloqueadoContent() {
  const searchParams = useSearchParams()
  const categoria = searchParams.get('categoria') || CATEGORIAS.BLOQUEADO

  const info = MENSAJES_BLOQUEO[categoria] || MENSAJES_BLOQUEO[CATEGORIAS.BLOQUEADO]
  const esCrisis = categoria === CATEGORIAS.CRISIS

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-zenit-navy">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <ZenitIcon size={44} />
        </div>

        <h1 className="font-serif text-2xl text-zenit-cream mb-4">
          {info.titulo}
        </h1>

        <div className="text-zenit-cream/70 text-left bg-zenit-navy-mid rounded-2xl p-6 mb-8 border border-zenit-navy leading-relaxed whitespace-pre-line">
          {info.mensaje}
        </div>

        <a href={info.ctaUrl}
          className="block w-full py-4 rounded-full font-bold text-lg mb-4 transition-all hover:opacity-90"
          style={{ backgroundColor: esCrisis ? '#DC2626' : '#c9a84c', color: esCrisis ? 'white' : '#1a1b2e' }}>
          {info.cta}
        </a>

        {esCrisis && (
          <div className="space-y-3">
            <a href="https://wa.me/573001234567"
              className="block w-full py-3 rounded-full font-semibold border-2 transition-all hover:bg-gray-50"
              style={{ borderColor: '#25D366', color: '#25D366' }}>
              💬 Chat de apoyo por WhatsApp
            </a>
            <a href="/" className="block text-sm text-gray-400 hover:text-gray-600 mt-4">
              Volver al inicio
            </a>
          </div>
        )}

        {!esCrisis && (
          <a href="/" className="block text-sm text-gray-400 hover:text-gray-600">
            Volver al inicio
          </a>
        )}

      </div>
    </div>
  )
}

export default function ReporteBloqueado() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zenit-navy">
        <div className="w-10 h-10 border-4 border-zenit-amber border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ReporteBloqueadoContent />
    </Suspense>
  )
}
