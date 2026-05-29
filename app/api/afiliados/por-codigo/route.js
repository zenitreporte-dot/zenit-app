// ============================================================
// API: Stats del afiliado por código (sin necesitar session_id)
// GET /api/afiliados/por-codigo?codigo=xxx
// ============================================================
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const codigo = searchParams.get('codigo')?.toUpperCase().trim()

    if (!codigo) {
      return NextResponse.json({ error: 'codigo requerido' }, { status: 400 })
    }

    // Verificar autenticación — solo el propio afiliado puede ver sus stats
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('af_session')?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    const [cookieCodigo, cookieToken] = sessionCookie.split(':')
    if (cookieCodigo !== codigo) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const supabase = createServerClient()

    // Verificar token en DB
    const { data: authCheck } = await supabase
      .from('affiliate_codes')
      .select('session_token')
      .eq('codigo', cookieCodigo)
      .single()
    if (!authCheck || authCheck.session_token !== cookieToken) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
    }

    // Buscar el afiliado
    const { data: afiliado } = await supabase
      .from('affiliate_codes')
      .select('codigo, nombre, email, created_at')
      .eq('codigo', codigo)
      .single()

    if (!afiliado) {
      return NextResponse.json({ error: 'Código no encontrado' }, { status: 404 })
    }

    // Clicks
    const { count: clicks } = await supabase
      .from('affiliate_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('codigo', codigo)

    // Comisiones
    const { data: comisiones } = await supabase
      .from('commissions')
      .select('amount, status, created_at')
      .eq('affiliate_codigo', codigo)
      .order('created_at', { ascending: false })

    const totalVentas = comisiones?.length || 0
    const totalGanado = comisiones?.reduce((s, c) => s + (c.amount || 0), 0) || 0

    // Retiros (excluir rechazados para saldo disponible)
    const { data: retiros } = await supabase
      .from('withdrawal_requests')
      .select('amount, status, metodo, datos_pago, created_at')
      .eq('affiliate_codigo', codigo)
      .order('created_at', { ascending: false })

    const totalSolicitado = retiros
      ?.filter(r => r.status !== 'rejected')
      .reduce((s, r) => s + (r.amount || 0), 0) || 0

    const disponible = Math.max(0, totalGanado - totalSolicitado)

    return NextResponse.json({
      afiliado: {
        codigo: afiliado.codigo,
        nombre: afiliado.nombre,
        email: afiliado.email,
        miembro_desde: afiliado.created_at,
      },
      stats: {
        clicks: clicks || 0,
        ventas: totalVentas,
        ganado: totalGanado,
        disponible,
      },
      retiros: retiros || [],
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
