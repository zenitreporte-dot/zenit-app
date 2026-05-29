// ============================================================
// API: Buscar código de afiliado por session_id
// GET /api/afiliados/codigo?session_id=xxx
// Devuelve { codigo } si existe, o { codigo: null } si no.
// NO crea códigos automáticamente (eso lo hace /api/afiliados/registro)
// ============================================================
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'session_id requerido' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Buscar si ya tiene código (sin crear uno nuevo)
    const { data: existente } = await supabase
      .from('affiliate_codes')
      .select('codigo')
      .eq('session_id', sessionId)
      .single()

    return NextResponse.json({ codigo: existente?.codigo || null })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
