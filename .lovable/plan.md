## Ziel
`caller@caller.de` bekommt eine eigene Rolle `caller` mit eingeschränkter UI. Sichtbarkeit wird **flackerfrei** über einen synchronen localStorage-Cache gelöst.

## 1. Datenbank — Migration
- Enum `app_role` um Wert `'caller'` erweitern.
- `UPDATE public.user_roles SET role='caller' WHERE user_id = (SELECT id FROM auth.users WHERE email='caller@caller.de')`.
- `handle_new_user` bleibt unverändert (neue Signups bleiben `admin`).

## 2. Neuer Hook `src/hooks/useUserRole.ts`
- Liest beim Mount **synchron** aus `localStorage["audi.userRole"]` → kein Flackern.
- Lädt parallel im Hintergrund die echte Rolle aus `public.user_roles` und aktualisiert State + Cache, falls abweichend.
- Bei `SIGNED_OUT` Cache leeren.

## 3. Login-Flow `src/pages/Auth.tsx`
- Nach erfolgreichem `signInWithPassword`: Rolle einmal aus `user_roles` laden und in localStorage schreiben **bevor** auf `/admin` navigiert wird.
- Garantiert: beim ersten Render im Admin-Bereich ist der korrekte Wert da.

## 4. Sichtbare Reiter pro Rolle (`AdminLayout.tsx`)
Allowed-Pfade:
- `admin`: alle (wie bisher)
- `caller`: nur `/admin`, `/admin/fahrzeugbestand`, `/admin/anfragen`, `/admin/sms`, `/admin/email`

`mainNav` und `verwaltungNav` werden vor dem Render mit dem Hook-Wert gefiltert.

## 5. URL-Guard
Kleines Hilfsmittel in `AdminLayout.tsx` (oder neuer Wrapper): Wenn `role === 'caller'` und aktueller Pfad nicht in der Allow-List → `<Navigate to="/admin" replace />`. Verhindert direkten URL-Zugriff auf verbotene Reiter.

## 6. `AdminAnfragen.tsx`
- Buttons **"Angebot erstellen"** und **"Exposé erstellen"** nur wenn `role === 'admin'` rendern.
- Email senden, Status ändern, Notizen, Hide, Detail-Link: bleiben sichtbar.

## Geänderte/neue Dateien
- Migration (Enum + Rolle aktualisieren)
- **Neu:** `src/hooks/useUserRole.ts`
- **Edit:** `src/pages/AdminLayout.tsx`, `src/pages/AdminAnfragen.tsx`, `src/pages/Auth.tsx`

## Reihenfolge
1. Migration
2. `useUserRole` Hook
3. `Auth.tsx` Rolle cachen
4. Sidebar filtern + URL-Guard in `AdminLayout`
5. Buttons in `AdminAnfragen` ausblenden