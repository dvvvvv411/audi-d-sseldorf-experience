

## Rechtsklick auf Bilder blockieren

Auf beiden Seiten wird `onContextMenu={(e) => e.preventDefault()}` auf alle `<img>`-Elemente gesetzt, um das Kontextmenü (Bild speichern, Google-Bildersuche etc.) zu unterbinden.

### Änderungen

| Datei | Änderung |
|---|---|
| `src/pages/Fahrzeugbestand.tsx` | `onContextMenu={e => e.preventDefault()}` auf alle `<img>` Tags |
| `src/pages/Gebrauchtwagen.tsx` | `onContextMenu={e => e.preventDefault()}` auf alle `<img>` Tags |

