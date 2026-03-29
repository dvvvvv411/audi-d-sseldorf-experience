

## Loading-Spinner auf /gebrauchtwagen durch Audi-Logo ersetzen

### Änderung in `src/pages/Gebrauchtwagen.tsx`

**Zeilen 280-285** — Gleiche Behandlung wie bei /fahrzeugbestand:
- `animate-spin rounded-full border` Kreis ersetzen durch `AudiLogo` mit `animate-pulse opacity-40 fill="#999"` + "Wird geladen..." Text

Voraussetzung: `AudiLogo` Komponente ist in Gebrauchtwagen.tsx bereits vorhanden (wird dort im Header verwendet).

| Datei | Änderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Loading-Spinner (Zeile 283) durch pulsierende AudiLogo-Animation ersetzen, identisch zu Fahrzeugbestand |

