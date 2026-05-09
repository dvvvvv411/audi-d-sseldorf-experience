# Allgemeinere Seitentitel + dynamische Branding-Stadt

## Problem
- `index.html` und diverse Seiten enthalten hartcodiert "Audi Düsseldorf".
- Verkäuferseiten (z.B. `/fahrzeugbestand/markus_stoll`) zeigen "Audi Düsseldorf" im Titel, obwohl das Branding z.B. Berlin ist.

## Änderungen

### 1. `index.html` (Landingpage / Default)
- Title: `Audi – Premium Fahrzeuge` (statt "Audi Düsseldorf – Ihr Premium-Partner")
- Description: allgemein ohne Stadt, z.B. `Audi Neuwagen, Gebrauchtwagen, Service und Beratung bei Ihrem Audi Partner.`
- OG-Tags entsprechend anpassen.

### 2. `src/pages/Fahrzeugbestand.tsx`
- `usePageMeta` aktuell statisch beim Render. Umbauen, damit Titel dynamisch ist:
  - Wenn `branding?.stadt` vorhanden → `Fahrzeugbestand · Audi {stadt}`
  - Sonst Fallback → `Fahrzeugbestand · Audi`
- Description analog: `Unser aktueller Fahrzeugbestand bei Audi {stadt}. ...` bzw. allgemeiner Fallback.
- Da `usePageMeta` ein Hook ist und vor dem Branding-Load aufgerufen wird, Aufruf nach unten verschieben bzw. mit States `title`/`description` füttern, die nach dem Load aktualisiert werden (Hook reagiert auf Änderungen via `useEffect`-Deps).

### 3. `src/pages/Gebrauchtwagen.tsx` (Detailseite)
- Analog prüfen: dort wird Branding bereits geladen → Titel `{fahrzeugname} · Audi {branding.stadt}` setzen.

### 4. Rechtliche Seiten (`Impressum`, `Datenschutz`, `Cookie-Richtlinie`, `Barrierefreiheit`, `EuDataAct`, `DigitalServicesAct`, `Rechtliches`) + `NotFound`
- Hartcodiertes "Audi Düsseldorf" durch generisches "Audi" ersetzen (diese Seiten haben keinen Branding-Kontext).

### Nicht geändert
- `AdminBrandings.tsx` Placeholder bleibt (nur ein Eingabe-Hint).

## Ergebnis
- Root `/` und allgemeine Seiten zeigen neutralen Titel ohne Stadt.
- Verkäufer-/Fahrzeugbestandsseiten zeigen die Stadt aus dem zugeordneten Branding (z.B. "Audi Berlin").
