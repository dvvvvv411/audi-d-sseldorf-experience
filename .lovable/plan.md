

## Thumbnail-Abstand eliminieren

### Problem
Die Thumbnails haben `gap-px` aber jeder Button hat `border-2` (2px Rand). Der transparente Border erzeugt den sichtbaren weissen Abstand.

### Loesung

In `src/pages/Gebrauchtwagen.tsx` (Zeile 90 + 95-96):
- `gap-px` aendern zu `gap-0` (kein Abstand)
- `border-2` aendern zu `border` (1px statt 2px) oder `ring` statt border verwenden
- Fuer den aktiven Zustand: `ring-2 ring-[#00527a] ring-inset` statt border, und `border-0` damit kein extra Platz entsteht

So wird der Abstand zwischen Thumbnails praktisch unsichtbar.

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | `gap-px` → `gap-0`, `border-2` → `ring-2 ring-inset` fuer selected state |

