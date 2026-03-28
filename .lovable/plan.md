

## Blur-Effekt entfernen, Hintergrund abdunkeln

### Aenderung in `src/components/ui/dialog.tsx`

**DialogOverlay (Zeile 22-27):**
- `backdrop-blur-sm` entfernen
- `bg-black/50` beibehalten (oder auf `bg-black/60` erhoehen fuer staerkere Abdunklung)

### Datei

| Datei | Aenderung |
|---|---|
| `src/components/ui/dialog.tsx` | `backdrop-blur-sm` aus DialogOverlay entfernen |

