'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { ZenitLogo } from '@/components/LogoZenit'

function NuevaContrasenaForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [listo, setListo] = useState(false)

  useEffect(() => {
    if (!token) setError('Link inválido. Solicita uno nuevo.')
  }, [token])

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirmar) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return }
    setCargando(true)
    setError('')
    try {
      const res = await fetch('/api/afiliados/nueva-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setListo(true)
      setTimeout(() => router.push('/afiliados/login'), 2500)
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
          <h1 className="font-serif text-2xl text-zenit-cream mb-1">Nueva contraseña</h1>
          <p className="text-zenit-cream/40 text-sm">Elige una contraseña segura</p>
        </div>

        {listo ? (
          <div className="bg-zenit-navy-mid rounded-3xl p-6 border border-zenit-amber/10 text-center">
            <p className="text-4xl mb-4">✅</p>
            <p className="text-zenit-cream font-semibold mb-2">¡Contraseña actualizada!</p>
            <p className="text-zenit-cream/50 text-sm">Redirigiendo al login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-zenit-navy-mid rounded-3xl p-6 border border-zenit-amber/10 space-y-4">
            <div>
              <label className="text-xs font-semibold text-zenit-cream/50 block mb-1.5">Nueva contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="w-full bg-zenit-navy border border-zenit-navy-mid rounded-xl px-4 py-3 text-sm text-zenit-cream placeholder-zenit-cream/20 focus:outline-none focus:border-zenit-amber/40"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zenit-cream/50 block mb-1.5">Confirmar contraseña</label>
              <input
                type="password"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                placeholder="Repite la contraseña"
                required
                className="w-full bg-zenit-navy border border-zenit-navy-mid rounded-xl px-4 py-3 text-sm text-zenit-cream placeholder-zenit-cream/20 focus:outline-none focus:border-zenit-amber/40"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={cargando || !token}
              className="w-full py-3.5 rounded-full text-zenit-navy font-bold text-sm disabled:opacity-60 bg-zenit-amber">
              {cargando ? 'Guardando...' : 'Guardar nueva contraseña →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zenit-navy" />}>
      <NuevaContrasenaForm />
    </Suspense>
  )
}
