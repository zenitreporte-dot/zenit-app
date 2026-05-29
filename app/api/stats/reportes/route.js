// API: Total de reportes generados (para social proof en pantalla de pago)
import { createServerClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createServerClient()
    const { count } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })

    // Sumar un número base para que no empiece en 0 los primeros días
    const total = (count || 0) + 127

    return NextResponse.json({ total })
  } catch {
    return NextResponse.json({ total: 127 })
  }
}
