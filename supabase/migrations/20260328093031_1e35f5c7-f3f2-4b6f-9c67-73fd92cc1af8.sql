
-- Brandings table
CREATE TABLE public.brandings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  strasse text NOT NULL,
  plz text NOT NULL,
  stadt text NOT NULL,
  email text NOT NULL,
  amtsgericht text NOT NULL,
  handelsregister text NOT NULL,
  geschaeftsfuehrer text NOT NULL,
  ust_id text NOT NULL,
  resend_api_key text,
  email_absender text,
  absendername text,
  sevenio_absendername text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.brandings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select brandings" ON public.brandings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert brandings" ON public.brandings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update brandings" ON public.brandings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete brandings" ON public.brandings FOR DELETE TO authenticated USING (true);

-- Verkaeufer table
CREATE TABLE public.verkaeufer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vorname text NOT NULL,
  nachname text NOT NULL,
  email text NOT NULL,
  telefon text NOT NULL,
  avatar_url text,
  branding_id uuid REFERENCES public.brandings(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.verkaeufer ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select verkaeufer" ON public.verkaeufer FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert verkaeufer" ON public.verkaeufer FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update verkaeufer" ON public.verkaeufer FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete verkaeufer" ON public.verkaeufer FOR DELETE TO authenticated USING (true);

-- Avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can update avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can delete avatars" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars');
