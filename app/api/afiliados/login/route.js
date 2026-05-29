import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: afiliado } = await supabase
      .from('affiliate_codes')
      .select('codigo, nombre, password_hash')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (!afiliado) {
      return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 })
    }

    if (!afiliado.password_hash) {
      return NextResponse.json({ error: 'Esta cuenta no tiene contraseña. Contáctanos para recuperar el acceso.' }, { status: 401 })
    }

    const ok = await bcrypt.compare(password, afiliado.password_hash)
    if (!ok) {
      return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 })
    }

    // Generar token de sesión
    const sessionToken = crypto.randomBytes(32).toString('hex')

    await supabase
      .from('affiliate_codes')
      .update({ session_token: sessionToken })
      .eq('codigo', afiliado.codigo)

    const response = NextResponse.json({ ok: true, codigo: afiliado.codigo, nombre: afiliado.nombre })

    response.cookies.set('af_session', `${afiliado.codigo}:${sessionToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: '/',
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
