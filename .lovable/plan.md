

## Neue Sektion: Energieverbrauch & CO₂-Emissionen

### Design (wie im Screenshot)

Weisser Hintergrund, volle Breite unterhalb des Fahrzeug-Details-Bereichs. Ueberschrift gross: "Information ueber den Energieverbrauch* und die CO₂-Emissionen**"

Darunter ein 4-Spalten Grid:

1. **CO₂ Emissionen**** — CO₂-Label-Chart (A-G Balken in Regenbogenfarben, jeder Balken breiter als der vorherige) + Text "Es wurden keine Angaben zu CO₂ Emissionen hinterlegt."
2. **Verbrauch & Reichweite*** — Label "Energietraeger:" + Wert aus Fahrzeugdaten (`kraftstoff`)
3. **Energiekosten**** — Text "Es wurden keine Angaben zu Kosten hinterlegt."
4. **Leer** — leere Spalte

### CO₂-Label Chart

Sieben horizontale Balken (A-G) mit zunehmender Breite:
- A: gruen (#00a651), schmalster
- B: hellgruen (#51b747)
- C: gelbgruen (#bdd62e)
- D: gelb (#fff200)
- E: orange (#f7941d)
- F: dunkelorange (#f15a24)
- G: rot (#ed1c24), breitester

Jeder Balken ~20px hoch, weisser Buchstabe links.

### Platzierung

Unterhalb des bestehenden Details-Grid (nach Zeile ~413), aber noch innerhalb des aeusseren Containers, vor `</TooltipProvider>`.

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Neue Sektion mit CO₂-Chart, 4-Spalten Grid, Energietraeger aus `fahrzeug.kraftstoff` einfuegen |

