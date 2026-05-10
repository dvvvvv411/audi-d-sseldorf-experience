ALTER TABLE public.brandings
  ADD COLUMN IF NOT EXISTS logo_pdf_url text,
  ADD COLUMN IF NOT EXISTS marketing_image_url text,
  ADD COLUMN IF NOT EXISTS email_logo_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('branding-assets', 'branding-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can read branding-assets" ON storage.objects;
CREATE POLICY "Public can read branding-assets"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'branding-assets');

DROP POLICY IF EXISTS "Auth can insert branding-assets" ON storage.objects;
CREATE POLICY "Auth can insert branding-assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'branding-assets');

DROP POLICY IF EXISTS "Auth can update branding-assets" ON storage.objects;
CREATE POLICY "Auth can update branding-assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'branding-assets');

DROP POLICY IF EXISTS "Auth can delete branding-assets" ON storage.objects;
CREATE POLICY "Auth can delete branding-assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'branding-assets');