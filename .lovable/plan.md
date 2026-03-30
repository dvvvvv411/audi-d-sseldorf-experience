

## Copy-Button für Fahrzeugbestand-Link auf Verkäufer-Card

### Was passiert

Jede Verkäufer-Card bekommt einen neuen Icon-Button (Copy/Link), der die öffentliche Fahrzeugbestand-URL des Verkäufers in die Zwischenablage kopiert. Die URL wird dynamisch aus `window.location.origin` + `/fahrzeugbestand/` + Seller-Slug (`vorname_nachname` in Kleinbuchstaben) zusammengebaut.

### Änderung in `src/pages/AdminVerkaeufer.tsx`

1. **Import**: `Copy` (oder `Link`) Icon von `lucide-react` hinzufügen
2. **Copy-Handler**: Funktion die den Slug aus Vorname + Nachname bildet und `navigator.clipboard.writeText(...)` aufruft, mit Toast-Feedback
3. **Button**: Neuer Ghost-Button in der Aktions-Leiste (Zeile 242, neben Car/Pencil/Trash2)

```tsx
// Slug: vorname_nachname (lowercase)
const slug = `${v.vorname}_${v.nachname}`.toLowerCase();
const url = `${window.location.origin}/fahrzeugbestand/${slug}`;
navigator.clipboard.writeText(url);
toast.success("Link kopiert");
```

| Datei | Änderung |
|---|---|
| `src/pages/AdminVerkaeufer.tsx` | Copy-Icon importieren, Copy-Button mit Clipboard-Logik in Card-Aktionen einfügen |

