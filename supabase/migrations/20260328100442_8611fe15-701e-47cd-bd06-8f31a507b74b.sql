create table public.verkaeufer_fahrzeuge (
  id uuid primary key default gen_random_uuid(),
  verkaeufer_id uuid not null references public.verkaeufer(id) on delete cascade,
  fahrzeug_id uuid not null references public.fahrzeuge(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (verkaeufer_id, fahrzeug_id)
);

alter table public.verkaeufer_fahrzeuge enable row level security;

create policy "Authenticated users can select verkaeufer_fahrzeuge"
  on public.verkaeufer_fahrzeuge for select to authenticated using (true);

create policy "Authenticated users can insert verkaeufer_fahrzeuge"
  on public.verkaeufer_fahrzeuge for insert to authenticated with check (true);

create policy "Authenticated users can delete verkaeufer_fahrzeuge"
  on public.verkaeufer_fahrzeuge for delete to authenticated using (true);