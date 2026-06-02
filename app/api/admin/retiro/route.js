// ============================================================
// API: Aprobar o rechazar retiro de afiliado
// POST /api/admin/retiro
// Body: { secret, retiro_id, accion: 'paid' | 'rejected' }
// ============================================================
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET

export async function POST(request) {
  try {
    const { secret, retiro_id, accion } = await request.json()

    if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!['paid', 'rejected'].includes(accion)) {
      return NextResponse.json({ error: 'Acción inválida' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { error } = await supabase
      .from('withdrawal_requests')
      .update({ status: accion })
      .eq('id', retiro_id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
