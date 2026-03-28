

## Fahrzeugbestand - Neuer Admin-Reiter

### 1. Datenbank

**Tabelle `fahrzeuge`:**
- id (uuid, PK), created_at (timestamptz, default now())
- fahrzeugname (text, not null)
- preis (numeric, not null)
- farbe (text), kw (integer), ps (integer), hubraum (integer), km_stand (integer)
- kraftstoff (text), getriebe (text), antrieb (text), innenausstattung (text)
- tueren (integer), sitze (integer)
- erstzulassung (text), tuev_au (text)
- auftragsnummer (text), fahrgestellnummer (text)
- beschreibung (text) -- Serien- und Sonderausstattung
- bilder (text[] -- Array von Storage-URLs, Reihenfolge = Sortierung)
- RLS: Authentifizierte Nutzer CRUD

**Storage Bucket `fahrzeuge`:** Oeffentlich, fuer Fahrzeugbilder.

### 2. Sidebar & Routing

- Neuer Nav-Eintrag "Fahrzeugbestand" mit Car-Icon in `AdminLayout.tsx`
- Route `/admin/fahrzeugbestand` in `App.tsx`
- Neue Seite `AdminFahrzeugbestand.tsx`

### 3. Seite AdminFahrzeugbestand.tsx

**Tabellenansicht** aller Fahrzeuge:
- Spalten: Bild (erstes aus Array), Fahrzeugname, Preis, km-Stand, Erstzulassung, Kraftstoff, Aktionen
- Bearbeiten/Loeschen Buttons

**Dialog zum Hinzufuegen/Bearbeiten** (scrollbar, grosser Dialog):
- Bilder-Upload mit Drag-and-Drop Sortierung (einfache Pfeile hoch/runter oder Drag-Handles)
- Alle Felder gruppiert: Fahrzeugdaten, Beschreibung
- Textarea fuer Serien- und Sonderausstattung

### 4. Dateien

| Datei | Aenderung |
|---|---|
| Migration SQL | fahrzeuge Tabelle, Storage Bucket, RLS |
| `src/pages/AdminFahrzeugbestand.tsx` | Neue Seite |
| `src/pages/AdminLayout.tsx` | Nav-Eintrag hinzufuegen |
| `src/App.tsx` | Route hinzufuegen |

