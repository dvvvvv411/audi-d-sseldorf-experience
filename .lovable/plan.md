

## Sidebar fixen: schwarzen Rand entfernen + Cards raus

### Problem
Der schwarze Rand kommt von der `border-l` Klasse im Sheet-Variant (`sheetVariants` fuer `right`), die auf die dunkle `--border` CSS-Variable (18% schwarz) zugreift.

### Aenderungen

**1. `src/pages/Gebrauchtwagen.tsx` (Zeile 264)**
- `border-none` zur SheetContent className hinzufuegen um den schwarzen Rand zu entfernen

**2. `src/pages/Gebrauchtwagen.tsx` (Zeilen 302-341)**
- Die Trennlinie und beide blauen Cards ("Unsere Leistungen" + "Ihre Vorteile") komplett entfernen
- Nur der Ansprechpartner-Bereich bleibt in der Sidebar

### Dateien

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | `border-none` auf SheetContent, Leistungen+Vorteile Cards entfernen |

