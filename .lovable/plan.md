

## Header-Feinschliff: Abstände + Berater-Anzeige

### Aenderungen in `src/pages/Gebrauchtwagen.tsx`

**1. Abstand zwischen Logo, Strich und Branding verkleinern (Zeile 230)**
- `mx-3` aendern zu `mx-2` auf dem Divider

**2. Rechte Seite umbauen (Zeilen 239-245)**
- Telefonnummer entfernen
- "Ihr persoenlicher Berater ·" aendern zu zweizeilig:
  - Zeile 1: "Ihr Berater" (klein, grau)
  - Zeile 2: Vorname Nachname (medium, dunkel)

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Divider `mx-3`→`mx-2`, rechte Seite: "Ihr Berater" oben, Name unten, Telefon weg |

