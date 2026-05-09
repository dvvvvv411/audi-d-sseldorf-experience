ALTER TABLE public.brandings
  ADD COLUMN IF NOT EXISTS meta_pixel_aktiv boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS meta_pixel_code text;