

## Marketing-Email: Audi SVG Logo ersetzen + Verkäufer-Bild entfernen

### Änderungen in `src/pages/AdminEmailTemplates.tsx`

**1. Verkäufer-Bild entfernen (Zeilen 162-165)**
Den gesamten Avatar-Block (`<td>` mit `<img>`) aus der Signatur entfernen, sodass nur Name/Kontakt übrig bleibt.

**2. SVG-Ringe durch externes Audi-Logo ersetzen (Zeilen 179-185)**
Die inline SVG-Kreise durch ein `<img>` Tag ersetzen:
```html
<img src="https://www.tiemeyer.de/media/uploads/2025/06/Audi.svg" alt="Audi" width="80" style="display:block;" />
```

| Datei | Änderung |
|---|---|
| `src/pages/AdminEmailTemplates.tsx` | Avatar-Block entfernen, SVG durch externes Audi-Logo-Bild ersetzen |

