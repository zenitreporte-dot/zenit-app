// ============================================================
// API: Estadísticas del admin
// GET /api/admin/stats?secret=xxx
// ============================================================
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

const ADMIN_SECRET = process.env.ADMIN_SECRET

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')

    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const supabase = createServerClient()

    // ── Ventas ────────────────────────────────────────────────
    const { data: sesiones } = await supabase
      .from('form_sessions')
      .select('id, created_at, paid, referred_by, completed_at')
      .eq('paid', true)
      .order('created_at', { ascending: false })

    // Sesiones que completaron el form pero el pago no quedó confirmado
    const { data: pagosPendientes } = await supabase
      .from('form_sessions')
      .select('id, created_at, referred_by, completed_at')
      .eq('paid', false)
      .not('completed_at', 'is', null)
      .order('created_at', { ascending: false })
      .limit(50)

    const ahora     = new Date()
    const hoy       = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
    const semana    = new Date(hoy.getTime() - 7  * 24 * 60 * 60 * 1000)
    const mes       = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000)

    const ventasHoy    = sesiones?.filter(s => new Date(s.created_at) >= hoy).length   || 0
    const ventasSemana = sesiones?.filter(s => new Date(s.created_at) >= semana).length || 0
    const ventasMes    = sesiones?.filter(s => new Date(s.created_at) >= mes).length    || 0
    const ventasTotal  = sesiones?.length || 0

    const PRECIO = 25000
    const cajaHoy    = ventasHoy    * PRECIO
    const cajaSemana = ventasSemana * PRECIO
    const cajaMes    = ventasMes    * PRECIO
    const cajaTotal  = ventasTotal  * PRECIO

    // ── Retiros ────────────────────────────────────────────────
    const { data: retiros } = await supabase
      .from('withdrawal_requests')
      .select('id, affiliate_codigo, amount, metodo, datos_pago, status, created_at')
      .order('created_at', { ascending: false })

    const retirosPendientes = retiros?.filter(r => r.status === 'pending') || []
    const totalPendienteAfiliados = retirosPendientes.reduce((s, r) => s + r.amount, 0)

    // ── Comisiones ────────────────────────────────────────────
    const { data: comisiones } = await supabase
      .from('commissions')
      .select('affiliate_codigo, amount, status, created_at')

    // ── Afiliados (para enriquecer ranking) ───────────────────
    const { data: afiliadosDb } = await supabase
      .from('affiliate_codes')
      .select('codigo, nombre, email, session_id')

    const afiliadosMap = {}
    afiliadosDb?.forEach(a => {
      afiliadosMap[a.codigo] = { nombre: a.nombre, email: a.email, session_id: a.session_id }
    })

    // ── Ranking afiliados ─────────────────────────────────────
    const rankingMap = {}
    comisiones?.forEach(c => {
      if (!rankingMap[c.affiliate_codigo]) {
        rankingMap[c.affiliate_codigo] = {
          codigo: c.affiliate_codigo,
          ventas: 0,
          ganado: 0,
          disponible: 0,
          nombre: afiliadosMap[c.affiliate_codigo]?.nombre || null,
          email: afiliadosMap[c.affiliate_codigo]?.email || null,
          session_id: afiliadosMap[c.affiliate_codigo]?.session_id || null,
        }
      }
      rankingMap[c.affiliate_codigo].ventas++
      rankingMap[c.affiliate_codigo].ganado += c.amount || 0
    })

    // Calcular disponible por afiliado (ganado - retiros no rechazados)
    retiros?.forEach(r => {
      if (r.status !== 'rejected' && rankingMap[r.affiliate_codigo]) {
        rankingMap[r.affiliate_codigo].disponible = (rankingMap[r.affiliate_codigo].disponible || 0) + r.amount
      }
    })
    Object.values(rankingMap).forEach(a => {
      a.disponible = Math.max(0, a.ganado - (a.disponible || 0))
    })

    const ranking = Object.values(rankingMap).sort((a, b) => b.ventas - a.ventas)

    // ── Afiliados sin ventas (influencers recién creados) ─────
    const afiliadosSinVentas = afiliadosDb?.filter(a => !rankingMap[a.codigo]).map(a => ({
      codigo: a.codigo,
      ventas: 0,
      ganado: 0,
      disponible: 0,
      nombre: a.nombre,
      email: a.email,
      session_id: a.session_id,
    })) || []

    const todosAfiliados = [...ranking, ...afiliadosSinVentas]

    // ── Ventas por día (últimos 30 días) ──────────────────────
    const ventasPorDia = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(hoy.getTime() - i * 24 * 60 * 60 * 1000)
      const dStr = d.toISOString().slice(0, 10)
      const dNext = new Date(d.getTime() + 24 * 60 * 60 * 1000)
      const ventasDia = sesiones?.filter(s => {
        const sd = new Date(s.created_at)
        return sd >= d && sd < dNext
      }).length || 0
      ventasPorDia.push({ fecha: dStr, ventas: ventasDia, ingresos: ventasDia * PRECIO })
    }

    // ── Comisiones pagadas (para ingresos netos) ──────────────
    const comisionesPagadas = retiros
      ?.filter(r => r.status === 'paid')
      .reduce((s, r) => s + r.amount, 0) || 0

    // ── Afiliados activos (con al menos 1 venta) ─────────────
    const afiliadosActivos = ranking.length

    return NextResponse.json({
      ventas: { hoy: ventasHoy, semana: ventasSemana, mes: ventasMes, total: ventasTotal },
      caja:   { hoy: cajaHoy,   semana: cajaSemana,   mes: cajaMes,   total: cajaTotal   },
      compradores: sesiones || [],
      pagosPendientes: pagosPendientes || [],
      retiros: retiros || [],
      retirosPendientes,
      totalPendienteAfiliados,
      ranking,
      todosAfiliados,
      ventasPorDia,
      comisionesPagadas,
      afiliadosActivos,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
