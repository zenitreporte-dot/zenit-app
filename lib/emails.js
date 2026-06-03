// ============================================================
// Notificaciones — Resend (emails) + Telegram (alertas admin)
// ============================================================
import { Resend } from 'resend'

const FROM = 'Zenit <hola@zenitcol.com>'
const ADMIN_EMAIL = 'zenitreporte@gmail.com'
const BASE_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_URL || 'https://zenitcol.com'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

// ─────────────────────────────────────────────────────────────
// TELEGRAM — alerta instantánea al celular
// ─────────────────────────────────────────────────────────────
async function telegram(mensaje) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    if (!token || !chatId) return

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: mensaje,
        parse_mode: 'HTML',
      }),
    })
  } catch (e) {
    console.error('Error enviando Telegram:', e.message)
  }
}

// ─────────────────────────────────────────────────────────────
// ALERTA NUEVA VENTA — Telegram al admin
// ─────────────────────────────────────────────────────────────
export async function notificarNuevaVenta({ sessionId, referidoPor = null }) {
  const ref = referidoPor ? `\n🤝 <b>Afiliado:</b> ${referidoPor}` : '\n🎯 Venta directa'
  await telegram(
    `💰 <b>¡Nueva venta!</b>\n\n` +
    `💵 <b>$25.000 COP</b>${ref}\n` +
    `🆔 <code>${sessionId?.slice(0, 8)}...</code>`
  )
}

// ─────────────────────────────────────────────────────────────
// ALERTA NUEVO RETIRO — Telegram al admin
// ─────────────────────────────────────────────────────────────
export async function notificarNuevoRetiro({ nombre, codigo, monto, metodo, datosPago }) {
  await telegram(
    `🏧 <b>Retiro solicitado</b>\n\n` +
    `👤 <b>${nombre}</b> (${codigo})\n` +
    `💵 <b>$${monto.toLocaleString('es-CO')} COP</b>\n` +
    `📲 <b>${metodo}:</b> ${datosPago}`
  )
}

// ─────────────────────────────────────────────────────────────
// EMAIL CONFIRMACIÓN AL COMPRADOR
// ─────────────────────────────────────────────────────────────
export async function enviarConfirmacionCompra({ email, sessionId, nombre = null }) {
  const saludo = nombre ? nombre.split(' ')[0] : null
  const reporteUrl = `${BASE_URL}/reporte/${sessionId}`
  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: saludo ? `Tu reporte está listo, ${saludo}` : 'Tu reporte Zenit está listo',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#1a1b2e;font-family:Arial,sans-serif;">
          <div style="max-width:520px;margin:0 auto;padding:40px 24px;">

            <p style="color:#c9a84c;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:0 0 32px;">ZENIT</p>

            <h1 style="color:#f5f0e8;font-size:28px;margin:0 0 8px;font-weight:400;">
              ${saludo ? `Tu reporte está listo, ${saludo}` : 'Tu reporte está listo'}
            </h1>
            <p style="color:#f5f0e8;opacity:0.6;font-size:16px;margin:0 0 32px;">
              La IA analizó tus respuestas. Aquí está tu análisis de propósito de vida.
            </p>

            <a href="${reporteUrl}"
               style="display:inline-block;background:#c9a84c;color:#1a1b2e;font-weight:700;font-size:16px;padding:16px 40px;border-radius:50px;text-decoration:none;margin-bottom:32px;">
              Ver mi reporte →
            </a>

            <p style="color:#f5f0e8;opacity:0.4;font-size:13px;margin:0 0 8px;">
              Guarda este link — es tuyo para siempre:
            </p>
            <p style="color:#c9a84c;font-size:13px;word-break:break-all;margin:0 0 32px;">
              ${reporteUrl}
            </p>

            <p style="color:#f5f0e8;opacity:0.2;font-size:12px;margin-top:40px;border-top:1px solid rgba(255,255,255,0.05);padding-top:24px;">
              Zenit · Reporte de propósito de vida<br>
              Si tienes preguntas escríbenos a ${ADMIN_EMAIL}
            </p>
          </div>
        </body>
        </html>
      `,
    })
  } catch (e) {
    console.error('Error enviando confirmación de compra:', e.message)
  }
}

// ─────────────────────────────────────────────────────────────
// EMAIL NOTIFICACIÓN DE VENTA AL AFILIADO
// ─────────────────────────────────────────────────────────────
export async function enviarNotificacionVenta({ nombre, email, codigo, monto = 10000 }) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: '¡Vendiste! Ganaste $10.000 COP en Zenit',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#1a1b2e;font-family:Arial,sans-serif;">
          <div style="max-width:520px;margin:0 auto;padding:40px 24px;">

            <p style="color:#c9a84c;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:0 0 32px;">ZENIT · AFILIADOS</p>

            <h1 style="color:#f5f0e8;font-size:28px;margin:0 0 8px;font-weight:400;">
              ¡Vendiste, ${nombre.split(' ')[0]}!
            </h1>
            <p style="color:#f5f0e8;opacity:0.6;font-size:16px;margin:0 0 32px;">
              Alguien usó tu link y completó su compra.
            </p>

            <div style="background:#2d2e4a;border-radius:16px;padding:28px;margin-bottom:32px;text-align:center;border:1px solid rgba(201,168,76,0.2);">
              <p style="color:#f5f0e8;opacity:0.5;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Comisión ganada</p>
              <p style="color:#c9a84c;font-size:40px;font-weight:700;margin:0;">$${monto.toLocaleString('es-CO')} COP</p>
            </div>

            <p style="color:#f5f0e8;opacity:0.5;font-size:14px;margin:0 0 24px;">
              Tu saldo se ha actualizado. Puedes solicitar tu retiro cuando tengas mínimo $50.000 COP acumulados (5 ventas).
            </p>

            <a href="${BASE_URL}/afiliados/${codigo}"
               style="display:inline-block;background:#c9a84c;color:#1a1b2e;font-weight:700;font-size:15px;padding:14px 32px;border-radius:50px;text-decoration:none;">
              Ver mi panel →
            </a>

            <p style="color:#f5f0e8;opacity:0.2;font-size:12px;margin-top:40px;">
              Código: ${codigo} · Zenit
            </p>
          </div>
        </body>
        </html>
      `,
    })
  } catch (e) {
    console.error('Error enviando notificación de venta:', e.message)
  }
}

