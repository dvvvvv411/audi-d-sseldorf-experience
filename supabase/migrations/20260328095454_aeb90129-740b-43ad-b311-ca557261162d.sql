-- Create fahrzeuge table
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
  bilder text[] DEFAULT '{}'::text[]
);

-- Enable RLS
ALTER TABLE public.fahrzeuge ENABLE ROW LEVEL SECURITY;

-- RLS policies for authenticated users
CREATE POLICY "Authenticated users can select fahrzeuge" ON public.fahrzeuge FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert fahrzeuge" ON public.fahrzeuge FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update fahrzeuge" ON public.fahrzeuge FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete fahrzeuge" ON public.fahrzeuge FOR DELETE TO authenticated USING (true);

-- Create storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public) VALUES ('fahrzeuge', 'fahrzeuge', true);

-- Storage RLS policies
CREATE POLICY "Authenticated users can upload fahrzeuge images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'fahrzeuge');
CREATE POLICY "Authenticated users can update fahrzeuge images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'fahrzeuge');
CREATE POLICY "Authenticated users can delete fahrzeuge images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'fahrzeuge');
CREATE POLICY "Public can view fahrzeuge images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'fahrzeuge');