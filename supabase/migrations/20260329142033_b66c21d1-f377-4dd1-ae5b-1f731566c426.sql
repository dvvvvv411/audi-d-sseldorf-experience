CREATE TABLE public.mailbox_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anfrage_id uuid NOT NULL,
  clicked_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mailbox_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can select mailbox_clicks" ON public.mailbox_clicks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth can insert mailbox_clicks" ON public.mailbox_clicks
  FOR INSERT TO authenticated WITH CHECK (true);