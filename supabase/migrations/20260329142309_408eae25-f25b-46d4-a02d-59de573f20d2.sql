CREATE TABLE public.anfrage_notizen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anfrage_id uuid NOT NULL,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.anfrage_notizen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can select anfrage_notizen" ON public.anfrage_notizen
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth can insert anfrage_notizen" ON public.anfrage_notizen
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth can delete anfrage_notizen" ON public.anfrage_notizen
  FOR DELETE TO authenticated USING (true);