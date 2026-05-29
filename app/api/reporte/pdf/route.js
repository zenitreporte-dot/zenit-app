// ============================================================
// API: Generar y descargar el PDF del reporte
// GET /api/reporte/pdf?session_id=xxx
// Genera un PDF real con @react-pdf/renderer (no screenshot)
// ============================================================
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createServerClient } from '@/lib/supabase'
import { ReportePDF, registerLatoFonts } from '@/components/ReportePDF'
import React from 'react'
import path from 'path'

// Registrar fuentes una sola vez al iniciar el módulo
const fontsDir = path.join(process.cwd(), 'public', 'fonts')
registerLatoFonts(fontsDir)

// Forzar que este route corra en Node.js (no Edge Runtime)
export const runtime = 'nodejs'

export async function GET(request) {
  try {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id requerido' }, { status: 400 })
  }

  const supabase = createServerClient()

  // Verificar que la sesión está pagada
  const { data: sesion } = await supabase
    .from('form_sessions')
    .select('paid')
    .eq('id', sessionId)
    .single()

  if (!sesion?.paid) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // Obtener el reporte
  const { data: reporte } = await supabase
    .from('reports')
    .select('content, model_used, generated_at')
    .eq('session_id', sessionId)
    .single()

  if (!reporte) {
    return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 })
  }

  // Generar el PDF con React PDF
  const buffer = await renderToBuffer(
    React.createElement(ReportePDF, {
      content: reporte.content,
      generatedAt: reporte.generated_at,
      modelUsed: reporte.model_used,
    })
  )

  // Devolver el PDF como descarga
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="mi-reporte-ikigai.pdf"',
      'Content-Length': buffer.length.toString(),
    },
  })
  } catch (error) {
    console.error('Error generando PDF:', error)
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 })
  }
}
