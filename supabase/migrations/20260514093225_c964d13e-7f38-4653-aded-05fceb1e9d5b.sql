
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'admin',
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$ BEGIN INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin'); RETURN NEW; END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can update avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can delete avatars" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars');

CREATE TABLE public.fahrzeuge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  fahrzeugname text NOT NULL,
  preis numeric NOT NULL,
  farbe text,
  kw integer,
  ps integer,
  hubraum integer,
  km_stand integer,
  kraftstoff text,
  getriebe text,
  antrieb text,
  innenausstattung text,
  tueren integer,
  sitze integer,
  erstzulassung text,
  tuev_au text,
  auftragsnummer text,
  fahrgestellnummer text,
  beschreibung text,
  bilder text[] DEFAULT '{}'::text[],
  aktiv boolean NOT NULL DEFAULT true,
  servicenachweis_urls text[] DEFAULT '{}'
);

ALTER TABLE public.fahrzeuge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select fahrzeuge" ON public.fahrzeuge FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert fahrzeuge" ON public.fahrzeuge FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update fahrzeuge" ON public.fahrzeuge FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete fahrzeuge" ON public.fahrzeuge FOR DELETE TO authenticated USING (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('fahrzeuge', 'fahrzeuge', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload fahrzeuge images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'fahrzeuge');
CREATE POLICY "Authenticated users can update fahrzeuge images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'fahrzeuge');
CREATE POLICY "Authenticated users can delete fahrzeuge images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'fahrzeuge');
CREATE POLICY "Public can view fahrzeuge images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'fahrzeuge');

CREATE TABLE public.verkaeufer_fahrzeuge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verkaeufer_id uuid NOT NULL REFERENCES public.verkaeufer(id) ON DELETE CASCADE,
  fahrzeug_id uuid NOT NULL REFERENCES public.fahrzeuge(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (verkaeufer_id, fahrzeug_id)
);

ALTER TABLE public.verkaeufer_fahrzeuge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select verkaeufer_fahrzeuge" ON public.verkaeufer_fahrzeuge FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert verkaeufer_fahrzeuge" ON public.verkaeufer_fahrzeuge FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete verkaeufer_fahrzeuge" ON public.verkaeufer_fahrzeuge FOR DELETE TO authenticated USING (true);

CREATE POLICY "Anon users can select fahrzeuge" ON public.fahrzeuge FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can select verkaeufer" ON public.verkaeufer FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can select verkaeufer_fahrzeuge" ON public.verkaeufer_fahrzeuge FOR SELECT TO anon USING (true);
CREATE POLICY "Anon users can select brandings" ON public.brandings FOR SELECT TO anon USING (true);

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
  notizen text,
  hidden boolean NOT NULL DEFAULT false,
  strasse text,
  plz text,
  stadt text,
  redirect_id text
);

ALTER TABLE public.anfragen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert anfragen" ON public.anfragen FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Auth can select anfragen" ON public.anfragen FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can update anfragen" ON public.anfragen FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX idx_anfragen_redirect_id ON public.anfragen(redirect_id);

CREATE TABLE public.mailbox_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anfrage_id uuid NOT NULL,
  clicked_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mailbox_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can select mailbox_clicks" ON public.mailbox_clicks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can insert mailbox_clicks" ON public.mailbox_clicks FOR INSERT TO authenticated WITH CHECK (true);

CREATE TABLE public.anfrage_notizen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anfrage_id uuid NOT NULL,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.anfrage_notizen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can select anfrage_notizen" ON public.anfrage_notizen FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can insert anfrage_notizen" ON public.anfrage_notizen FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can delete anfrage_notizen" ON public.anfrage_notizen FOR DELETE TO authenticated USING (true);

CREATE TABLE public.aktivitaets_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_email text NOT NULL,
  aktion text NOT NULL,
  details text,
  anfrage_id uuid
);

ALTER TABLE public.aktivitaets_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can insert aktivitaets_log" ON public.aktivitaets_log FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can select aktivitaets_log" ON public.aktivitaets_log FOR SELECT TO authenticated USING (true);

CREATE TABLE public.telegram_chat_ids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id text NOT NULL UNIQUE,
  label text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_chat_ids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can select telegram_chat_ids" ON public.telegram_chat_ids FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can insert telegram_chat_ids" ON public.telegram_chat_ids FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can delete telegram_chat_ids" ON public.telegram_chat_ids FOR DELETE TO authenticated USING (true);

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

CREATE POLICY "Auth can select cloaker_redirects" ON public.cloaker_redirects FOR SELECT TO authenticated USING (true);

ALTER TABLE public.brandings ADD COLUMN sevenio_api_key text;

CREATE TABLE public.sms_verlauf (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  anfrage_id uuid,
  branding_id uuid,
  empfaenger text NOT NULL,
  absender text,
  text text NOT NULL,
  status text NOT NULL,
  fehler text,
  seven_response jsonb
);

ALTER TABLE public.sms_verlauf ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can select sms_verlauf" ON public.sms_verlauf FOR SELECT TO authenticated USING (true);

CREATE INDEX idx_sms_verlauf_created_at ON public.sms_verlauf(created_at DESC);
CREATE INDEX idx_sms_verlauf_anfrage_id ON public.sms_verlauf(anfrage_id);

CREATE TABLE public.email_verlauf (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  anfrage_id uuid,
  branding_id uuid,
  verkaeufer_id uuid,
  empfaenger text NOT NULL,
  absender text,
  betreff text,
  template text,
  status text NOT NULL,
  fehler text,
  resend_id text,
  attachments jsonb,
  html text
);

ALTER TABLE public.email_verlauf ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can select email_verlauf" ON public.email_verlauf FOR SELECT TO authenticated USING (true);

CREATE INDEX idx_email_verlauf_created_at ON public.email_verlauf (created_at DESC);
CREATE INDEX idx_email_verlauf_anfrage_id ON public.email_verlauf (anfrage_id);

ALTER TYPE public.app_role ADD VALUE 'caller';

ALTER TABLE public.brandings
  ADD COLUMN meta_pixel_aktiv boolean NOT NULL DEFAULT false,
  ADD COLUMN meta_pixel_code text,
  ADD COLUMN logo_pdf_url text,
  ADD COLUMN marketing_image_url text,
  ADD COLUMN email_logo_url text,
  ADD COLUMN footer_unternehmensname text,
  ADD COLUMN vorstand jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN originallink text,
  ADD COLUMN eigene_domain text;

INSERT INTO storage.buckets (id, name, public) VALUES ('branding-assets', 'branding-assets', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read branding-assets" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'branding-assets');
CREATE POLICY "Auth can insert branding-assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'branding-assets');
CREATE POLICY "Auth can update branding-assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'branding-assets');
CREATE POLICY "Auth can delete branding-assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'branding-assets');
