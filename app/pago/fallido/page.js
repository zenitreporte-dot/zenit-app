'use client'
import { ZenitIcon } from '@/components/LogoZenit'

export default function PagoFallido() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-zenit-navy">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <ZenitIcon size={44} />
        </div>
        <div className="w-16 h-16 rounded-full bg-red-950/30 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-red-400 font-serif text-2xl">✕</span>
        </div>
        <h1 className="font-serif text-2xl text-zenit-cream mb-3">
          El pago no pudo procesarse
        </h1>
        <p className="text-zenit-cream/60 mb-8">
          No se realizó ningún cobro. Puedes intentarlo de nuevo con otra tarjeta o método de pago.
        </p>
        <a
          href="/pago"
          className="inline-block px-8 py-4 rounded-full text-zenit-navy font-bold text-lg bg-zenit-amber"
        >
          Intentar de nuevo
        </a>
      </div>
    </div>
  )
}
