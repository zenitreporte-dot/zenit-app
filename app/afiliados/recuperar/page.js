'use client'
import { useState } from 'react'
import { ZenitLogo } from '@/components/LogoZenit'

export default function RecuperarContrasena() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      await fetch('/api/afiliados/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setEnviado(true)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-zenit-navy">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <ZenitLogo size={36} />
          </div>
          <h1 className="font-serif text-2xl text-zenit-cream mb-1">Recuperar contraseña</h1>
          <p className="text-zenit-cream/40 text-sm">Te enviamos un link a tu email</p>
        </div>

        {enviado ? (
          <div className="bg-zenit-navy-mid rounded-3xl p-6 border border-zenit-amber/10 text-center">
            <p className="text-4xl mb-4">📬</p>
            <p className="text-zenit-cream font-semibold mb-2">Revisa tu email</p>
            <p className="text-zenit-cream/50 text-sm">Si tu email está registrado, te llegará un link para crear una nueva contraseña. Expira en 1 hora.</p>
            <a href="/afiliados/login" className="block mt-6 text-zenit-amber text-sm hover:underline">
              Volver al login
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-zenit-navy-mid rounded-3xl p-6 border border-zenit-amber/10 space-y-4">
            <div>
              <label className="text-xs font-semibold text-zenit-cream/50 block mb-1.5">Tu email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full bg-zenit-navy border border-zenit-navy-mid rounded-xl px-4 py-3 text-sm text-zenit-cream placeholder-zenit-cream/20 focus:outline-none focus:border-zenit-amber/40"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3.5 rounded-full text-zenit-navy font-bold text-sm disabled:opacity-60 bg-zenit-amber">
              {cargando ? 'Enviando...' : 'Enviar link de recuperación →'}
            </button>

            <a href="/afiliados/login" className="block text-center text-zenit-cream/30 text-xs hover:text-zenit-cream/50">
              Volver al login
            </a>
          </form>
        )}
      </div>
    </div>
  )
}
