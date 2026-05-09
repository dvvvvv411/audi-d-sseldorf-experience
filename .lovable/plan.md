## Problem

In `AdminLayout` filtern wir nur, wenn `role === "caller"`. Solange die Rolle noch nicht geladen ist (`null`), gilt der Admin-Default → alle Reiter sichtbar. caller@caller.de sieht deshalb beim ersten Paint (oder dauerhaft, falls localStorage-Cache fehlt/veraltet ist) die komplette Navigation. Auch der URL-Guard greift nicht, solange `role === null`.

## Lösung

Rolle wird zur Pflicht-Voraussetzung für das Rendern des Admin-Bereichs. Vor dem ersten zuverlässigen Wert wird **nichts** angezeigt (Loading-State), und die DB ist die einzige Wahrheit – kein Vertrauen mehr auf localStorage als Quelle.

### 1. `src/hooks/useUserRole.ts` – neuer Rückgabetyp
- Rückgabe: `{ role: "admin" | "caller" | null, loading: boolean }`.
- `loading` ist `true`, bis die Antwort von `user_roles` (oder „keine Session") da ist.
- `localStorage` nur noch als optionaler Beschleuniger entfernt – wir setzen initial `loading: true`. Das vermeidet jede Stale-Cache-Situation.
- Bei `onAuthStateChange` → `loading: true` setzen und neu laden.

### 2. `src/pages/AdminLayout.tsx`
- `const { role, loading } = useUserRole();`
- Wenn `loading` → Vollflächiger neutraler Loading-Screen (pulsierendes Audi-Logo, gleicher Stil wie bestehende Loading-States) **anstelle** von Sidebar+Outlet. So sieht caller niemals kurz die Admin-Navigation.
- Nav-Filter: Default ist **restriktiv**. Nur `role === "admin"` sieht alle Items; alles andere (inkl. `caller`) sieht nur die Caller-Whitelist.
- URL-Guard greift nach Loading: wenn `role !== "admin"` und Pfad nicht in Whitelist → `<Navigate to="/admin" replace />`.

### 3. `src/pages/AdminAnfragen.tsx`
- `isAdmin = role === "admin"` (statt `role !== "caller"`). Buttons „Angebot erstellen" / „Exposé erstellen" nur sichtbar wenn `isAdmin === true`. Während `loading` werden sie nicht gerendert.

### 4. `src/pages/Auth.tsx`
- `cacheUserRole`-Aufruf kann bleiben (schadet nicht), ist aber nicht mehr maßgeblich, da der Hook DB-first arbeitet.

## Erwartetes Ergebnis

- caller@caller.de sieht ab Login **niemals** Verkäufer, Brandings, Email Templates, Exposés, Angebote, Telegram, Inzahlungnahme – auch nicht für einen Frame.
- Auch direktes Aufrufen einer URL (`/admin/brandings`) leitet sofort auf `/admin` um.
- „Angebot erstellen" / „Exposé erstellen" in `/admin/anfragen` bleiben für caller verborgen.
- Admin-Nutzer sehen während des kurzen Ladens den Loading-Screen statt einer halben Sidebar – konsistent.

## Geänderte Dateien

- `src/hooks/useUserRole.ts` (Refactor: Loading-State, DB-first)
- `src/pages/AdminLayout.tsx` (Loading-Gate, restriktiver Default, URL-Guard)
- `src/pages/AdminAnfragen.tsx` (Button-Sichtbarkeit auf `role === "admin"` umstellen)
