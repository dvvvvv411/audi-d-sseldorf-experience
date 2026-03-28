
create policy "Anon users can select fahrzeuge"
  on public.fahrzeuge for select to anon using (true);

create policy "Anon users can select verkaeufer"
  on public.verkaeufer for select to anon using (true);

create policy "Anon users can select verkaeufer_fahrzeuge"
  on public.verkaeufer_fahrzeuge for select to anon using (true);

create policy "Anon users can select brandings"
  on public.brandings for select to anon using (true);
