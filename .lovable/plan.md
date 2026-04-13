

## Exposé PDF -- 6 Fixes

### Änderungen in `src/pages/AdminExposes.tsx`

**1. Audi Logo -- echtes SVG verwenden**
- Das hochgeladene `Audi.svg` nach `public/images/Audi.svg` kopieren
- Im PDF: SVG als Canvas rendern (Image() mit SVG-Quelle), dann als Base64-PNG in jsPDF einbetten
- `drawAudiRings()` Funktion entfernen

**2. Bilder 50/50 statt 60/40**
- `bigW` von 108mm auf `(contentW - gap) / 2 = 88.5mm` ändern
- `rightW` wird ebenfalls 88.5mm, kleine Bilder `(88.5 - 3) / 2 = 42.75mm` breit

**3. Motor/Antrieb + Antriebsart**
- Zeile 254: `fahrzeug.antrieb` zum Array hinzufügen:
  `[fahrzeug.kraftstoff, fahrzeug.getriebe, fahrzeug.antrieb].filter(Boolean).join(" ")`

**4. Footer 60/40 Layout**
- Linke 60% (contentW * 0.6): Zwischenverkauf-Text + Erstellt am + Disclaimer
- Rechte 40% (contentW * 0.4): "Barpreis:" + Preis vertikal zentriert in dieser Sektion

**5. Barpreis vertikal zentriert + Preis größer**
- Fußzeilen-Gesamthöhe berechnen (~25mm)
- "Barpreis:" Label und Preis vertikal mittig in der rechten 40%-Spalte positionieren
- Preis von 20pt auf ~24pt vergrößern

**6. MwSt-Ausweis in Grau**
- `doc.setTextColor(140, 140, 140)` vor "MwSt-Ausweis möglich!"
- Danach zurück auf `doc.setTextColor(0)`

### Dateien

| Datei | Änderung |
|---|---|
| `public/images/Audi.svg` | SVG-Datei ins Projekt kopieren |
| `src/pages/AdminExposes.tsx` | Alle 6 Fixes: SVG-Logo laden, 50/50 Bilder, Antriebsart, Footer 60/40, Preis zentriert+größer, MwSt grau |

