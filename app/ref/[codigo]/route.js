// ============================================================
// Route Handler: /ref/[codigo]
// Guarda el código de afiliado en cookie y redirige al landing.
// Debe ser Route Handler (no page.js) para poder setear cookies.
// ============================================================
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request, { params }) {
  const { codigo } = params
  const response = NextResponse.redirect(new URL('/', request.url))

  if (codigo) {
    try {
      const supabase = createServerClient()

      const { data: afiliado } = await supabase
        .from('affiliate_codes')
        .select('codigo')
        .eq('codigo', codigo.toUpperCase())
        .single()

      if (afiliado) {
        // Guardar cookie por 30 días
        response.cookies.set('ikigai_ref', afiliado.codigo, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
          httpOnly: false,
          sameSite: 'lax',
        })

        // Registrar el click (sin bloquear)
        supabase
          .from('affiliate_clicks')
          .insert({ codigo: afiliado.codigo })
          .then(() => {})
          .catch(() => {})
      }
    } catch (e) {
      // Si algo falla igual redirigimos al landing
      console.error('Error en ref page:', e)
    }
  }

  return response
}
