## Ziel
Nur der User mit der ID `0bc8bcc6-3555-4888-80b5-8a74df8a6873` bekommt eine eingeschränkte `/admin`-Navigation und startet immer direkt bei `Anfragen`.

## Änderungen
1. **Restriction von E-Mail auf User-ID umstellen**
   - In `AdminLayout.tsx` wird nicht mehr `caller@caller.de` geprüft.
   - Stattdessen wird `session.user.id === "0bc8bcc6-3555-4888-80b5-8a74df8a6873"` geprüft.

2. **Sidebar exakt filtern**
   - Für genau diese User-ID werden diese Reiter ausgeblendet:
     - Dashboard
     - Verkäufer
     - Brandings
     - Email Templates
     - Exposés
     - Angebote
     - Telegram
     - Inzahlungnahme
   - Sichtbar bleiben:
     - Fahrzeugbestand
     - Anfragen
     - SMS Verlauf
     - Email Verlauf

3. **Startseite erzwingen**
   - Wenn dieser User `/admin` öffnet, wird er direkt nach `/admin/anfragen` weitergeleitet.
   - `Dashboard` ist für ihn nicht mehr erreichbar.

4. **Direktzugriff sperren**
   - Wenn dieser User eine verbotene Admin-URL direkt öffnet, wird er nach `/admin/anfragen` weitergeleitet.
   - Alle anderen Admin-User behalten unverändert vollen Zugriff.

## Technische Details
- `AdminLayout.tsx` speichert zusätzlich die aktuelle `userId` aus `supabase.auth.getSession()` und `onAuthStateChange`.
- `isRestricted` basiert ausschließlich auf der User-ID, nicht auf Rolle und nicht auf E-Mail.
- Die erlaubten Pfade für diese User-ID sind:
  - `/admin/fahrzeugbestand`
  - `/admin/fahrzeugbestand/:id`
  - `/admin/anfragen`
  - `/admin/anfragen/:id`
  - `/admin/sms`
  - `/admin/email`
- `/admin` selbst leitet für diese User-ID sofort auf `/admin/anfragen` weiter.