// ─────────────────────────────────────────────────────────────
// EMAIL CONFIRMACIÓN DE RETIRO AL AFILIADO
// ─────────────────────────────────────────────────────────────
export async function enviarConfirmacionRetiro({ nombre, email, codigo, monto }) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: 'Solicitud de retiro recibida · Zenit',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#1a1b2e;font-family:Arial,sans-serif;">
          <div style="max-width:520px;margin:0 auto;padding:40px 24px;">

            <p style="color:#c9a84c;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:0 0 32px;">ZENIT · AFILIADOS</p>

            <h1 style="color:#f5f0e8;font-size:28px;margin:0 0 8px;font-weight:400;">
              Solicitud recibida
            </h1>
            <p style="color:#f5f0e8;opacity:0.6;font-size:16px;margin:0 0 32px;">
              Hola ${nombre.split(' ')[0]}, ya tenemos tu solicitud.
            </p>

            <div style="background:#2d2e4a;border-radius:16px;padding:28px;margin-bottom:32px;text-align:center;border:1px solid rgba(201,168,76,0.2);">
              <p style="color:#f5f0e8;opacity:0.5;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Monto solicitado</p>
              <p style="color:#c9a84c;font-size:40px;font-weight:700;margin:0;">$${monto.toLocaleString('es-CO')} COP</p>
            </div>

            <p style="color:#f5f0e8;opacity:0.5;font-size:14px;margin:0 0 24px;">
              Procesamos los retiros en <strong style="color:#f5f0e8;opacity:0.8;">1 a 3 días hábiles</strong>. Te confirmaremos cuando el dinero esté en camino.
            </p>

            <a href="${BASE_URL}/afiliados/${codigo}"
               style="display:inline-block;background:#c9a84c;color:#1a1b2e;font-weight:700;font-size:15px;padding:14px 32px;border-radius:50px;text-decoration:none;">
              Ver mi panel →
            </a>

            <p style="color:#f5f0e8;opacity:0.2;font-size:12px;margin-top:40px;">
              Código: ${codigo} · Zenit
            </p>
          </div>
        </body>
        </html>
      `,
    })
  } catch (e) {
    console.error('Error enviando confirmación de retiro:', e.message)
  }
}

// ─────────────────────────────────────────────────────────────
// EMAIL ALERTA DE RETIRO AL ADMIN
// ─────────────────────────────────────────────────────────────
export async function enviarAlertaRetiroAdmin({ nombre, email, codigo, monto, metodo, datos_pago }) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `Retiro solicitado · ${nombre} · $${monto.toLocaleString('es-CO')} COP`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#1a1b2e;font-family:Arial,sans-serif;">
          <div style="max-width:520px;margin:0 auto;padding:40px 24px;">

            <p style="color:#c9a84c;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:0 0 24px;">ZENIT ADMIN · RETIRO PENDIENTE</p>

            <h1 style="color:#f5f0e8;font-size:24px;margin:0 0 24px;font-weight:400;">
              Nuevo retiro por procesar
            </h1>

            <div style="background:#2d2e4a;border-radius:16px;padding:24px;margin-bottom:24px;border:1px solid rgba(201,168,76,0.3);">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="color:#f5f0e8;opacity:0.5;font-size:13px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Afiliado</td><td style="color:#f5f0e8;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;">${nombre}</td></tr>
                <tr><td style="color:#f5f0e8;opacity:0.5;font-size:13px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Email</td><td style="color:#f5f0e8;font-size:13px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;">${email}</td></tr>
                <tr><td style="color:#f5f0e8;opacity:0.5;font-size:13px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Código</td><td style="color:#c9a84c;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;">${codigo}</td></tr>
                <tr><td style="color:#f5f0e8;opacity:0.5;font-size:13px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Método</td><td style="color:#f5f0e8;font-size:13px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;">${metodo}</td></tr>
                <tr><td style="color:#f5f0e8;opacity:0.5;font-size:13px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Datos de pago</td><td style="color:#f5f0e8;font-size:13px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;">${datos_pago}</td></tr>
                <tr><td style="color:#f5f0e8;opacity:0.5;font-size:13px;padding:8px 0;">Monto</td><td style="color:#c9a84c;font-size:18px;font-weight:700;padding:8px 0;text-align:right;">$${monto.toLocaleString('es-CO')} COP</td></tr>
              </table>
            </div>

            <a href="${BASE_URL}/admin/retiros"
               style="display:inline-block;background:#c9a84c;color:#1a1b2e;font-weight:700;font-size:15px;padding:14px 32px;border-radius:50px;text-decoration:none;">
              Procesar en panel admin →
            </a>
          </div>
        </body>
        </html>
      `,
    })
  } catch (e) {
    console.error('Error enviando alerta de retiro al admin:', e.message)
  }
}
