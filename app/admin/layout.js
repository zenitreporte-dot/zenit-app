'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin',             label: 'Dashboard',   icon: '▲' },
  { href: '/admin/compradores', label: 'Compradores', icon: '◈' },
  { href: '/admin/afiliados',   label: 'Afiliados',   icon: '◉' },
  { href: '/admin/retiros',     label: 'Retiros',     icon: '◎' },
  { href: '/admin/tareas',      label: 'Tareas',      icon: '◻' },
  { href: '/admin/marketing',   label: 'Marketing',   icon: '◆' },
]

function LoginScreen({ onLogin }) {
  const [pass, setPass]   = useState('')
  const [error, setError] = useState(false)

  function intentar(e) {
    e.preventDefault()
    if (pass === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      sessionStorage.setItem('admin_ok', '1')
      onLogin()
    } else {
      setError(true)
      setPass('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-zenit-navy">
      <div className="bg-zenit-navy-mid rounded-2xl border border-zenit-amber/20 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-serif text-3xl text-zenit-amber mb-2">Z</p>
          <h1 className="font-serif text-xl text-zenit-cream">Zenit Admin</h1>
          <p className="text-sm text-zenit-cream/30 mt-1">Acceso restringido</p>
        </div>
        <form onSubmit={intentar} className="space-y-4">
          <input
            type="password"
            value={pass}
            onChange={e => { setPass(e.target.value); setError(false) }}
            placeholder="Contraseña"
            className="w-full bg-zenit-navy border border-zenit-navy-mid rounded-xl px-4 py-3 text-sm text-zenit-cream placeholder-zenit-cream/20 focus:outline-none focus:border-zenit-amber/40"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs">Contraseña incorrecta</p>}
          <button type="submit" className="w-full py-3 rounded-xl font-bold text-sm text-zenit-navy bg-zenit-amber">
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }) {
  const [autenticado, setAutenticado] = useState(false)
  const [checking, setChecking]       = useState(true)
  const [pendingRetiros, setPendingRetiros] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    if (sessionStorage.getItem('admin_ok') === '1') setAutenticado(true)
    setChecking(false)
  }, [])

  useEffect(() => {
    if (!autenticado) return
    fetch(`/api/admin/stats?secret=${process.env.NEXT_PUBLIC_ADMIN_SECRET}`)
      .then(r => r.json())
      .then(d => setPendingRetiros(d?.retirosPendientes?.length || 0))
      .catch(() => {})
  }, [autenticado])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zenit-navy">
        <div className="w-10 h-10 border-4 border-zenit-amber border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!autenticado) return <LoginScreen onLogin={() => setAutenticado(true)} />

  function isActive(href) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex min-h-screen bg-zenit-navy">

      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 z-20 bg-zenit-navy-mid border-r border-zenit-amber/10">
        <div className="px-6 py-6 border-b border-zenit-amber/10">
          <p className="font-serif text-zenit-amber text-lg">Zenit</p>
          <p className="text-zenit-cream/30 text-xs mt-0.5">Panel Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all relative"
              style={{
                backgroundColor: isActive(item.href) ? 'rgba(201,168,76,0.15)' : 'transparent',
                color: isActive(item.href) ? '#c9a84c' : 'rgba(245,240,232,0.4)',
              }}
            >
              <span className="text-xs">{item.icon}</span>
              <span>{item.label}</span>
              {item.href === '/admin/retiros' && pendingRetiros > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {pendingRetiros}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-zenit-amber/10">
          <button onClick={() => window.location.reload()} className="text-xs text-zenit-cream/20 hover:text-zenit-cream/50 transition-colors">
            ↻ Actualizar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-56 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-zenit-navy-mid border-t border-zenit-amber/10 flex" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center py-2 relative"
            style={{ color: isActive(item.href) ? '#c9a84c' : 'rgba(245,240,232,0.3)' }}
          >
            <span className="text-base">{item.icon}</span>
            <span className="text-[9px] font-medium mt-0.5">{item.label}</span>
            {item.href === '/admin/retiros' && pendingRetiros > 0 && (
              <span className="absolute top-1 right-[calc(50%-14px)] bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                {pendingRetiros}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}
