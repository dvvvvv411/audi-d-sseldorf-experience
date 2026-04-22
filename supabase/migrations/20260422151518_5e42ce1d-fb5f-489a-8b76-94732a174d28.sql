-- Tabelle für Cloaker-Tracking
CREATE TABLE public.cloaker_redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  redirect_id text NOT NULL UNIQUE,
  ip_address text,
  user_agent text,
  captcha_solved boolean NOT NULL DEFAULT false,
  action_created boolean NOT NULL DEFAULT false,
  callback_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_cloaker_redirects_redirect_id ON public.cloaker_redirects(redirect_id);
CREATE INDEX idx_cloaker_redirects_created_at ON public.cloaker_redirects(created_at DESC);

ALTER TABLE public.cloaker_redirects ENABLE ROW LEVEL SECURITY;

-- Nur authentifizierte Nutzer dürfen lesen (Admin-Übersicht)
CREATE POLICY "Auth can select cloaker_redirects"
ON public.cloaker_redirects
FOR SELECT
TO authenticated
USING (true);

-- Inserts/Updates erfolgen ausschließlich via Service-Role (Edge Functions); keine Policy für anon/authenticated nötig

-- redirect_id Spalte für Anfragen
ALTER TABLE public.anfragen
ADD COLUMN redirect_id text;

CREATE INDEX idx_anfragen_redirect_id ON public.anfragen(redirect_id);