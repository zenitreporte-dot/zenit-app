-- ============================================================
-- SQL CORREGIDO para el sistema de afiliados de Zenit
-- Correr en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Columna referred_by en form_sessions (si no existe)
ALTER TABLE public.form_sessions
  ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- 2. Tabla principal de afiliados (nombre correcto: affiliate_codes)
CREATE TABLE IF NOT EXISTS public.affiliate_codes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  UUID REFERENCES public.form_sessions(id) ON DELETE SET NULL,
  codigo      TEXT UNIQUE NOT NULL,
  nombre      TEXT NOT NULL,
  email       TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de clicks (/ref/CODIGO → registra cada visita)
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo     TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de comisiones (se crea una por cada venta referida)
CREATE TABLE IF NOT EXISTS public.commissions (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_codigo  TEXT NOT NULL,
  buyer_session_id  UUID REFERENCES public.form_sessions(id) ON DELETE SET NULL,
  amount            INTEGER DEFAULT 10000,   -- COP
  status            TEXT DEFAULT 'pending',  -- 'pending' | 'paid'
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de solicitudes de retiro
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_codigo TEXT NOT NULL,
  amount           INTEGER NOT NULL,
  metodo           TEXT NOT NULL,      -- 'nequi' | 'daviplata' | 'bancolombia' | 'otro'
  datos_pago       TEXT NOT NULL,
  status           TEXT DEFAULT 'pending',  -- 'pending' | 'paid' | 'rejected'
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Índices para queries rápidas
CREATE INDEX IF NOT EXISTS idx_affiliate_codes_session  ON public.affiliate_codes(session_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_codes_codigo   ON public.affiliate_codes(codigo);
CREATE INDEX IF NOT EXISTS idx_affiliate_codes_email    ON public.affiliate_codes(email);
CREATE INDEX IF NOT EXISTS idx_clicks_codigo            ON public.affiliate_clicks(codigo);
CREATE INDEX IF NOT EXISTS idx_commissions_codigo       ON public.commissions(affiliate_codigo);
CREATE INDEX IF NOT EXISTS idx_commissions_status       ON public.commissions(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_codigo        ON public.withdrawal_requests(affiliate_codigo);
CREATE INDEX IF NOT EXISTS idx_withdrawal_status        ON public.withdrawal_requests(status);

-- ============================================================
-- Si ya corriste el SQL anterior (tabla "affiliates"),
-- este bloque migra los datos y borra la tabla vieja.
-- Si no la creaste, ignora este bloque.
-- ============================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'affiliates'
  ) THEN
    INSERT INTO public.affiliate_codes (session_id, codigo, nombre, email, created_at)
    SELECT session_id, codigo, 'Afiliado', 'sin-email@zenit.app', created_at
    FROM public.affiliates
    ON CONFLICT (codigo) DO NOTHING;

    DROP TABLE public.affiliates;
  END IF;
END $$;
