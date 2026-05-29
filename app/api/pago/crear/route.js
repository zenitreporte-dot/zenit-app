// ============================================================
// API: Crear preferencia de pago en Mercado Pago
// POST /api/pago/crear
// El backend crea la preferencia y devuelve la URL del checkout
// ============================================================
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { createServerClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { PRECIO_COP } from '@/lib/constants'

export async function POST(request) {
  try {
    const { session_token } = await request.json()

    if (!session_token) {
      return NextResponse.json({ error: 'session_token requerido' }, { status: 400 })
    }

    // Buscar la sesión en Supabase para verificar que el formulario fue completado
    const supabase = createServerClient()
    const { data: sesion, error: errorSesion } = await supabase
      .from('form_sessions')
      .select('id, completed_at, paid')
      .eq('session_token', session_token)
      .single()

    if (errorSesion || !sesion) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
    }

    // No permitir pagar si ya pagó
    if (sesion.paid) {
      return NextResponse.json({
        error: 'Ya pagaste. Ve a tu reporte.',
        session_id: sesion.id
      }, { status: 400 })
    }

    // Configurar cliente de Mercado Pago con el token de acceso
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    })

    const preference = new Preference(client)
    const baseUrl = process.env.NEXT_PUBLIC_URL

    // Crear la preferencia de pago en Mercado Pago
    const response = await preference.create({
      body: {
        items: [
          {
            id: sesion.id,
            title: 'Reporte IkigAI — Tu propósito de vida con IA',
            description: '8 secciones de análisis profundo de propósito de vida basado en metodología Ikigai',
            quantity: 1,
            unit_price: PRECIO_COP,
            currency_id: 'COP',
          },
        ],
        // URLs a donde Mercado Pago redirige al usuario según el resultado
        back_urls: {
          success: `${baseUrl}/pago/exitoso?session_id=${sesion.id}`,
          failure: `${baseUrl}/pago/fallido?session_id=${sesion.id}`,
          pending: `${baseUrl}/pago/pendiente?session_id=${sesion.id}`,
        },
        auto_return: 'approved', // Redirige automáticamente si el pago es aprobado
        // URL donde Mercado Pago envía la notificación del pago (el webhook)
        notification_url: `${baseUrl}/api/webhook/mercadopago`,
        // Referencia externa para identificar este pago en nuestro sistema
        external_reference: sesion.id,
        // Expirar la preferencia en 30 minutos si no paga
        expires: true,
        expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
    })

    // Guardar el ID de la preferencia en la tabla de pagos (como intento pendiente)
    await supabase.from('payments').insert({
      session_id: sesion.id,
      mp_payment_id: response.id, // ID de la preferencia (no del pago aún)
      mp_status: 'pending',
      amount: PRECIO_COP,
    })

    // Devolver la URL del checkout de Mercado Pago
    // init_point = producción, sandbox_init_point = pruebas
    const checkoutUrl = process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('TEST-')
      ? response.sandbox_init_point
      : response.init_point

    return NextResponse.json({ checkout_url: checkoutUrl })
  } catch (error) {
    console.error('Error creando preferencia MP:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
