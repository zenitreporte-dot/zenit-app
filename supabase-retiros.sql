-- ============================================================
-- SQL: Sistema de retiros de afiliados
-- Correr en Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_codigo TEXT NOT NULL,
  amount           INTEGER NOT NULL,
  metodo           TEXT NOT NULL,   -- 'nequi' | 'bancolombia' | 'daviplata' | 'otro'
  datos_pago       TEXT NOT NULL,   -- número de celular o cuenta
  status           TEXT DEFAULT 'pending', -- 'pending' | 'paid' | 'rejected'
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_withdrawal_codigo ON public.withdrawal_requests(affiliate_codigo);
CREATE INDEX IF NOT EXISTS idx_withdrawal_status ON public.withdrawal_requests(status);
