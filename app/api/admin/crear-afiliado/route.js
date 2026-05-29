// ============================================================
// API: Crear afiliado manual (influencers, sin pago previo)
// POST /api/admin/crear-afiliado
// Body: { secret, nombre, email, codigo? }
// ============================================================
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET

function generarCodigo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let codigo = ''
  for (let i = 0; i < 6; i++) {
    codigo += chars[Math.floor(Math.random() * chars.length)]
  }
  return codigo
}

export async function POST(request) {
  try {
    const { secret, nombre, email, codigo: codigoDeseado } = await request.json()

    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    if (!nombre?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Nombre y email son requeridos' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Ver si el email ya está registrado
    const { data: emailExistente } = await supabase
      .from('affiliate_codes')
      .select('codigo')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (emailExistente) {
      return NextResponse.json(
        { error: `Este email ya tiene el código ${emailExistente.codigo}` },
        { status: 409 }
      )
    }

    // Determinar código
    let codigoFinal = ''

    if (codigoDeseado?.trim()) {
      const codigoLimpio = codigoDeseado.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
      if (codigoLimpio.length < 4) {
        return NextResponse.json({ error: 'El código debe tener al menos 4 caracteres' }, { status: 400 })
      }

      const { data: ocupado } = await supabase
        .from('affiliate_codes')
        .select('id')
        .eq('codigo', codigoLimpio)
        .single()

      if (ocupado) {
        return NextResponse.json({ error: 'Ese código ya está en uso' }, { status: 409 })
      }
      codigoFinal = codigoLimpio
    } else {
      // Generar código automático
      for (let i = 0; i < 10; i++) {
        const candidato = generarCodigo()
        const { data: ocupado } = await supabase
          .from('affiliate_codes')
          .select('id')
          .eq('codigo', candidato)
          .single()
        if (!ocupado) { codigoFinal = candidato; break }
      }
    }

    if (!codigoFinal) {
      return NextResponse.json({ error: 'No se pudo generar un código único' }, { status: 500 })
    }

    // Insertar sin session_id (influencer)
    const { error } = await supabase
      .from('affiliate_codes')
      .insert({
        session_id: null,
        codigo: codigoFinal,
        nombre: nombre.trim(),
        email: email.toLowerCase().trim(),
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, codigo: codigoFinal })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
