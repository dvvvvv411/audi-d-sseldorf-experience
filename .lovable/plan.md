

## Dynamischer Seitentitel auf /gebrauchtwagen/:sellerSlug/:auftragsnummer

### Konzept
Statt `usePageMeta` statisch beim Rendern aufzurufen, wird der Seitentitel dynamisch gesetzt, nachdem `fahrzeug` und `branding` geladen sind. Format: `SQ5 TDI Q - Audi Zentrum Düsseldorf`.

### Änderung in `src/pages/Gebrauchtwagen.tsx`

1. **Zeile 130:** Statischen `usePageMeta(...)` Aufruf entfernen
2. **Neuer `useEffect`** nach dem Datenladen: Setzt `document.title` und Meta-Tags dynamisch basierend auf `fahrzeug.fahrzeugname` und `branding.name`
   - Titel: `{fahrzeugname} - {branding_name}` (z.B. "SQ5 TDI Q - Audi Zentrum Düsseldorf")
   - Description: `{fahrzeugname} kaufen bei {branding_name}. Geprüfter Gebrauchtwagen mit Garantie.`
   - Fallback wenn kein Fahrzeug/Branding: bisheriger statischer Text

| Datei | Änderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Statischen `usePageMeta` durch dynamischen `useEffect` ersetzen, der auf `fahrzeug` und `verkaeufer` reagiert |

