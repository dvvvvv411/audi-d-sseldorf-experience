

## Oeffentliche Gebrauchtwagen-Detailseite im Tiemeyer-Style

### Referenz-Analyse (Tiemeyer.de)

Aus den Screenshots und der Webseite ergibt sich folgendes Layout:

```text
+----------------------------------------------------------+
| Fahrzeugtitel (h1, gross, schwarz)                       |
| Untertitel (grau, kleiner: Marke - Standort - ab XX EUR) |
+----------------------------------------------------------+
|                          |                               |
|  Hauptbild (60%)         |  Dunkelgrauer Kasten (40%)    |
|  (grosses Fahrzeugfoto)  |  #323232 Hintergrund          |
|                          |  "Der Audi A7 Sportback"      |
|                          |                               |
|                          |  3x3 Icon-Grid:               |
|                          |  [Gebrauchtwagen] [133.500km] [03/2018]  |
|                          |  [250kW/340PS]   [Super]     [Automatik] |
|                          |  [grau]          [0588/BMV]  [KN004336]  |
|                          |                               |
|                          |  +---------------------------+ |
|                          |  | Preis-Banner #00527a      | |
|                          |  | Links: "Preis"            | |
|                          |  |   "MwSt. nicht ausweisbar"| |
|                          |  | Rechts: 34.260 EUR (gross)| |
|                          |  +---------------------------+ |
|                          |                               |
|                          |  [  Fahrzeug anfragen  ]      |
|                          |  (weisser Button, volle Breite)|
+--------------------------+-------------------------------+
|  Thumbnail-Galerie (horizontal scrollbar)                |
|  [img1] [img2] [img3] [img4] [img5] [img6] ...          |
+----------------------------------------------------------+
|                          |                               |
|  Beschreibung (60%)      |  Standort/Verkaeufer (40%)    |
|  "Beschreibung" (h2)     |  "Standort" (h2)              |
|                          |                               |
|  Getriebe / Antrieb (h3) |  Firmenname (fett)            |
|  ✓ quattro               |  Strasse                      |
|  ✓ S tronic              |  PLZ Stadt                    |
|                          |  Telefon: ...                 |
|  Pakete (h3)             |                               |
|  ✓ Ablage Paket          |  [Anrufen] [Route berechnen]  |
|  ✓ Ambiente Licht Paket  |                               |
|  ...                     |                               |
+--------------------------+-------------------------------+
```

### Wichtige Design-Details aus Tiemeyer

- **Hintergrund**: Weiss/helles Grau (nicht das dunkle Admin-Theme)
- **Hero-Sektion**: Das Hauptbild nimmt ca. 60% ein, die Info-Box rechts ca. 40% mit `#323232` Hintergrund
- **3x3 Grid**: Jede Zelle hat ein Icon oben und den Wert darunter, durch feine Linien getrennt
- **Preis-Banner**: Petrolblau `#00527a`, links Labeltext, rechts gross der Preis
- **"Fahrzeug anfragen"**: Weisser Button mit Icon (Mail), volle Breite, unter dem Preis-Banner
- **Thumbnails**: Horizontal scrollbare Reihe, alle gleich gross, aktives erstes Bild markiert
- **Beschreibung**: `***` wird zu Kategorietitel (h3), Items als Checkmark-Liste (gruene Haekchen)
- **Standort-Karte**: Rechts neben Beschreibung, mit Firmenname, Adresse, Telefon aus dem Branding

### 1. Datenbank / RLS

4 neue RLS Policies — anon SELECT auf `fahrzeuge`, `verkaeufer`, `verkaeufer_fahrzeuge`, `brandings`, damit die oeffentliche Seite ohne Login Daten laden kann.

### 2. Neue Seite `src/pages/Gebrauchtwagen.tsx`

**Daten laden:**
- Erstes Fahrzeug: `supabase.from('fahrzeuge').select('*').limit(1).single()`
- Zugewiesene Verkaeufer mit Branding: `verkaeufer_fahrzeuge` JOIN `verkaeufer` JOIN `brandings`

**Sektionen (von oben nach unten):**

1. **Header**: Fahrzeugtitel (h1), Untertitel mit Branding-Name und Preis
2. **Hero 60/40**: Links Hauptbild, rechts dunkle Info-Box mit:
   - Fahrzeugname als Titel
   - 3x3 Grid mit Icons (Car, Gauge, Calendar, Zap, Fuel, Settings, Palette, Cog, Hash)
   - Werte: Gebrauchtwagen, km-Stand, Erstzulassung (MM/YYYY), kW/PS, Kraftstoff, Getriebe, Farbe, Antrieb, Auftragsnummer
   - Preis-Banner (`#00527a`): 50/50 Split — links Label + MwSt-Hinweis, rechts grosser Preis
   - "Fahrzeug anfragen" Button (weiss, grauer Text, volle Breite)
3. **Thumbnail-Galerie**: Horizontale Scrollbar mit allen Bildern, Klick setzt Hauptbild
4. **Details 60/40**: Links Beschreibung (geparst aus `***`-Format zu Kategorien + Checkmark-Listen), rechts Verkaeufer/Standort-Info aus Branding (Firmenname, Adresse, Telefon, Email)

**Beschreibung-Parsing:**
- `***` bis `:` = Kategorietitel (h3, fett)
- Danach jedes `,`-getrennte Item = Listeneintrag mit gruenem Checkmark-Icon

### 3. Routing

- `/gebrauchtwagen` in `App.tsx` — OHNE ProtectedRoute, fuer alle zugaenglich

### 4. Dateien

| Datei | Aenderung |
|---|---|
| Migration SQL | Anon SELECT Policies fuer fahrzeuge, verkaeufer, verkaeufer_fahrzeuge, brandings |
| `src/pages/Gebrauchtwagen.tsx` | Neue oeffentliche Seite |
| `src/App.tsx` | Route `/gebrauchtwagen` hinzufuegen |

