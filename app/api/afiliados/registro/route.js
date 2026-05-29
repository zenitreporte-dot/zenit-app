import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

function generarCodigo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let codigo = ''
  for (let i = 0; i < 6; i++) codigo += chars[Math.floor(Math.random() * chars.length)]
  return codigo
}

export async function POST(request) {
  try {
    const { session_id, nombre, email, password, codigo: codigoDeseado } = await request.json()

    if (!nombre || !email || !password) {
      return NextResponse.json({ error: 'Nombre, email y contraseña son requeridos' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Si viene con session_id, verificar si ya tiene código
    if (session_id) {
      const { data: existente } = await supabase
        .from('affiliate_codes')
        .select('codigo')
        .eq('session_id', session_id)
        .single()
      if (existente) return NextResponse.json({ codigo: existente.codigo, ya_existia: true })
    }

    // Ver si el email ya está registrado
    const { data: emailExistente } = await supabase
      .from('affiliate_codes')
      .select('codigo')
      .eq('email', email.toLowerCase().trim())
      .single()
    if (emailExistente) return NextResponse.json({ codigo: emailExistente.codigo, ya_existia: true })

    // Determinar código
    let codigoFinal = ''
    if (codigoDeseado && /^[A-Z0-9]{4,10}$/i.test(codigoDeseado)) {
      const codigoLimpio = codigoDeseado.toUpperCase().trim()
      const { data: ocupado } = await supabase
        .from('affiliate_codes').select('id').eq('codigo', codigoLimpio).single()
      if (ocupado) return NextResponse.json({ error: 'Ese código ya está en uso, elige otro' }, { status: 409 })
      codigoFinal = codigoLimpio
    } else {
      for (let i = 0; i < 10; i++) {
        const candidato = generarCodigo()
        const { data: ocupado } = await supabase
          .from('affiliate_codes').select('id').eq('codigo', candidato).single()
        if (!ocupado) { codigoFinal = candidato; break }
      }
    }

    if (!codigoFinal) return NextResponse.json({ error: 'No se pudo generar un código' }, { status: 500 })

    // Hash contraseña + token de sesión inicial
    const password_hash = await bcrypt.hash(password, 10)
    const session_token = crypto.randomBytes(32).toString('hex')

    const { error } = await supabase
      .from('affiliate_codes')
      .insert({
        session_id: session_id || null,
        codigo: codigoFinal,
        nombre: nombre.trim(),
        email: email.toLowerCase().trim(),
        password_hash,
        session_token,
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Setear cookie de sesión automáticamente al registrarse
    const response = NextResponse.json({ codigo: codigoFinal, nuevo: true })
    response.cookies.set('af_session', `${codigoFinal}:${session_token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return response

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
