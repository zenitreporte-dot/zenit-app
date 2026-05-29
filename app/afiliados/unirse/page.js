'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function UnirseProgramaContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')

  const [paso, setPaso] = useState('cargando')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [codigoSugerido, setCodigoSugerido] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [codigoFinal, setCodigoFinal] = useState('')

  useEffect(() => {
    if (!sessionId) {
      setPaso('formulario')
      return
    }

    fetch(`/api/afiliados/codigo?session_id=${sessionId}`)
      .then(r => r.json())
      .then(d => {
        if (d.codigo) {
          router.replace(`/afiliados/${d.codigo}`)
        } else {
          setPaso('formulario')
        }
      })
      .catch(() => setPaso('formulario'))
  }, [sessionId])

  async function handleRegistro(e) {
    e.preventDefault()
    if (!nombre.trim() || !email.trim() || !password.trim()) { setError('Completa todos los campos'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setEnviando(true)
    setError('')

    try {
      const res = await fetch('/api/afiliados/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          nombre: nombre.trim(),
          email: email.trim(),
          password: password.trim(),
          codigo: codigoSugerido.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setCodigoFinal(data.codigo)
      setPaso('exito')
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://zenit.app'
  const linkAfiliado = `${baseUrl}/ref/${codigoFinal}`

  if (paso === 'cargando') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zenit-navy">
        <div className="w-10 h-10 border-4 border-zenit-amber border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (paso === 'exito') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-zenit-navy">
        <div className="bg-zenit-navy-mid rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-zenit-amber/20">
          <h1 className="font-serif text-2xl text-zenit-cream mb-2">¡Ya eres afiliado!</h1>
          <p className="text-zenit-cream/50 mb-6">Tu link único está listo para compartir</p>

          <div className="bg-zenit-navy rounded-2xl p-4 mb-6 border border-zenit-amber/20">
            <p className="text-xs text-zenit-cream/30 mb-2">Tu link de referido</p>
            <p className="font-mono text-sm font-bold break-all text-zenit-amber">{linkAfiliado}</p>
          </div>

          <button
            onClick={() => { navigator.clipboard.writeText(linkAfiliado) }}
            className="w-full py-3 rounded-2xl text-zenit-navy font-bold mb-3 bg-zenit-amber">
            Copiar link
          </button>

          <button
            onClick={() => router.push(`/afiliados/${codigoFinal}`)}
            className="w-full py-3 rounded-2xl font-semibold border-2 text-zenit-amber"
            style={{ borderColor: '#c9a84c' }}>
            Ver mi panel completo →
          </button>
        </div>
      </div>
    )
  }

  if (paso === 'info') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-zenit-navy">
        <div className="bg-zenit-navy-mid rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-zenit-amber/10">
          <h1 className="font-serif text-2xl text-zenit-cream mb-2">Programa de Afiliados</h1>
          <p className="text-zenit-cream/60 mb-6">Gana <strong className="text-zenit-amber">$10.000 COP</strong> por cada persona que pague usando tu link</p>
          <p className="text-sm text-zenit-cream/30">Para unirte necesitas haber comprado tu reporte primero.</p>
          <a href="/formulario" className="inline-block mt-6 px-6 py-3 rounded-2xl text-zenit-navy font-bold bg-zenit-amber">
            Hacer el test →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-zenit-navy">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-zenit-cream mb-1">Únete al programa de afiliados</h1>
          <p className="text-zenit-cream/60">Gana <strong className="text-zenit-amber">$10.000 COP</strong> por cada persona que pague usando tu link</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { num: '01', texto: 'Link único\npermanente' },
            { num: '02', texto: '$10.000 COP\npor venta' },
            { num: '03', texto: 'Panel con\nestadísticas' },
          ].map(b => (
            <div key={b.texto} className="bg-zenit-navy-mid rounded-2xl p-3 text-center border border-zenit-amber/10">
              <p className="font-serif text-zenit-amber/40 text-sm mb-1">{b.num}</p>
              <p className="text-xs text-zenit-cream/50 whitespace-pre-line">{b.texto}</p>
            </div>
          ))}
        </div>

        <div className="bg-zenit-navy-mid rounded-3xl p-6 border border-zenit-amber/10">
          <form onSubmit={handleRegistro} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-zenit-cream/70 block mb-1">Tu nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Valentina Torres"
                className="w-full border-2 border-zenit-navy rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zenit-amber bg-zenit-navy text-zenit-cream placeholder-zenit-cream/30"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-zenit-cream/70 block mb-1">Tu email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full border-2 border-zenit-navy rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zenit-amber bg-zenit-navy text-zenit-cream placeholder-zenit-cream/30"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-zenit-cream/70 block mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full border-2 border-zenit-navy rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zenit-amber bg-zenit-navy text-zenit-cream placeholder-zenit-cream/30"
                required
              />
              <p className="text-xs text-zenit-cream/30 mt-1">Para entrar a tu panel y ver tus ventas</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-zenit-cream/70 block mb-1">
                Código personalizado <span className="text-zenit-cream/30 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={codigoSugerido}
                onChange={e => setCodigoSugerido(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
                placeholder="Ej: VALE2024"
                className="w-full border-2 border-zenit-navy rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zenit-amber bg-zenit-navy text-zenit-cream placeholder-zenit-cream/30 font-mono"
              />
              {codigoSugerido && (
                <p className="text-xs text-zenit-cream/30 mt-1">
                  Tu link será: <span className="font-mono text-zenit-amber">zenit.app/ref/{codigoSugerido}</span>
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="w-full py-4 rounded-2xl text-zenit-navy font-bold text-base disabled:opacity-60 bg-zenit-amber">
              {enviando ? 'Creando tu link...' : 'Obtener mi link de afiliado'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function UnirseProgramaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zenit-navy">
        <div className="w-10 h-10 border-4 border-zenit-amber border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <UnirseProgramaContent />
    </Suspense>
  )
}
