

## Gebrauchtwagen-Seite Optimierungen

### Aenderungen in `src/pages/Gebrauchtwagen.tsx`

**1. 3x3 Grid-Zellen neu gestalten**
- Outline von `border-white/20` aendern zu `border-[#3a3a3a]` (gleiches Grau wie Hintergrund)
- Zellen-Hintergrund auf `bg-[#3c3c3c]` (leicht heller als `#323232`)
- Icons groesser: von `size={20}` auf `size={28}`
- Tooltip auf jeder Zelle mit beschreibendem Titel (z.B. "Kilometerstand", "Erstzulassung", "Leistung", "Kraftstoff", "Getriebe", "Farbe", "Antrieb", "Auftragsnummer") — nutze `TooltipProvider`/`Tooltip`/`TooltipTrigger`/`TooltipContent` aus den vorhandenen UI-Komponenten

**2. Header-Untertitel fixen**
- Branding-Name (`AUDI AG` o.ae.) aus dem Untertitel entfernen
- Nur `ab {preis} EUR` anzeigen

**3. Thumbnails groesser**
- Von `h-20 w-28` auf `h-28 w-[calc((100%-2rem)/5.5)]` bzw. feste Groesse ca. `h-28 w-48` damit ca. 5,5 Bilder sichtbar sind
- Custom Scrollbar-Styling per CSS: schlanke Scrollbar in Farbe `#00527a` statt Browser-Standard

**4. Erstzulassung-Format**
- Bereits als `MM/YYYY` implementiert — bleibt so, funktioniert korrekt

### Dateien

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Grid-Styling, Icons groesser, Tooltips, Thumbnails groesser, Untertitel fix |
| `src/index.css` | Custom Scrollbar-Klasse `.scrollbar-petrol` mit `#00527a` Farbe |

