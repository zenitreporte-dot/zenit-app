'use client'
import { ZenitIcon } from '@/components/LogoZenit'
import { useRouter } from 'next/navigation'

export default function ProgramaInfluencer() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-zenit-navy text-zenit-cream">

      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-zenit-navy-mid">
        <div className="flex items-center gap-2">
          <ZenitIcon size={22} className="text-zenit-amber" />
          <span className="font-serif text-lg text-zenit-cream">Zenit</span>
        </div>
        <a href="/afiliados/login" className="text-xs text-zenit-cream/40 hover:text-zenit-amber transition-colors">
          Ya tengo cuenta →
        </a>
      </header>

      {/* Hero */}
      <section className="px-6 pt-14 pb-10 text-center max-w-lg mx-auto">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-zenit-amber/10 text-zenit-amber border border-zenit-amber/20 mb-6">
          Programa de Afiliados
        </div>
        <h1 className="font-serif text-4xl leading-tight mb-4">
          Gana $10.000 COP<br />por cada persona<br />que refieras
        </h1>
        <p className="text-zenit-cream/60 text-lg leading-relaxed mb-8">
          Comparte tu link. Cuando alguien pague su reporte de propósito de vida usando tu link, tú ganas una comisión automática.
        </p>
        <button
          onClick={() => router.push('/afiliados/unirse')}
          className="w-full py-5 rounded-2xl text-zenit-navy font-bold text-xl bg-zenit-amber shadow-lg hover:opacity-90 transition-opacity">
          Quiero mi link → Gratis
        </button>
        <p className="text-zenit-cream/30 text-xs mt-3">Sin costo. Sin mínimos de seguidores.</p>
      </section>

      {/* Cómo funciona */}
      <section className="px-6 pb-10 max-w-lg mx-auto">
        <p className="text-xs font-semibold text-zenit-cream/30 tracking-widest uppercase mb-6 text-center">Cómo funciona</p>
        <div className="space-y-4">
          {[
            { num: '01', titulo: 'Te registras gratis', desc: 'Creas tu cuenta en 2 minutos. Sin requisitos.' },
            { num: '02', titulo: 'Recibes tu link único', desc: 'Un link personalizado tipo zenit.app/ref/TUCODIGO para compartir donde quieras.' },
            { num: '03', titulo: 'Lo compartes', desc: 'Stories, DMs, grupos de WhatsApp, TikTok. Donde tengas audiencia.' },
            { num: '04', titulo: 'Ganas automático', desc: 'Cada vez que alguien pague usando tu link, $10.000 COP van a tu billetera.' },
          ].map((p, i) => (
            <div key={i} className="flex gap-4 bg-zenit-navy-mid rounded-2xl p-5 border border-zenit-amber/10">
              <span className="font-serif text-zenit-amber/40 text-sm flex-shrink-0 pt-0.5 w-6">{p.num}</span>
              <div>
                <p className="font-semibold text-zenit-cream text-sm mb-1">{p.titulo}</p>
                <p className="text-zenit-cream/50 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Potencial de ingresos */}
      <section className="px-6 pb-10 max-w-lg mx-auto">
        <div className="bg-zenit-navy-mid rounded-3xl p-6 border border-zenit-amber/20">
          <p className="text-xs font-semibold text-zenit-amber/60 tracking-widest uppercase mb-5 text-center">Potencial de ingresos</p>
          <div className="space-y-3">
            {[
              { ventas: 5, ingreso: '50.000' },
              { ventas: 20, ingreso: '200.000' },
              { ventas: 50, ingreso: '500.000' },
              { ventas: 100, ingreso: '1.000.000' },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-zenit-navy last:border-0">
                <span className="text-zenit-cream/50 text-sm">{r.ventas} personas que pagan</span>
                <span className="font-serif text-zenit-amber font-semibold">${r.ingreso} COP</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-zenit-cream/30 mt-4">$10.000 por venta · Pago mensual</p>
        </div>
      </section>

      {/* FAQ rápido */}
      <section className="px-6 pb-10 max-w-lg mx-auto space-y-3">
        {[
          { q: '¿Necesito haber comprado el reporte?', a: 'No. Cualquiera puede unirse al programa.' },
          { q: '¿Cuándo me pagan?', a: 'Puedes solicitar tu retiro desde tu panel cuando acumules mínimo $10.000 COP. Transferimos en 1-3 días hábiles.' },
          { q: '¿Hay un límite de referidos?', a: 'No. Puedes referir a tantas personas como quieras.' },
        ].map((f, i) => (
          <div key={i} className="bg-zenit-navy-mid rounded-2xl p-4 border border-zenit-navy">
            <p className="font-semibold text-sm text-zenit-cream mb-1">{f.q}</p>
            <p className="text-zenit-cream/50 text-sm">{f.a}</p>
          </div>
        ))}
      </section>

      {/* CTA final */}
      <section className="px-6 pb-16 max-w-lg mx-auto">
        <button
          onClick={() => router.push('/afiliados/unirse')}
          className="w-full py-5 rounded-2xl text-zenit-navy font-bold text-xl bg-zenit-amber hover:opacity-90 transition-opacity">
          Crear mi cuenta gratis →
        </button>
        <p className="text-center mt-4 text-xs text-zenit-cream/30">
          ¿Ya tienes cuenta?{' '}
          <a href="/afiliados/login" className="text-zenit-amber hover:underline">Entra aquí</a>
        </p>
      </section>

    </div>
  )
}
