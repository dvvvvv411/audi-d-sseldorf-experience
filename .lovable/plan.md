

## Zwei Anpassungen: Thumbnail-Abstand + Sticky Ansprechpartner

### 1. Thumbnail-Abstand minimieren
- In der `ThumbnailGallery`-Komponente: `gap-1` aendern zu `gap-px` (1px Abstand statt 4px)

### 2. Ansprechpartner-Spalte fixiert (sticky)
- Die rechte 40%-Spalte im Details-Bereich (Zeile 337) bekommt `lg:sticky lg:top-4 lg:self-start` damit sie beim Scrollen mitlaeuft

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | `gap-1` → `gap-px` in ThumbnailGallery, `lg:sticky lg:top-4 lg:self-start` auf Ansprechpartner-Container |

