Verstanden: Es geht nicht um Rollen. `caller@caller.de` bleibt Admin. Die Einschränkung muss ausschließlich an der eingeloggten E-Mail hängen.

Plan:
1. Rollenlogik aus der Sidebar-Restriktion entfernen
   - `AdminLayout` soll nicht mehr auf `role` oder `user_roles` warten, um die Sidebar für diesen Fall zu filtern.
   - Die Restriktion wird direkt aus `supabase.auth.getSession()` / `session.user.email` abgeleitet.
   - Vergleich robust: `email.trim().toLowerCase() === "caller@caller.de"`.

2. Sofortiger, flackerfreier Sidebar-Zustand
   - Beim Laden von `/admin` wird zuerst die Auth-Session gelesen.
   - Solange die E-Mail nicht bestimmt ist, wird keine Sidebar gerendert.
   - Sobald die E-Mail `caller@caller.de` ist, wird direkt nur die reduzierte Navigation gerendert.

3. Explizite Sidebar-Allowlist für `caller@caller.de`
   - Sichtbar bleiben nur:
     - Dashboard
     - Fahrzeugbestand
     - Anfragen
     - SMS Verlauf
     - Email Verlauf
   - Ausgeblendet werden exakt:
     - Verkäufer
     - Brandings
     - Email Templates
     - Exposés
     - Angebote
     - Telegram
     - Inzahlungnahme

4. Direkte URL-Sperre nur für `caller@caller.de`
   - Wenn `caller@caller.de` einen gesperrten Pfad direkt öffnet, sofort Redirect nach `/admin`.
   - Andere Admin-Nutzer bleiben komplett unverändert und sehen weiterhin alles.

5. Buttons bleiben wie aktuell funktionierend
   - Die bereits funktionierende Ausblendung von „Angebot erstellen“ und „Exposé erstellen“ bleibt ebenfalls an `caller@caller.de` gekoppelt, nicht an Rollen.