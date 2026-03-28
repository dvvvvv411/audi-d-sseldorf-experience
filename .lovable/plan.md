

## Fahrzeugbestand-Seite mit Header/Footer von Gebrauchtwagen

### Konzept
Neue oeffentliche Seite `/fahrzeugbestand` die den identischen Header (Audi-Logo + Divider + Standort) und Footer (Copyright, Links, Fussnoten) von `/gebrauchtwagen` uebernimmt. Dazwischen ein 3-Spalten-Grid mit Fahrzeugkarten.

### Technische Umsetzung

**Header** (identisch zu Gebrauchtwagen):
- Sticky weisser Header mit Audi-Ringe-SVG, Divider, Standort-Name
- Kein Berater-Bereich (da kein spezifischer Verkaeufer-Kontext)
- Branding wird aus der `brandings`-Tabelle geladen (erster Eintrag als Fallback)

**Fahrzeug-Grid**:
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`, max-w-7xl zentriert
- Jede Card:
  - Bild oben (erstes aus `bilder[]`), Fallback-Placeholder
  - Branding-Bar: Audi-Logo + "Audi Gebrauchtwagen"
  - Titel: `fahrzeugname` fett, `beschreibung` einzeilig truncated
  - Specs-Grid 2x3: Gebrauchtwagen, km-Stand, EZ, kW/PS, Kraftstoff, Getriebe (echte DB-Werte)
  - Preis-Footer: dunkel (`bg-gray-800`), Preis formatiert + "inkl. MwSt."

**Footer** (identisch zu Gebrauchtwagen):
- Copyright, rechtliche Links, Fussnoten — 1:1 uebernommen

### Dateien

| Datei | Aenderung |
|---|---|
| `src/pages/Fahrzeugbestand.tsx` | Neue Seite: Header + Fahrzeug-Grid + Footer, Daten aus `fahrzeuge` + `brandings` |
| `src/App.tsx` | Route `/fahrzeugbestand` hinzufuegen |

