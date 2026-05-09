## Pagination & Auto-Hide auf /admin/anfragen

### 1. Auto-Hide bei "Kein Interesse"
In der bestehenden Status-Update-Logik in `AdminAnfragen.tsx` (und ggf. `AdminAnfrageDetail.tsx`): Wenn der neue Status `"Kein Interesse"` ist, wird zusätzlich `hidden = true` in der `anfragen`-Tabelle gesetzt. So verschwindet die Anfrage automatisch aus der Standard-Liste und taucht nur noch unter "Ausgeblendete" auf.

### 2. Pagination
Direkt über/unter der Anfragen-Tabelle in `AdminAnfragen.tsx`:

- Neuer State: `pageSize` (Default 25) und `currentPage` (Default 1).
- Dropdown (`Select`) rechts oberhalb der Tabelle mit Optionen: 25, 50, 75, 100.
- Pagination-Komponente (`@/components/ui/pagination`) unterhalb der Tabelle: Prev / Seitenzahlen / Next.
- Pagination wird auf das **bereits gefilterte** Array (`filtered`) angewendet — d.h. Suche + Hidden-Filter laufen weiterhin clientseitig über alle Anfragen, danach wird auf die aktuelle Seite zugeschnitten.
- Bei Änderung von `searchQuery`, `showHidden` oder `pageSize` → `currentPage` auf 1 zurücksetzen.
- Anzeige "Zeige X–Y von Z Anfragen" links neben der Pagination.

### Geänderte Dateien
- `src/pages/AdminAnfragen.tsx` — pageSize/currentPage State, Slice von `filtered`, Pagination-UI, Auto-Hide bei Status "Kein Interesse"
- `src/pages/AdminAnfrageDetail.tsx` — falls Status dort ebenfalls auf "Kein Interesse" geändert werden kann, gleiche Auto-Hide-Logik

Keine DB-Migration nötig (`hidden` existiert bereits).
