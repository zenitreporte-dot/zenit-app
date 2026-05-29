// ============================================================
// Cliente de Supabase para usar en el SERVIDOR (API routes)
// Usa service_role key que tiene permisos completos sobre la DB
// NUNCA importar este cliente en componentes del frontend
// ============================================================
import { createClient } from '@supabase/supabase-js'

// Cliente del servidor con permisos elevados (bypasa RLS)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
}

// Cliente del navegador con permisos limitados (respeta RLS)
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
