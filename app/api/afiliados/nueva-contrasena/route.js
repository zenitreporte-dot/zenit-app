// ============================================================
// API: Confirmar nueva contraseña con token
// POST /api/afiliados/nueva-contrasena
// Body: { token, password }
// ============================================================
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { token, password } = await request.json()
    if (!token || !password) return NextResponse.json({ error: 'Token y contraseña requeridos' }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })

    const supabase = createServerClient()

    const { data: afiliado } = await supabase
      .from('affiliate_codes')
      .select('id, reset_token_expires')
      .eq('reset_token', token)
      .single()

    if (!afiliado) return NextResponse.json({ error: 'Link inválido o ya usado' }, { status: 400 })

    if (new Date(afiliado.reset_token_expires) < new Date()) {
      return NextResponse.json({ error: 'Este link expiró. Solicita uno nuevo.' }, { status: 400 })
    }

    const password_hash = await bcrypt.hash(password, 10)

    await supabase
      .from('affiliate_codes')
      .update({ password_hash, reset_token: null, reset_token_expires: null })
      .eq('id', afiliado.id)

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
