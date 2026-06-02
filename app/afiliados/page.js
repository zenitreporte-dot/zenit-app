'use client'
import Link from 'next/link'
import { ZenitLogo } from '@/components/LogoZenit'

export default function LandingAfiliados() {
  return (
    <div className="min-h-screen bg-zenit-navy text-zenit-cream">

      {/* NAV */}
      <nav className="px-6 py-5 flex items-center justify-between border-b border-zenit-navy-mid">
        <ZenitLogo size={28} />
        <Link href="/afiliados/unirse"
          className="text-sm font-semibold px-5 py-2 rounded-full bg-zenit-amber text-zenit-navy hover:opacity-90 transition-opacity">
          Quiero ser afiliado →
        </Link>
      </nav>

      {/* HERO */}
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-zenit-amber text-xs font-bold uppercase tracking-widest mb-4">Programa de afiliados</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-zenit-cream leading-tight mb-6">
          Gana dinero compartiendo algo que cambia vidas
        </h1>
        <p className="text-zenit-cream/60 text-lg mb-10 leading-relaxed">
          Cada vez que alguien compra su reporte usando tu link, ganas el <strong className="text-zenit-amber">40% de la venta</strong>. Sin inversión, sin inventario, sin límite de ventas.
        </p>
        <Link href="/afiliados/unirse"
          className="inline-block px-10 py-4 rounded-full bg-zenit-amber text-zenit-navy font-bold text-lg hover:opacity-90 transition-opacity">
          Comenzar a ganar →
        </Link>
        <p className="mt-4 text-zenit-cream/30 text-sm">Gratis · Sin compromisos · 40% de comisión por venta</p>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="max-w-2xl mx-auto px-6 py-16 border-t border-zenit-navy-mid">
        <h2 className="font-serif text-2xl text-center mb-12">Así de simple</h2>
        <div className="space-y-8">
          {[
            {
              num: '01',
              titulo: 'Te registras gratis',
              desc: 'Creas tu cuenta en segundos. Recibes un link único y personalizado con tu código.',
            },
            {
              num: '02',
              titulo: 'Compartes tu link',
              desc: 'Por Instagram, WhatsApp, TikTok, donde sea. Cada vez que alguien hace clic en tu link y compra, la venta queda registrada a tu nombre.',
            },
            {
              num: '03',
              titulo: 'Acumulas comisiones',
              desc: 'Cada venta te genera el 40% ($10.000 COP). Puedes ver tu saldo en tiempo real desde tu panel.',
            },
            {
              num: '04',
              titulo: 'Solicitas tu retiro',
              desc: 'Cuando acumulas $50.000 COP (5 ventas), solicitas tu pago por Nequi, Bancolombia o el método que prefieras.',
            },
          ].map(paso => (
            <div key={paso.num} className="flex gap-6 items-start">
              <span className="font-serif text-3xl text-zenit-amber/30 w-12 flex-shrink-0">{paso.num}</span>
              <div>
                <h3 className="font-sans font-bold text-zenit-cream mb-1">{paso.titulo}</h3>
                <p className="text-zenit-cream/50 text-sm leading-relaxed">{paso.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NÚMEROS */}
      <section className="bg-zenit-navy-mid py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl text-center mb-12">El modelo de negocio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-10">
            {[
              { valor: '40%', label: 'de comisión', sub: '$10.000 por venta' },
              { valor: '$50.000', label: 'mínimo para retirar', sub: '5 ventas' },
              { valor: 'Sin límite', label: 'de ventas', sub: 'cuántas quieras' },
            ].map((stat, i) => (
              <div key={i} className="bg-zenit-navy rounded-2xl p-6 border border-zenit-amber/10">
                <p className="font-serif text-3xl text-zenit-amber mb-1">{stat.valor}</p>
                <p className="text-zenit-cream/70 text-sm font-semibold">{stat.label}</p>
                <p className="text-zenit-cream/30 text-xs mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Calculadora simple */}
          <div className="bg-zenit-navy rounded-2xl p-6 border border-zenit-amber/20">
            <p className="text-xs font-bold uppercase tracking-widest text-zenit-amber/60 mb-4">Ejemplo real</p>
            <div className="space-y-3 text-sm">
              {[
                { ventas: '5 ventas', ganancia: '$50.000 COP', extra: '→ primer retiro disponible' },
                { ventas: '20 ventas', ganancia: '$200.000 COP', extra: '→ en un mes promocionando' },
                { ventas: '50 ventas', ganancia: '$500.000 COP', extra: '→ ingreso pasivo real' },
              ].map((ej, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-zenit-navy-mid last:border-0">
                  <span className="text-zenit-cream/60">{ej.ventas}</span>
                  <span className="font-bold text-zenit-amber">{ej.ganancia}</span>
                  <span className="text-zenit-cream/30 text-xs hidden sm:block">{ej.extra}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POR QUÉ FUNCIONA */}
      <section className="max-w-2xl mx-auto px-6 py-16 border-t border-zenit-navy-mid">
        <h2 className="font-serif text-2xl text-center mb-10">Por qué es fácil de vender</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { titulo: 'Fácil de recomendar', desc: 'Es algo que genuinamente ayuda. Eso hace que la gente quiera compartirlo.' },
            { titulo: 'Precio accesible', desc: '$25.000 COP es menos que una salida. La barrera de entrada es mínima.' },
            { titulo: 'Resultado inmediato', desc: 'Quien compra recibe su reporte en minutos. Eso genera confianza y recomendaciones.' },
            { titulo: 'Contenido listo para usar', desc: 'No necesitas crear nada. Tu link es todo lo que necesitas para empezar.' },
          ].map((item, i) => (
            <div key={i} className="bg-zenit-navy-mid rounded-2xl p-5 border border-zenit-amber/10">
              <h3 className="font-sans font-bold text-zenit-amber text-sm mb-2">{item.titulo}</h3>
              <p className="text-zenit-cream/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-16 border-t border-zenit-navy-mid">
        <h2 className="font-serif text-2xl text-center mb-10">Preguntas frecuentes</h2>
        <div className="space-y-6">
          {[
            { q: '¿Cuánto cuesta unirse?', a: 'Nada. El programa de afiliados es completamente gratuito.' },
            { q: '¿Cómo sé que mis ventas se registran?', a: 'Cada link tiene tu código único. Puedes ver tus ventas en tiempo real desde tu panel de afiliado.' },
            { q: '¿Cuándo y cómo me pagan?', a: 'Cuando acumulas $50.000 COP puedes solicitar tu retiro. Pagamos por Nequi, Bancolombia u otro método acordado.' },
            { q: '¿Hay un límite de cuánto puedo ganar?', a: 'No. Mientras más ventas generes, más ganas. No hay techo.' },
            { q: '¿Necesito ser cliente primero?', a: 'No es obligatorio, pero si vives el producto es más fácil recomendarlo con autenticidad.' },
          ].map((faq, i) => (
            <div key={i} className="border-b border-zenit-navy-mid pb-6 last:border-0">
              <p className="font-sans font-bold text-zenit-cream mb-2">{faq.q}</p>
              <p className="text-zenit-cream/50 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-zenit-navy-mid py-16 px-6 text-center">
        <h2 className="font-serif text-3xl text-zenit-cream mb-4">Empieza hoy, gratis</h2>
        <p className="text-zenit-cream/50 mb-8 max-w-md mx-auto">
          Regístrate en 2 minutos y recibe tu link de afiliado. No necesitas experiencia ni inversión.
        </p>
        <Link href="/afiliados/unirse"
          className="inline-block px-10 py-4 rounded-full bg-zenit-amber text-zenit-navy font-bold text-lg hover:opacity-90 transition-opacity">
          Quiero mi link de afiliado →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 border-t border-zenit-navy-mid text-center">
        <ZenitLogo size={24} />
        <p className="text-zenit-cream/20 text-xs mt-3">© 2026 Zenit · Todos los derechos reservados</p>
      </footer>

    </div>
  )
}
