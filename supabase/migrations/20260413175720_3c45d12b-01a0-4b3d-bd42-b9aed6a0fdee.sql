CREATE TABLE public.telegram_chat_ids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id text NOT NULL UNIQUE,
  label text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_chat_ids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can select telegram_chat_ids" ON public.telegram_chat_ids
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can insert telegram_chat_ids" ON public.telegram_chat_ids
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can delete telegram_chat_ids" ON public.telegram_chat_ids
  FOR DELETE TO authenticated USING (true);