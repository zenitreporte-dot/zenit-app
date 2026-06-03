// ============================================================
// Webhook de Mercado Pago
// POST /api/webhook/mercadopago
// Mercado Pago llama a esta URL cuando ocurre un evento de pago.
// REGLA DE ORO: NUNCA marcar como pagado sin verificar con MP.
// ============================================================
import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createServerClient } from '@/lib/supabase'
import { notificarNuevaVenta, enviarNotificacionVenta, enviarConfirmacionCompra } from '@/lib/emails'


export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Webhook MP recibido:', JSON.stringify(body))

    // Mercado Pago envía diferentes tipos de notificaciones.
    // Solo nos interesan las de tipo "payment".
    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true, msg: 'Ignorado: no es un evento de pago' })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      return NextResponse.json({ error: 'Sin payment id' }, { status: 400 })
    }

    // Verificar el pago directamente con la API de Mercado Pago
    // (nunca confiar solo en los datos que llegan en el webhook)
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    })

    const paymentApi = new Payment(client)
    const pago = await paymentApi.get({ id: paymentId })

    console.log('Estado del pago verificado:', pago.status, 'External ref:', pago.external_reference)

    // Solo procesar si el pago fue aprobado
    if (pago.status !== 'approved') {
      console.log('Pago no aprobado, ignorando. Estado:', pago.status)
      return NextResponse.json({ ok: true, msg: `Pago en estado: ${pago.status}` })
    }

    // external_reference contiene el session_id de nuestra tabla form_sessions
    const sessionId = pago.external_reference
    if (!sessionId) {
      return NextResponse.json({ error: 'Sin external_reference' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Verificar que esta sesión no fue procesada ya (evitar duplicados)
    const { data: sesion } = await supabase
      .from('form_sessions')
      .select('id, paid, answers, referred_by')
      .eq('id', sessionId)
      .single()

    if (!sesion) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
    }

    if (sesion.paid) {
      console.log('Sesión ya fue procesada anteriormente, ignorando duplicado.')
      return NextResponse.json({ ok: true, msg: 'Ya procesado' })
    }

    // Actualizar el pago en la tabla payments
    await supabase
      .from('payments')
      .update({
        mp_status: 'approved',
        mp_payment_id: String(paymentId),
        confirmed_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId)

    // Marcar la sesión como pagada
    await supabase
      .from('form_sessions')
      .update({ paid: true })
      .eq('id', sessionId)

    console.log('Sesión marcada como pagada:', sessionId)

    // Crear comisión si la sesión vino referida por un afiliado
    if (sesion.referred_by) {
      const { error: errComision } = await supabase
        .from('commissions')
        .insert({
          affiliate_codigo: sesion.referred_by,
          buyer_session_id: sessionId,
          amount: 10000, // $10.000 COP por venta
          status: 'pending',
        })
      if (errComision) {
        console.error('Error creando comisión:', errComision.message)
      } else {
        console.log('Comisión creada para afiliado:', sesion.referred_by)
        // Notificar al afiliado por email (sin bloquear)
        const { data: afiliado } = await supabase
          .from('affiliate_codes')
          .select('nombre, email, codigo')
          .eq('codigo', sesion.referred_by)
          .single()
        // Notificación de venta manejada por Make (webhook automático)
      }
    }

    // Notificaciones (sin await para no bloquear)
    notificarNuevaVenta({ sessionId, referidoPor: sesion.referred_by }).catch(() => {})

    // Email de confirmación al comprador
    const nombreComprador = sesion.answers?._nombre || null
    const emailComprador = pago.payer?.email || sesion.buyer_email || null
    if (emailComprador) {
      enviarConfirmacionCompra({ email: emailComprador, sessionId, nombre: nombreComprador }).catch(() => {})
    }

    // Notificación al afiliado si la venta vino referida
    if (sesion.referred_by) {
      const { data: afiliado } = await supabase
        .from('affiliate_codes')
        .select('nombre, email')
        .eq('codigo', sesion.referred_by)
        .single()
      if (afiliado?.email) {
        enviarNotificacionVenta({
          nombre: afiliado.nombre,
          email: afiliado.email,
          codigo: sesion.referred_by,
        }).catch(() => {})
      }
    }

    // Responder rápido a Mercado Pago para que no reintente
    return NextResponse.json({ ok: true, msg: 'Pago procesado correctamente' })
  } catch (error) {
    console.error('Error en webhook MP:', error)
    // Devolvemos 200 de todas formas para que MP no reintente en bucle
    return NextResponse.json({ ok: false, error: error.message })
  }
}

// Mercado Pago también hace GET para verificar que el endpoint existe
export async function GET() {
  return NextResponse.json({ ok: true, msg: 'Webhook IkigAI activo' })
}
