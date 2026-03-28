CREATE TABLE public.anfragen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  vorname text NOT NULL,
  nachname text NOT NULL,
  email text NOT NULL,
  telefon text NOT NULL,
  nachricht text NOT NULL,
  datenschutz_akzeptiert boolean NOT NULL DEFAULT false,
  fahrzeug_id uuid NOT NULL,
  fahrzeug_name text NOT NULL,
  fahrzeug_preis numeric NOT NULL,
  auftragsnummer text,
  verkaeufer_id uuid NOT NULL,
  verkaeufer_name text NOT NULL,
  branding_name text NOT NULL,
  status text NOT NULL DEFAULT 'NEU',
  notizen text
);

ALTER TABLE public.anfragen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert anfragen" ON public.anfragen FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Auth can select anfragen" ON public.anfragen FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can update anfragen" ON public.anfragen FOR UPDATE TO authenticated USING (true) WITH CHECK (true);