// ============================================================
// API: Crear o actualizar una sesión de formulario en Supabase
// POST /api/formulario/sesion
// ============================================================
import { createServerClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function PATCH(request) {
  try {
    const body = await request.json()
    const { session_token, nombre, email } = body
    if (!session_token || !nombre) {
      return NextResponse.json({ error: 'session_token y nombre requeridos' }, { status: 400 })
    }
    const supabase = createServerClient()
    const { data: sesion } = await supabase
      .from('form_sessions')
      .select('id, answers')
      .eq('session_token', session_token)
      .single()
    if (!sesion) return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
    const updateData = { answers: { ...sesion.answers, _nombre: nombre } }
    if (email) updateData.buyer_email = email
    await supabase
      .from('form_sessions')
      .update(updateData)
      .eq('session_token', session_token)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { session_token, answers, current_step, completed, referred_by } = body

    if (!session_token) {
      return NextResponse.json({ error: 'session_token requerido' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Buscar si ya existe una sesión con este token
    const { data: sesionExistente } = await supabase
      .from('form_sessions')
      .select('id, answers, current_step')
      .eq('session_token', session_token)
      .single()

    if (sesionExistente) {
      // Actualizar la sesión existente con las nuevas respuestas
      const updateData = {
        answers: answers || sesionExistente.answers,
        current_step: current_step ?? sesionExistente.current_step,
      }

      if (referred_by) {
        updateData.referred_by = referred_by
      }

      if (completed) {
        updateData.completed_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('form_sessions')
        .update(updateData)
        .eq('session_token', session_token)
        .select('id')
        .single()

      if (error) throw error

      return NextResponse.json({ session_id: data.id, created: false })
    } else {
      // Crear sesión nueva (primera vez que el usuario llega al formulario)
      const { data, error } = await supabase
        .from('form_sessions')
        .insert({
          session_token,
          answers: answers || {},
          current_step: current_step || 0,
          referred_by: referred_by || null,
        })
        .select('id')
        .single()

      if (error) throw error

      return NextResponse.json({ session_id: data.id, created: true })
    }
  } catch (error) {
    console.error('Error en /api/formulario/sesion:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET: Obtener el estado de una sesión por su token
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const session_token = searchParams.get('token')

  if (!session_token) {
    return NextResponse.json({ error: 'token requerido' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('form_sessions')
    .select('id, answers, current_step, completed_at, paid')
    .eq('session_token', session_token)
    .single()

  if (error || !data) {
    return NextResponse.json({ session: null })
  }

  return NextResponse.json({ session: data })
}
