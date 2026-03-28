

## Header-Abstand Fix: Logo ↔ Strich ↔ Name gleichmässig

### Problem
Das SVG hat intern Whitespace rechts vom letzten Ring. Dadurch sieht der Abstand Logo→Strich grösser aus als Strich→Name, obwohl `mx-2` symmetrisch ist.

### Lösung in `src/pages/Gebrauchtwagen.tsx` (Zeile 230)

- `mx-2` ändern zu `ml-1 mr-2` — links (Logo-Seite) weniger Margin, rechts (Name-Seite) bleibt gleich
- Falls nötig: SVG viewBox anpassen um rechten Leerraum zu entfernen (viewBox `0 0 200 80` statt `240 80` und width proportional anpassen)

Konkreter Ansatz: SVG viewBox auf `0 0 188 80` trimmen (letzter Kreis endet bei x=188) und Divider auf `ml-1.5 mr-2` setzen, damit beide Abstände optisch identisch sind.

| Datei | Änderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | SVG viewBox trimmen + Divider Margins asymmetrisch anpassen |

