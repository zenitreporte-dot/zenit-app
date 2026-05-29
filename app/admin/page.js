'use client'
// ============================================================
// Dashboard financiero — /admin
// ============================================================
import { useState, useEffect } from 'react'

const C = {
  dark: '#c9a84c',
  purple: '#c9a84c',
  bg: '#1a1b2e',
  green: '#34D399',
  amber: '#c9a84c',
}

function formatCOP(n) {
  return `$${(n || 0).toLocaleString('es-CO')} COP`
}

// ── Skeleton ─────────────────────────────────────────────────
function Skeleton({ h = 'h-16', w = 'w-full' }) {
  return <div className={`animate-pulse bg-zenit-navy rounded-xl ${h} ${w}`} />
}

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ label, valor, sub, color = C.purple, loading }) {
  return (
    <div className="bg-zenit-navy-mid rounded-2xl p-5 border border-zenit-amber/10">
      {loading ? (
        <>
          <Skeleton h="h-3" w="w-20" />
          <div className="mt-3"><Skeleton h="h-7" w="w-32" /></div>
          <div className="mt-2"><Skeleton h="h-3" w="w-16" /></div>
        </>
      ) : (
        <>
          <p className="text-xs text-zenit-cream/30 font-bold tracking-widest mb-2">{label}</p>
          <p className="text-2xl font-bold" style={{ color }}>{valor}</p>
          {sub && <p className="text-xs text-zenit-cream/30 mt-1">{sub}</p>}
        </>
      )}
    </div>
  )
}

// ── Bar Chart (pure SVG) ──────────────────────────────────────
function BarChart({ data }) {
  const [tooltip, setTooltip] = useState(null)

  if (!data || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-zenit-cream/20 text-sm">Sin datos</div>
  }

  const maxVentas = Math.max(...data.map(d => d.ventas), 1)
  const chartH = 140
  const barW = 100 / data.length

  // Show only every 5th label to avoid clutter
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${data.length * 20} ${chartH + 20}`}
        className="w-full"
        style={{ height: 180 }}
        onMouseLeave={() => setTooltip(null)}
      >
        {data.map((d, i) => {
          const barH = d.ventas === 0 ? 2 : Math.max(4, (d.ventas / maxVentas) * chartH)
          const x = i * 20 + 2
          const y = chartH - barH
          const isHovered = tooltip?.i === i
          return (
            <g key={i}
              onMouseEnter={() => setTooltip({ i, d, x: i * 20 })}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={x} y={y} width={16} height={barH}
                rx={3}
                fill={isHovered ? C.dark : (d.ventas > 0 ? C.purple : '#E5E7EB')}
                opacity={isHovered ? 1 : 0.85}
                style={{ transition: 'fill 0.15s' }}
              />
              {/* Day label every 5 bars */}
              {i % 5 === 0 && (
                <text
                  x={x + 8} y={chartH + 14}
                  textAnchor="middle"
                  fontSize={6}
                  fill="#9CA3AF"
                >
                  {days[new Date(d.fecha + 'T12:00:00').getDay()]}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute top-2 pointer-events-none bg-zenit-navy-mid text-zenit-cream text-xs rounded-lg px-3 py-2 shadow-xl z-10"
          style={{ left: `${(tooltip.x / (data.length * 20)) * 100}%`, transform: 'translateX(-50%)' }}
        >
          <p className="font-bold">{tooltip.d.fecha}</p>
          <p>{tooltip.d.ventas} venta{tooltip.d.ventas !== 1 ? 's' : ''}</p>
          <p className="text-green-400">{formatCOP(tooltip.d.ingresos)}</p>
        </div>
      )}
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────
export default function DashboardPage() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/stats?secret=${process.env.NEXT_PUBLIC_ADMIN_SECRET}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  // Derived metrics
  const proyeccionMensual = data?.ventas
    ? Math.round((data.ventas.semana / 7) * 30) * 25000
    : 0

  const ingresosNetos = (data?.caja?.total || 0) - (data?.comisionesPagadas || 0)

  return (
    <div className="p-6 max-w-6xl">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: C.dark }}>Dashboard</h1>
        <p className="text-sm text-zenit-cream/30 mt-1">Resumen financiero de IkigAI</p>
      </div>

      {/* Row 1 — 4 stat cards */}
      <p className="text-xs font-bold tracking-widest text-zenit-cream/30 mb-3">VENTAS (× $25.000 COP)</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="HOY"     valor={formatCOP(data?.caja?.hoy)}    sub={`${data?.ventas?.hoy    || 0} ventas`} color={C.green}  loading={loading} />
        <StatCard label="7 DÍAS"  valor={formatCOP(data?.caja?.semana)} sub={`${data?.ventas?.semana || 0} ventas`} color={C.purple} loading={loading} />
        <StatCard label="30 DÍAS" valor={formatCOP(data?.caja?.mes)}    sub={`${data?.ventas?.mes    || 0} ventas`} color={C.purple} loading={loading} />
        <StatCard label="TOTAL"   valor={formatCOP(data?.caja?.total)}  sub={`${data?.ventas?.total  || 0} ventas`} color={C.dark}   loading={loading} />
      </div>

      {/* Row 2 — net metrics */}
      <p className="text-xs font-bold tracking-widest text-zenit-cream/30 mb-3">CAJA NETA</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="INGRESOS NETOS"      valor={formatCOP(ingresosNetos)}              sub="Total - comisiones pagadas"       color={C.green}  loading={loading} />
        <StatCard label="COMISIONES PAGADAS"  valor={formatCOP(data?.comisionesPagadas)}    sub="A afiliados"                      color={C.amber}  loading={loading} />
        <StatCard label="AFILIADOS ACTIVOS"   valor={data?.afiliadosActivos ?? '—'}         sub="Con al menos 1 venta"             color={C.dark}   loading={loading} />
      </div>

      {/* Bar chart */}
      <div className="bg-zenit-navy-mid rounded-2xl border border-zenit-amber/10 p-5 mb-6">
        <p className="text-xs font-bold tracking-widest text-zenit-cream/30 mb-4">VENTAS ÚLTIMOS 30 DÍAS</p>
        {loading ? <Skeleton h="h-40" /> : <BarChart data={data?.ventasPorDia} />}
      </div>

      {/* Proyecciones */}
      <p className="text-xs font-bold tracking-widest text-zenit-cream/30 mb-3">PROYECCIONES</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="PROYECCIÓN MENSUAL"
          valor={formatCOP(proyeccionMensual)}
          sub="Promedio 7d × 30"
          color={C.purple}
          loading={loading}
        />
        <StatCard
          label="TICKET PROMEDIO"
          valor="$25.000 COP"
          sub="Precio fijo del reporte"
          color={C.dark}
          loading={loading}
        />
        <StatCard
          label="COMISIÓN POR VENTA"
          valor="$10.000 COP"
          sub="40% por afiliado"
          color={C.amber}
          loading={loading}
        />
      </div>

    </div>
  )
}
