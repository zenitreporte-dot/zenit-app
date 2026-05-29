// ============================================================
// API: Verificar si el reporte de una sesión ya fue generado
// GET /api/reporte/estado?session_id=xxx
// Usado por la página de éxito para hacer polling
// ============================================================
import { createServerClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ listo: false })
  }

  const supabase = createServerClient()

  // Verificar si existe un reporte para esta sesión
  const { data } = await supabase
    .from('reports')
    .select('id')
    .eq('session_id', sessionId)
    .single()

  return NextResponse.json({ listo: !!data })
}
