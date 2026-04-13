

## Fix: Echtes Audi Logo in der Anfrage-Bestaetigungs-E-Mail

### Problem
Die E-Mail verwendet derzeit inline-SVG-Kreise als Logo-Ersatz. Viele E-Mail-Clients (Outlook, Gmail) rendern inline-SVGs nicht. Das echte Audi-Logo aus `public/images/Audi.svg` wird nicht verwendet.

### Loesung

**In `supabase/functions/send-anfrage-email/index.ts`:**

1. Das inline-SVG (Zeilen 23-29, die 4 Kreise) durch ein `<img>`-Tag ersetzen, das auf das gehostete Audi-Logo zeigt
2. Das Logo als weisse Version verwenden (weisser `fill` auf schwarzem Header-Hintergrund)
3. Da E-Mail-Clients keine SVGs als `<img src>` unterstuetzen, wird das Logo als **Base64-kodiertes PNG** inline eingebettet (`src="data:image/png;base64,..."`)

**Konkret:**
- Eine weisse Version des Audi-SVG (gleicher Path, `fill="#ffffff"`) als Base64-PNG direkt in die Edge Function einbetten
- Das garantiert Darstellung in allen E-Mail-Clients (Gmail, Outlook, Apple Mail)
- Breite: ~160px, zentriert im schwarzen Header

### Dateien

| Datei | Aenderung |
|---|---|
| `supabase/functions/send-anfrage-email/index.ts` | Inline-SVG-Kreise durch Base64-PNG des echten Audi-Logos (weiss) ersetzen |

