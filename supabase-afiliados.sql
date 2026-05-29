-- ============================================================
-- SQL para el sistema de afiliados de IkigAI
-- Correr en Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Agregar columna referred_by a form_sessions (si no existe)
ALTER TABLE public.form_sessions
  ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- 2. Tabla de afiliados
-- Cada usuario que pagó puede tener un código único de referido
CREATE TABLE IF NOT EXISTS public.affiliates (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  UUID REFERENCES public.form_sessions(id) ON DELETE CASCADE,
  codigo      TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de clicks de afiliados
-- Registra cada visita a /ref/[codigo]
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo     TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de comisiones
-- Se crea una fila por cada venta generada por un afiliado
CREATE TABLE IF NOT EXISTS public.commissions (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_codigo  TEXT NOT NULL,
  buyer_session_id  UUID REFERENCES public.form_sessions(id),
  amount            INTEGER DEFAULT 10000,  -- en COP
  status            TEXT DEFAULT 'pending', -- 'pending' | 'paid'
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Índices para queries rápidas
CREATE INDEX IF NOT EXISTS idx_affiliates_session_id  ON public.affiliates(session_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_codigo       ON public.affiliates(codigo);
CREATE INDEX IF NOT EXISTS idx_clicks_codigo           ON public.affiliate_clicks(codigo);
CREATE INDEX IF NOT EXISTS idx_commissions_codigo      ON public.commissions(affiliate_codigo);
CREATE INDEX IF NOT EXISTS idx_commissions_status      ON public.commissions(status);
