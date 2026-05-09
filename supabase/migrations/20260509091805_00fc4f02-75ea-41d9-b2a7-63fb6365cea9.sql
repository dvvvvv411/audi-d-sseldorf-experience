ALTER TABLE public.brandings ADD COLUMN IF NOT EXISTS sevenio_api_key text;

CREATE TABLE IF NOT EXISTS public.sms_verlauf (
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

CREATE POLICY "Auth can select sms_verlauf"
  ON public.sms_verlauf FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_sms_verlauf_created_at ON public.sms_verlauf(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_verlauf_anfrage_id ON public.sms_verlauf(anfrage_id);