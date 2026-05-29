import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const codigo = searchParams.get('codigo')

  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('af_session')?.value

  if (!sessionCookie) {
    return NextResponse.json({ autorizado: false, razon: 'sin_sesion' })
  }

  const [cookieCodigo, cookieToken] = sessionCookie.split(':')

  if (!cookieCodigo || !cookieToken) {
    return NextResponse.json({ autorizado: false, razon: 'cookie_invalida' })
  }

  // Si se pasa un código específico, verificar que coincide
  if (codigo && cookieCodigo !== codigo) {
    return NextResponse.json({ autorizado: false, razon: 'codigo_diferente', propiocodigo: cookieCodigo })
  }

  const supabase = createServerClient()
  const { data: afiliado } = await supabase
    .from('affiliate_codes')
    .select('codigo, nombre, session_token')
    .eq('codigo', cookieCodigo)
    .single()

  if (!afiliado || afiliado.session_token !== cookieToken) {
    return NextResponse.json({ autorizado: false, razon: 'token_invalido' })
  }

  return NextResponse.json({ autorizado: true, codigo: afiliado.codigo, nombre: afiliado.nombre })
}
