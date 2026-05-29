// ============================================================
// API: Solicitar retiro de comisiones
// POST /api/afiliados/retiro
// Body: { codigo, metodo, datos_pago }
//   OR: { session_id, metodo, datos_pago }  ← retrocompat
// ============================================================
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

const MONTO_MINIMO = 10000 // COP

export async function POST(request) {
  try {
    // Verificar autenticación por cookie af_session
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('af_session')?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    const [cookieCodigo, cookieToken] = sessionCookie.split(':')
    if (!cookieCodigo || !cookieToken) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
    }

    const supabase = createServerClient()

    // Verificar token en DB
    const { data: afiliadoAuth } = await supabase
      .from('affiliate_codes')
      .select('codigo, session_token')
      .eq('codigo', cookieCodigo)
      .single()

    if (!afiliadoAuth || afiliadoAuth.session_token !== cookieToken) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
    }

    const body = await request.json()
    const { metodo, datos_pago } = body

    if (!metodo || !datos_pago) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // El código viene de la cookie autenticada, no del body
    const codigo = cookieCodigo

    // Calcular saldo disponible
    const { data: comisiones } = await supabase
      .from('commissions')
      .select('amount')
      .eq('affiliate_codigo', codigo)

    const totalGanado = comisiones?.reduce((s, c) => s + (c.amount || 0), 0) || 0

    const { data: retiros } = await supabase
      .from('withdrawal_requests')
      .select('amount, status')
      .eq('affiliate_codigo', codigo)
      .neq('status', 'rejected')

    const totalSolicitado = retiros?.reduce((s, r) => s + (r.amount || 0), 0) || 0
    const disponible = totalGanado - totalSolicitado

    if (disponible < MONTO_MINIMO) {
      return NextResponse.json(
        { error: `Saldo insuficiente. Mínimo para retirar: $${MONTO_MINIMO.toLocaleString('es-CO')} COP` },
        { status: 400 }
      )
    }

    // Verificar que no tenga un retiro pendiente
    const tienePendiente = retiros?.some(r => r.status === 'pending')
    if (tienePendiente) {
      return NextResponse.json(
        { error: 'Ya tienes una solicitud de retiro pendiente' },
        { status: 400 }
      )
    }

    // Buscar datos del afiliado para el email
    const { data: afiliadoData } = await supabase
      .from('affiliate_codes')
      .select('nombre, email')
      .eq('codigo', codigo)
      .single()

    // Crear solicitud de retiro
    const { error } = await supabase
      .from('withdrawal_requests')
      .insert({
        affiliate_codigo: codigo,
        amount: disponible,
        metodo,
        datos_pago,
        status: 'pending',
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Notificaciones manejadas por Make (webhook automático en Supabase)

    return NextResponse.json({ ok: true, monto: disponible })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
