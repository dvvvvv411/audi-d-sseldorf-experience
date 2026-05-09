## Ziel
Pro Branding kann ein Meta Pixel hinterlegt werden. Verkäufer-Seiten (Fahrzeugbestand & Fahrzeugdetail) feuern dann automatisch den Pixel des dem Verkäufer zugewiesenen Brandings.

## Änderungen

### 1) Datenbank (Migration)
Tabelle `brandings` erweitern:
- `meta_pixel_aktiv boolean not null default false`
- `meta_pixel_code text` (nullable) — speichert das vollständige Snippet inkl. `<script>` und `<noscript>`

### 2) Admin-UI — `src/pages/AdminBrandings.tsx`
Im Branding-Dialog (Hinzufügen & Bearbeiten):
- Neuer Bereich "Meta Pixel"
- `Switch`-Toggle: "Meta Pixel aktivieren"
- Wenn an → `Textarea` (groß, monospace) zum Einfügen des kompletten Meta-Pixel-Snippets
- Werte werden im `payload` gespeichert (`meta_pixel_aktiv`, `meta_pixel_code`)
- Beim Bearbeiten werden die Werte vorbefüllt

### 3) Pixel-Injection auf Verkäuferseiten
Neuer Hook `src/hooks/useMetaPixel.ts`:
- Akzeptiert `code: string | null` und `aktiv: boolean`
- Parsed das Snippet via `DOMParser`, hängt enthaltene `<script>`- und `<noscript>`-Knoten an `document.head` (Scripts müssen neu erstellt werden, damit sie ausgeführt werden)
- Cleanup beim Unmount/Wechsel: angefügte Knoten entfernen

Einbinden in:
- `src/pages/Fahrzeugbestand.tsx` — sobald Branding des Verkäufers geladen ist
- `src/pages/Gebrauchtwagen.tsx` — sobald `verkaeufer[0].branding` vorliegt

So nutzt z.B. Markus Stoll (Branding "Audi Zentrum Berlin") automatisch dessen Pixel.

### 4) Nicht angefasst
- Admin-Seiten (kein Tracking gewünscht)
- Bestehende Brandings ohne Pixel bleiben unverändert (Default `aktiv = false`)

## Hinweis
Der eingefügte Code wird 1:1 ausgeführt. Da nur Admins Brandings bearbeiten können (RLS authenticated-only), ist das XSS-Risiko auf vertrauenswürdige Nutzer beschränkt.