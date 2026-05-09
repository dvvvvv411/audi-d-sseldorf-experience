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

CREATE POLICY "Auth can select email_verlauf"
ON public.email_verlauf
FOR SELECT
TO authenticated
USING (true);

CREATE INDEX idx_email_verlauf_created_at ON public.email_verlauf (created_at DESC);
CREATE INDEX idx_email_verlauf_anfrage_id ON public.email_verlauf (anfrage_id);