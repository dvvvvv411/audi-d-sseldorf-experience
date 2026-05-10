ALTER TABLE public.brandings
  ADD COLUMN IF NOT EXISTS footer_unternehmensname text,
  ADD COLUMN IF NOT EXISTS vorstand jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS originallink text,
  ADD COLUMN IF NOT EXISTS eigene_domain text;

UPDATE public.brandings
SET
  footer_unternehmensname = COALESCE(footer_unternehmensname, 'AUDI AG'),
  vorstand = CASE
    WHEN vorstand = '[]'::jsonb OR vorstand IS NULL
    THEN '["Dieter Dehoorne","Rouven Mohr","Jürgen Rittersberger","Javier Ros Hernández","Marco Schubert","Gerd Walker"]'::jsonb
    ELSE vorstand
  END,
  originallink = COALESCE(originallink, 'https://audi.de'),
  eigene_domain = COALESCE(eigene_domain, 'berlin-audi-zentrum.de')
WHERE name ILIKE '%Audi%';