CREATE TABLE public.aktivitaets_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_email text NOT NULL,
  aktion text NOT NULL,
  details text,
  anfrage_id uuid
);

ALTER TABLE public.aktivitaets_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can insert aktivitaets_log" ON public.aktivitaets_log
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can select aktivitaets_log" ON public.aktivitaets_log
  FOR SELECT TO authenticated USING (true);