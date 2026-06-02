'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ZenitLogo } from '@/components/LogoZenit'

export default function LoginAfiliado() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const res = await fetch('/api/afiliados/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      router.push(`/afiliados/${data.codigo}`)
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
          <h1 className="font-serif text-2xl text-zenit-cream mb-1">Accede a tu panel</h1>
          <p className="text-zenit-cream/40 text-sm">Programa de Afiliados · Zenit</p>
        </div>

        <form onSubmit={handleLogin} className="bg-zenit-navy-mid rounded-3xl p-6 border border-zenit-amber/10 space-y-4">
          <div>
            <label className="text-xs font-semibold text-zenit-cream/50 block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full bg-zenit-navy border border-zenit-navy-mid rounded-xl px-4 py-3 text-sm text-zenit-cream placeholder-zenit-cream/20 focus:outline-none focus:border-zenit-amber/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zenit-cream/50 block mb-1.5">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
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
            {cargando ? 'Entrando...' : 'Entrar a mi panel →'}
          </button>
        </form>

        <p className="text-center mt-6 text-zenit-cream/30 text-xs">
          ¿No tienes cuenta?{' '}
          <a href="/afiliados/unirse" className="text-zenit-amber hover:underline">Únete al programa</a>
        </p>
      </div>
    </div>
  )
}
