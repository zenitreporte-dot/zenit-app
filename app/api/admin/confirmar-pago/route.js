// ============================================================
// API: Confirmar pago manualmente (cuando webhook de MP falló)
// POST /api/admin/confirmar-pago
// Body: { secret, session_id, referred_by? }
// ============================================================
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'IKIGAI*23'

export async function POST(request) {
  try {
    const { secret, session_id, referred_by } = await request.json()

    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!session_id) {
      return NextResponse.json({ error: 'session_id requerido' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Obtener la sesión actual
    const { data: sesion, error: errSesion } = await supabase
      .from('form_sessions')
      .select('id, paid, referred_by, completed_at')
      .eq('id', session_id)
      .single()

    if (errSesion || !sesion) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
    }

    if (sesion.paid) {
      return NextResponse.json({ ok: true, msg: 'Ya estaba marcada como pagada' })
    }

    // Determinar referred_by: usar el del body si se provee, si no el de la sesión
    const codigoAfiliado = referred_by || sesion.referred_by

    // Actualizar sesión como pagada (y referred_by si se provee)
    const updateData = { paid: true }
    if (referred_by) updateData.referred_by = referred_by

    await supabase
      .from('form_sessions')
      .update(updateData)
      .eq('id', session_id)

    // Insertar registro de pago si no existe
    const { data: pagoExistente } = await supabase
      .from('payments')
      .select('id')
      .eq('session_id', session_id)
      .single()

    if (!pagoExistente) {
      await supabase.from('payments').insert({
        session_id,
        mp_status: 'approved',
        amount: 25000,
        confirmed_at: new Date().toISOString(),
        mp_payment_id: 'MANUAL',
      })
    } else {
      await supabase
        .from('payments')
        .update({ mp_status: 'approved', confirmed_at: new Date().toISOString() })
        .eq('session_id', session_id)
    }

    let comisionCreada = false

    // Crear comisión si hay afiliado y no existe ya
    if (codigoAfiliado) {
      const { data: comisionExistente } = await supabase
        .from('commissions')
        .select('id')
        .eq('buyer_session_id', session_id)
        .single()

      if (!comisionExistente) {
        const { error: errCom } = await supabase.from('commissions').insert({
          affiliate_codigo: codigoAfiliado,
          buyer_session_id: session_id,
          amount: 10000,
          status: 'pending',
        })
        comisionCreada = !errCom
      }
    }

    // Disparar generación de reporte si no existe
    const baseUrl = process.env.NEXT_PUBLIC_URL
    fetch(`${baseUrl}/api/reporte/generar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id }),
    }).catch(() => {})

    return NextResponse.json({
      ok: true,
      msg: 'Pago confirmado manualmente',
      comision: comisionCreada ? `Comisión creada para ${codigoAfiliado}` : 'Sin comisión',
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
