// ============================================================
// API: Generar el reporte con IA y guardarlo en Supabase
// POST /api/reporte/generar
// FLUJO: Verificar sesión → Filtro de seguridad → Generar reporte
// ============================================================
export const maxDuration = 60

import { createServerClient } from '@/lib/supabase'
import { generarReporteIA } from '@/lib/generarReporte'
import { analizarSeguridad, CATEGORIAS } from '@/lib/filtroSeguridad'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { session_id, modo_prueba } = await request.json()

    if (!session_id) {
      return NextResponse.json({ error: 'session_id requerido' }, { status: 400 })
    }

    const supabase = createServerClient()

    // 1. Verificar que la sesión existe
    const { data: sesion, error: errorSesion } = await supabase
      .from('form_sessions')
      .select('id, answers, paid, completed_at')
      .eq('id', session_id)
      .single()

    if (errorSesion || !sesion) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
    }

    if (!sesion.paid && !modo_prueba) {
      return NextResponse.json({ error: 'Sesión no pagada' }, { status: 403 })
    }

    // 2. Verificar que no existe ya un reporte
    const { data: reporteExistente } = await supabase
      .from('reports')
      .select('id')
      .eq('session_id', session_id)
      .single()

    if (reporteExistente) {
      return NextResponse.json({ ok: true, reporte_id: reporteExistente.id, ya_existia: true })
    }

    if (!sesion.answers || Object.keys(sesion.answers).length === 0) {
      return NextResponse.json({ error: 'La sesión no tiene respuestas' }, { status: 400 })
    }

    // ============================================================
    // 3. FILTRO DE SEGURIDAD — se omite en modo prueba para ahorrar tiempo
    // ============================================================
    let esSensible = false
    let categoriaSeguridad = 'ok'

    if (!modo_prueba) {
      console.log(`Analizando seguridad para sesión ${session_id}...`)
      const analisis = await analizarSeguridad(sesion.answers)
      categoriaSeguridad = analisis.categoria

      // Guardar el resultado del análisis en Supabase para auditoría
      await supabase
        .from('form_sessions')
        .update({ safety_check: analisis })
        .eq('id', session_id)

      // Si es crisis o bloqueado: NO generar reporte, devolver el motivo
      if (analisis.categoria === CATEGORIAS.CRISIS) {
        console.warn(`Sesión ${session_id} marcada como CRISIS — reporte bloqueado`)
        return NextResponse.json({
          ok: false,
          bloqueado: true,
          categoria: CATEGORIAS.CRISIS,
          razon: analisis.razon,
        }, { status: 200 })
      }

      if (analisis.categoria === CATEGORIAS.BLOQUEADO) {
        console.warn(`Sesión ${session_id} BLOQUEADA — motivo: ${analisis.razon}`)
        return NextResponse.json({
          ok: false,
          bloqueado: true,
          categoria: CATEGORIAS.BLOQUEADO,
          razon: analisis.razon,
        }, { status: 200 })
      }

      esSensible = analisis.categoria === CATEGORIAS.SENSIBLE
    } else {
      console.log(`Modo prueba: omitiendo filtro de seguridad`)
    }

    // ============================================================
    // 4. Generar el reporte (solo llega aquí si pasó el filtro)
    // ============================================================
    console.log(`Seguridad OK (${categoriaSeguridad}) — generando reporte...`)
    const { contenido, modelo, ms } = await generarReporteIA(sesion.answers, esSensible)

    // 5. Guardar en Supabase
    const { data: reporte, error: errorReporte } = await supabase
      .from('reports')
      .insert({
        session_id,
        content: contenido,
        model_used: modelo,
        generation_ms: ms,
      })
      .select('id')
      .single()

    if (errorReporte) throw errorReporte

    if (modo_prueba && !sesion.paid) {
      await supabase
        .from('form_sessions')
        .update({ paid: true })
        .eq('id', session_id)
    }

    console.log(`Reporte ${reporte.id} generado con ${modelo} en ${ms}ms`)

    return NextResponse.json({
      ok: true,
      reporte_id: reporte.id,
      modelo_usado: modelo,
      tiempo_ms: ms,
      categoria_seguridad: categoriaSeguridad,
    })

  } catch (error) {
    console.error('Error generando reporte:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
