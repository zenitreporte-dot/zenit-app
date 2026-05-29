'use client'
// ============================================================
// /panel?session_id=xxx  →  redirige al nuevo sistema de afiliados
// ============================================================
import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function PanelRedirect() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      router.replace('/afiliados/unirse')
      return
    }

    // Buscar si ya tiene código de afiliado
    fetch(`/api/afiliados/codigo?session_id=${sessionId}`)
      .then(r => r.json())
      .then(d => {
        if (d.codigo) {
          // Ya es afiliado → ir a su panel
          router.replace(`/afiliados/${d.codigo}`)
        } else {
          // No es afiliado → ir a registrarse
          router.replace(`/afiliados/unirse?session_id=${sessionId}`)
        }
      })
      .catch(() => router.replace(`/afiliados/unirse?session_id=${sessionId}`))
  }, [sessionId])

  return (
    <div className="min-h-screen flex items-center justify-center" className="bg-zenit-navy">
      <div className="w-10 h-10 border-4 border-zenit-amber border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function PanelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" className="bg-zenit-navy">
        <div className="w-10 h-10 border-4 border-zenit-amber border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PanelRedirect />
    </Suspense>
  )
}
