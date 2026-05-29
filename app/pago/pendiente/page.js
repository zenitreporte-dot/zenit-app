'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ZenitIcon } from '@/components/LogoZenit'

function PagoPendienteContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-zenit-navy">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <ZenitIcon size={26} className="text-zenit-amber opacity-60" />
        </div>
        <div className="w-16 h-16 rounded-full bg-zenit-navy-mid border border-zenit-amber/20 flex items-center justify-center mx-auto mb-6">
          <ZenitIcon size={28} className="text-zenit-amber/60" />
        </div>
        <h1 className="font-serif text-2xl text-zenit-cream mb-3">
          Pago en proceso
        </h1>
        <p className="text-zenit-cream/60 mb-4">
          Tu pago está siendo verificado. Esto puede tomar unos minutos.
        </p>
        <p className="text-zenit-cream/40 text-sm mb-8">
          Cuando se confirme, recibirás acceso a tu reporte automáticamente.
        </p>
        {sessionId && (
          <a
            href={`/reporte/${sessionId}`}
            className="inline-block px-8 py-4 rounded-2xl text-zenit-navy font-bold bg-zenit-amber"
          >
            Verificar estado de mi reporte
          </a>
        )}
      </div>
    </div>
  )
}

export default function PagoPendiente() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zenit-navy">
        <div className="w-10 h-10 border-4 border-zenit-amber border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PagoPendienteContent />
    </Suspense>
  )
}
