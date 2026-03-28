

## Fahrzeuge einem Verkaeufer zuweisen

### 1. Datenbank

**Neue Verknuepfungstabelle `verkaeufer_fahrzeuge`** (many-to-many):
- id (uuid, PK, default gen_random_uuid())
- verkaeufer_id (uuid, FK -> verkaeufer.id, ON DELETE CASCADE)
- fahrzeug_id (uuid, FK -> fahrzeuge.id, ON DELETE CASCADE)
- created_at (timestamptz, default now())
- UNIQUE(verkaeufer_id, fahrzeug_id)
- RLS: Authenticated CRUD (wie bestehende Tabellen)

### 2. UI-Aenderungen in AdminVerkaeufer.tsx

**Neuer Button auf jeder Verkaeuferkarte** (Car-Icon) neben Bearbeiten/Loeschen:
- Oeffnet einen Dialog mit Checkbox-Liste aller Fahrzeuge aus dem Bestand
- Bereits zugewiesene Fahrzeuge sind vorausgewaehlt
- Speichern synct die Auswahl (loescht alte, fuegt neue Zuweisungen ein)
- Auf der Karte werden zugewiesene Fahrzeuge als kleine Badges/Anzahl angezeigt

### 3. Dateien

| Datei | Aenderung |
|---|---|
| Migration SQL | verkaeufer_fahrzeuge Tabelle, FKs, RLS |
| `src/pages/AdminVerkaeufer.tsx` | Car-Button, Zuweisungs-Dialog, Fahrzeug-Badges |
| `src/integrations/supabase/types.ts` | Wird automatisch aktualisiert |

