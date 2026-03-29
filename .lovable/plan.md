

## Favicon durch Audi-Logo ersetzen

### Änderungen

**1. Audi-Logo kopieren:**
- `user-uploads://audi-logo-audi-icon-transparent-free-png.webp` → `public/favicon.webp`

**2. `public/favicon.ico` löschen** (falls vorhanden)

**3. `index.html` aktualisieren:**
- Favicon-Link hinzufügen mit `<link rel="icon" href="/favicon.webp" type="image/webp">`
- Apple-Touch-Icon für mobile Geräte
- Open Graph Bild-Meta-Tag für Google/Social-Media-Erkennung

| Datei | Änderung |
|---|---|
| `public/favicon.webp` | Neues Audi-Logo als Favicon |
| `public/favicon.ico` | Löschen |
| `index.html` | Favicon-Links + OG-Image Meta-Tags hinzufügen |

