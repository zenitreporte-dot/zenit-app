import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== (process.env.ADMIN_SECRET || 'IKIGAI*23')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = createServerClient()

  const { data: afiliados, error } = await supabase
    .from('affiliate_codes')
    .select('codigo, nombre, email, session_id, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: comisiones } = await supabase
    .from('commissions')
    .select('affiliate_codigo, amount, status')

  const { data: retiros } = await supabase
    .from('withdrawal_requests')
    .select('affiliate_codigo, amount, status')

  const { data: clicks } = await supabase
    .from('affiliate_clicks')
    .select('codigo')

  // Calcular stats por afiliado
  const resultado = (afiliados || []).map(a => {
    const comisA = comisiones?.filter(c => c.affiliate_codigo === a.codigo) || []
    const retirosA = retiros?.filter(r => r.affiliate_codigo === a.codigo && r.status !== 'rejected') || []
    const clicksA = clicks?.filter(c => c.codigo === a.codigo).length || 0

    const ganado = comisA.reduce((s, c) => s + (c.amount || 0), 0)
    const retirado = retirosA.reduce((s, r) => s + (r.amount || 0), 0)

    return {
      codigo: a.codigo,
      nombre: a.nombre,
      email: a.email,
      session_id: a.session_id,
      created_at: a.created_at,
      clicks: clicksA,
      ventas: comisA.length,
      ganado,
      disponible: Math.max(0, ganado - retirado),
    }
  })

  return NextResponse.json({ afiliados: resultado })
}
