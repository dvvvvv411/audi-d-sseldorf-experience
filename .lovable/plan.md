

## Favicon ersetzen

1. `public/favicon.webp` löschen
2. `user-uploads://favicon.ico` → `public/favicon.ico` kopieren
3. `index.html`: Favicon-Link von `/favicon.webp` auf `/favicon.ico` ändern (`type="image/x-icon"`)

| Datei | Änderung |
|---|---|
| `public/favicon.webp` | Löschen |
| `public/favicon.ico` | Neues Favicon (kopiert) |
| `index.html` | `href="/favicon.ico"` + `type="image/x-icon"` |

