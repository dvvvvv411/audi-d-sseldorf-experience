

## Preis-Element klickbar machen → Weiterleitung zu Gebrauchtwagen-Detailseite

### Änderungen in `src/pages/Fahrzeugbestand.tsx`

**1. Verkäufer-Fahrzeug-Zuordnung laden**
- Zusätzlich `verkaeufer_fahrzeuge` fetchen, um pro Fahrzeug den zugeordneten Verkäufer zu ermitteln.
- Verkäufer-Daten (vorname, nachname) laden, um den Slug zu bauen.

**2. FahrzeugCard erweitern**
- Neue Props: `sellerSlug` und `auftragsnummer`
- Das Preis-Footer-Element wird in einen `<Link>` gewrappt, der zu `/gebrauchtwagen/{sellerSlug}/{auftragsnummer}` navigiert.
- Fallback-Slug: `markus_heber` falls kein Verkäufer zugeordnet ist.

**3. Slug-Logik**
- Slug-Format: `vorname_nachname` (lowercase), passend zur bestehenden Gebrauchtwagen-Routing-Logik.
- Pro Fahrzeug: Lookup in `verkaeufer_fahrzeuge` → Verkäufer-ID → Slug bauen. Kein Match → `markus_heber`.

| Datei | Änderung |
|---|---|
| `src/pages/Fahrzeugbestand.tsx` | verkaeufer_fahrzeuge laden, Slug pro Fahrzeug berechnen, Preis-Element als Link zur Detailseite |

