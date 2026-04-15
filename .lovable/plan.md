

## Inzahlungnahme verbessern: Anrede + Full-Width Text + Icons

### Aenderungen in `src/pages/AdminInzahlungnahme.tsx`

**1. Anrede-Feld (Herr/Frau)**
- Neuer State `anrede` mit Werten `"Herr"` | `"Frau"`
- Select-Feld im Formular (vor Kundenname)
- PDF-Text passt sich an: `"Sehr geehrter Herr Nachname"` oder `"Sehr geehrte Frau Nachname"`

**2. Full-Width Text**
- Formellen Text (Zeilen 210-218) als zusammenhaengende Strings mit `doc.splitTextToSize(text, contentW)` umbrechen statt manueller Zeilenaufteilung
- Ergibt sauberen Fliesstext ueber die volle Seitenbreite

**3. Thematische Icons statt Nummern**
- Schritt 1 (Abholung): Stilisiertes Auto-Symbol (Linien/Rechtecke)
- Schritt 2 (Pruefung): Lupe mit Haekchen
- Schritt 3 (Rueckgabe): Haus-Symbol mit Pfeil
- Gezeichnet mit jsPDF-Vektorfunktionen (Linien, Kreise, Rechtecke)

### Dateien

| Datei | Aenderung |
|---|---|
| `src/pages/AdminInzahlungnahme.tsx` | Anrede-Select, full-width Text, thematische Icons |

