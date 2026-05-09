# Fix: Seitentitel nutzt Branding-Name statt Stadt-Feld

## Problem
`Fahrzeugbestand.tsx` baut Titel aus `branding.stadt` → ergibt "Audi Ingolstadt", weil im Branding "Audi Zentrum Berlin" das `stadt`-Feld z.B. den Sitz/eine andere Adresse enthält. Korrekt wäre der Anzeigename des Brandings ("Audi Zentrum Berlin").

## Änderung
`src/pages/Fahrzeugbestand.tsx`:
- `cityLabel` ersetzen durch `brandLabel = branding?.name || "Audi"`.
- Title: `Fahrzeugbestand · {brandLabel}`
- Description: `Unser aktueller Fahrzeugbestand bei {brandLabel}. Große Auswahl an Neu- und Gebrauchtwagen.` (Fallback ohne Name analog).

Nichts anderes anfassen.
