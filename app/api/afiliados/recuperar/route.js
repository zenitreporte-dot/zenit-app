// ============================================================
// API: Solicitar recuperación de contraseña
// POST /api/afiliados/recuperar
// Body: { email }
// ============================================================
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { Resend } from 'resend'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

    const supabase = createServerClient()

    const { data: afiliado } = await supabase
      .from('affiliate_codes')
      .select('id, nombre, email, codigo')
      .eq('email', email.toLowerCase().trim())
      .single()

    // Siempre responder igual para no revelar si el email existe
    if (!afiliado) return NextResponse.json({ ok: true })

    // Generar token único
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hora

    await supabase
      .from('affiliate_codes')
      .update({ reset_token: token, reset_token_expires: expires })
      .eq('id', afiliado.id)

    const resetUrl = `${process.env.APP_URL || 'https://zenitcol.com'}/afiliados/nueva-contrasena?token=${token}`

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Zenit <onboarding@resend.dev>',
      to: afiliado.email,
      subject: 'Recupera tu contraseña · Zenit',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#1a1b2e;font-family:Arial,sans-serif;">
          <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
            <p style="color:#c9a84c;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:0 0 32px;">ZENIT · AFILIADOS</p>
            <h1 style="color:#f5f0e8;font-size:26px;margin:0 0 12px;font-weight:400;">
              Hola ${afiliado.nombre.split(' ')[0]}, aquí está tu link
            </h1>
            <p style="color:#f5f0e8;opacity:0.6;font-size:16px;margin:0 0 32px;">
              Haz click en el botón para crear una nueva contraseña. Este link expira en 1 hora.
            </p>
            <a href="${resetUrl}"
               style="display:inline-block;background:#c9a84c;color:#1a1b2e;font-weight:700;font-size:16px;padding:16px 40px;border-radius:50px;text-decoration:none;margin-bottom:32px;">
              Crear nueva contraseña →
            </a>
            <p style="color:#f5f0e8;opacity:0.3;font-size:13px;margin:0 0 8px;">
              Si no solicitaste esto, ignora este email.
            </p>
            <p style="color:#f5f0e8;opacity:0.2;font-size:12px;margin-top:40px;border-top:1px solid rgba(255,255,255,0.05);padding-top:24px;">
              Zenit · Programa de Afiliados
            </p>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error recuperación:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
