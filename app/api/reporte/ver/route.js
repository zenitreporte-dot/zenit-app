// ============================================================
// API: Obtener el reporte completo de una sesión
// GET /api/reporte/ver?session_id=xxx
// Verifica que la sesión esté pagada antes de devolver el reporte
// ============================================================
import { createServerClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id requerido' }, { status: 400 })
  }

  const supabase = createServerClient()

  // Verificar que la sesión existe y está pagada
  const { data: sesion } = await supabase
    .from('form_sessions')
    .select('id, paid')
    .eq('id', sessionId)
    .single()

  if (!sesion) {
    return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
  }

  if (!sesion.paid) {
    return NextResponse.json({ error: 'Sesión no pagada. Completa el pago para ver el reporte.' }, { status: 403 })
  }

  // Obtener el reporte
  const { data: reporte, error } = await supabase
    .from('reports')
    .select('id, content, model_used, generated_at')
    .eq('session_id', sessionId)
    .single()

  if (error || !reporte) {
    // El reporte aún se está generando
    return NextResponse.json({ error: 'El reporte aún se está generando. Espera unos segundos.' }, { status: 404 })
  }

  return NextResponse.json(reporte)
}
