'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ZenitLogo } from '@/components/LogoZenit'

export default function LandingPage() {
  return (
    <main className="bg-zenit-navy overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-zenit-navy/90 backdrop-blur border-b border-zenit-navy-mid">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <ZenitLogo size={24} className="text-zenit-amber" />
          <Link
            href="/formulario"
            className="text-sm font-semibold px-4 py-2 rounded-full text-zenit-navy transition-opacity hover:opacity-90 bg-zenit-amber"
          >
            Comenzar →
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative py-24 px-5 text-center overflow-hidden bg-zenit-navy">
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-5 bg-zenit-amber" />
        <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full opacity-5 bg-zenit-amber" />

        <div className="relative max-w-2xl mx-auto">
          <div className="inline-block text-xs font-semibold tracking-widest px-4 py-1.5 rounded-full mb-6 bg-zenit-navy-mid text-zenit-amber border border-zenit-amber/20">
            REPORTE DE PROPÓSITO DE VIDA · IA
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl text-zenit-cream leading-tight mb-5">
            Descubre a qué viniste<br className="hidden sm:block" />
            <span className="text-zenit-amber"> a este mundo.</span>
          </h1>

          <p className="text-lg text-zenit-cream/70 mb-8 leading-relaxed max-w-lg mx-auto">
            Responde 20 preguntas. La IA analiza todo y te entrega
            un reporte 100% tuyo con tu propósito de vida, tus fortalezas
            reales y una hoja de ruta a 180 días.
          </p>

          <Link
            href="/formulario"
            className="inline-block px-8 py-4 rounded-full text-base font-bold text-zenit-navy shadow-lg transition-transform hover:scale-105 bg-zenit-amber"
          >
            Quiero conocerme · $25.000
          </Link>

          <p className="mt-4 text-zenit-cream/50 text-sm">
            Descarga inmediata en PDF · Sin suscripción · Tuyo para siempre
          </p>

          <div className="mt-10 flex items-center justify-center gap-6 text-zenit-cream/50 text-sm flex-wrap">
            <span>★★★★★ 4.9/5</span>
            <span className="opacity-40">|</span>
            <span>+500 reportes generados</span>
            <span className="opacity-40">|</span>
            <span>Análisis listo en &lt; 2 min</span>
          </div>
        </div>
      </section>

      {/* ── PROBLEMA ────────────────────────────────── */}
      <section className="py-16 px-5 bg-zenit-navy-mid">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-zenit-cream mb-4">
            ¿Te suena esto familiar?
          </h2>
          <p className="text-zenit-cream/50 mb-10">
            Si respondiste sí a alguno de estos, no estás solo.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {[
              'Sabes que podrías hacer algo más significativo, pero no sabes exactamente qué.',
              'Llevas años en un trabajo o carrera que no te llena, pero tienes miedo de cambiar.',
              'Te bloqueas cuando alguien te pregunta "¿qué te apasiona?" o "¿cuál es tu talento?"',
              'Has tomado cursos, leído libros de autoayuda, pero sigues sin claridad real.',
            ].map((texto, i) => (
              <div key={i} className="flex gap-4 bg-zenit-navy rounded-2xl p-5 border border-zenit-navy-mid">
                <span className="text-zenit-amber/40 font-serif flex-shrink-0 mt-0.5">—</span>
                <p className="text-zenit-cream/70 text-sm leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl p-6 text-left bg-zenit-navy border border-zenit-amber/20">
            <p className="font-semibold mb-2 text-zenit-amber">La buena noticia:</p>
            <p className="text-zenit-cream/70 leading-relaxed">
              No es que no tengas propósito — es que nadie te ha hecho las preguntas correctas.
              Zenit usa IA para analizar tus respuestas y revelar patrones que tú mismo no habías visto.
            </p>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ───────────────────────────── */}
      <section className="py-16 px-5 bg-zenit-navy">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl text-zenit-cream mb-3">
              Así de simple funciona
            </h2>
            <p className="text-zenit-cream/50">Sin apps, sin cuentas, sin complicaciones.</p>
          </div>

          <div className="relative">
            <div className="hidden sm:block absolute left-8 top-8 bottom-8 w-0.5 bg-zenit-navy-mid" />
            <div className="space-y-6">
              {[
                {
                  num: '1',
                  titulo: 'Responde 20 preguntas',
                  desc: 'Preguntas diseñadas para revelar lo que realmente te mueve: lo que amas, en lo que destacas, cómo quieres impactar al mundo. Tómate 15-20 minutos para responder con honestidad.',
                },
                {
                  num: '2',
                  titulo: 'La IA analiza tu perfil completo',
                  desc: 'Una IA de última generación lee cada una de tus respuestas, detecta patrones, contradicciones y fortalezas que no son obvias, y construye tu mapa personal de propósito.',
                },
                {
                  num: '3',
                  titulo: 'Recibe tu reporte personalizado',
                  desc: 'Un reporte en PDF con tu arquetipo único, análisis profundo de tus fortalezas, alertas de caminos equivocados, habilidades a desarrollar y tu hoja de ruta a 180 días.',
                },
              ].map((paso) => (
                <div key={paso.num} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-zenit-navy text-xl font-bold shadow-md bg-zenit-amber">
                    {paso.num}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-lg mb-1 text-zenit-cream">{paso.titulo}</h3>
                    <p className="text-zenit-cream/60 text-sm leading-relaxed">{paso.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/formulario"
              className="inline-block px-7 py-3 rounded-full text-sm font-semibold text-zenit-navy transition-opacity hover:opacity-90 bg-zenit-amber"
            >
              Comenzar →
            </Link>
          </div>
        </div>
      </section>

      {/* ── QUÉ INCLUYE ─────────────────────────────── */}
      <section className="py-16 px-5 bg-zenit-navy-mid">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl text-zenit-cream mb-3">
              Tu reporte incluye todo esto
            </h2>
            <p className="text-zenit-cream/50">No es un test de personalidad genérico. Cada oración aplica solo a ti.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { titulo: 'Tu Propósito Central', desc: 'Una descripción clara y personal de tu propósito, con frases que podrías haber dicho tú mismo.' },
              { titulo: 'Análisis de 4 Dimensiones', desc: 'Lo que amas, en lo que eres bueno, por lo que te pueden pagar y lo que el mundo necesita — citando tus respuestas.' },
              { titulo: '4 Intersecciones', desc: 'Tu Pasión, Misión, Vocación y Profesión específicas, con ejemplos concretos de tu vida.' },
              { titulo: 'Tu Arquetipo Único', desc: 'Un nombre y descripción de quién eres como agente de cambio. No "El Creativo" genérico — algo tuyo.' },
              { titulo: 'Alertas de Caminos Equivocados', desc: '3 rutas que parecen lógicas para tu perfil pero que probablemente te harían infeliz. Honesto y directo.' },
              { titulo: 'Hoja de Ruta a 180 Días', desc: 'Acciones concretas para 30, 90 y 180 días. No "sal de tu zona de confort" — cosas específicas que puedes hacer.' },
            ].map((item, i) => (
              <div key={i} className="bg-zenit-navy rounded-2xl p-5 border border-zenit-navy-mid flex gap-4">
                <span className="font-serif text-zenit-amber/30 text-sm flex-shrink-0 pt-0.5 w-5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-semibold mb-1 text-sm text-zenit-amber">{item.titulo}</h3>
                  <p className="text-zenit-cream/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CIERRE DE VALOR + PRECIO ─────────────────── */}
      <section className="py-16 px-5 bg-zenit-navy-mid">
        <div className="max-w-md mx-auto text-center">
          <p className="text-zenit-amber text-sm font-semibold tracking-widest mb-4">TODO INCLUIDO</p>

          <div className="bg-zenit-navy/60 rounded-2xl p-6 mb-8 text-left space-y-3 border border-zenit-amber/10">
            {[
              'Reporte completo de 6 secciones profundas',
              'Tu arquetipo único y propósito central',
              'Alertas de caminos que probablemente no son para ti',
              'Hoja de ruta de 180 días con acciones concretas',
              'Descarga inmediata en PDF — tuyo para siempre',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-zenit-cream/80 text-sm">
                <span className="text-zenit-amber">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/formulario"
            className="block w-full py-4 rounded-full text-base font-bold text-zenit-navy shadow-lg transition-transform hover:scale-105 text-center bg-zenit-amber"
          >
            Quiero conocerme · $25.000
          </Link>
          <p className="mt-3 text-zenit-cream/40 text-xs">
            Un solo pago · Pagas al finalizar · Mercado Pago · 100% seguro
          </p>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────── */}
      <section className="py-16 px-5 bg-zenit-navy">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl text-center text-zenit-cream mb-10">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: '¿Cuánto tiempo tarda?',
                a: 'El test tiene 20 preguntas y toma entre 15 y 25 minutos. El reporte se genera en menos de 2 minutos. En total, menos de media hora.',
              },
              {
                q: '¿Es realmente personalizado o es genérico?',
                a: 'Cada oración de tu reporte se genera a partir de tus respuestas específicas. La IA cita frases que escribiste, identifica patrones en tus palabras y no usa plantillas. Si comparas dos reportes, son completamente diferentes.',
              },
              {
                q: '¿Cuánto cuesta y cuándo pago?',
                a: 'El reporte cuesta $25.000 COP — un solo pago, sin suscripción. Pagas solo al finalizar el test, no antes. Si no llegas al final, no se te cobra nada.',
              },
              {
                q: '¿Necesito conocer alguna metodología para hacerlo?',
                a: 'No. El test está diseñado para cualquier persona. Las preguntas son naturales y conversacionales — no necesitas conocer ninguna metodología.',
              },
              {
                q: '¿Qué pasa si no quedo satisfecho con mi reporte?',
                a: 'Si sientes que el reporte no refleja quién eres, escríbenos y lo revisamos. La calidad del reporte depende de qué tan honesto seas en tus respuestas — entre más detallado, más preciso.',
              },
              {
                q: '¿Puedo compartir mi reporte?',
                a: 'Sí, el PDF es tuyo para siempre. Puedes imprimirlo, compartirlo o guardarlo. Sin restricciones.',
              },
            ].map((faq, i) => (
              <FAQItem key={i} pregunta={faq.q} respuesta={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────── */}
      <section className="py-16 px-5 text-center bg-zenit-navy-mid">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl text-zenit-cream mb-4">
            En 20 minutos puedes tener más claridad<br />de la que has tenido en años.
          </h2>
          <p className="text-zenit-cream/60 mb-8 leading-relaxed">
            Las preguntas que nadie te hizo — respondidas de una vez.
          </p>
          <Link
            href="/formulario"
            className="inline-block px-10 py-4 rounded-full text-base font-bold text-zenit-navy shadow-lg transition-transform hover:scale-105 bg-zenit-amber"
          >
            Quiero conocerme · $25.000
          </Link>
          <p className="mt-4 text-zenit-cream/40 text-sm">Sin suscripción · $25.000 COP · Descarga inmediata</p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="py-8 px-5 border-t border-zenit-navy-mid">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zenit-cream/40">
          <ZenitLogo size={20} className="text-zenit-amber" />
          <div className="flex gap-6">
            <Link href="/formulario" className="hover:text-zenit-cream transition-colors">Hacer el test</Link>
            <a href="mailto:hola@zenit.app" className="hover:text-zenit-cream transition-colors">Contacto</a>
            <Link href="/afiliados/login" className="hover:text-zenit-cream transition-colors">Panel de afiliados</Link>
          </div>
        </div>
      </footer>

    </main>
  )
}

function FAQItem({ pregunta, respuesta }) {
  const [abierto, setAbierto] = useState(false)
  return (
    <div className="border border-zenit-navy-mid rounded-2xl overflow-hidden">
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-zenit-navy-mid/50 transition-colors"
      >
        <span className="font-semibold text-sm text-zenit-cream">{pregunta}</span>
        <span
          className="flex-shrink-0 ml-4 text-lg transition-transform duration-200 text-zenit-amber"
          style={{ transform: abierto ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          +
        </span>
      </button>
      {abierto && (
        <div className="px-5 pb-5 text-sm text-zenit-cream/60 leading-relaxed border-t border-zenit-navy-mid pt-4">
          {respuesta}
        </div>
      )}
    </div>
  )
}
