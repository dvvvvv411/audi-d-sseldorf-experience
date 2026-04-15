

## Inzahlungnahme: Zahlen statt Icons + Text anpassen

### Aenderungen in `src/pages/AdminInzahlungnahme.tsx`

**1. Icons zurueck zu Zahlen (1, 2, 3)**
- Die drei Icon-Funktionen (`drawPickupIcon`, `drawInspectionIcon`, `drawReturnIcon`) entfernen
- Stattdessen wieder nummerierte Kreise zeichnen (Kreis mit Zahl 1/2/3 darin), wie urspruenglich

**2. Text praezisieren: externer Dienstleister**
- Schritt-Beschreibungen anpassen:
  - Schritt 1: "Ein externer Dienstleister holt Ihr Fahrzeug kostenfrei bei Ihnen ab."
  - Schritt 2: "Unser Expertenteam begutachtet und bewertet Ihr Fahrzeug sorgfaeltig."
  - Schritt 3: "Ihr Fahrzeug wird durch unseren Dienstleister kostenfrei zurueckgebracht."
- Formeller Textabsatz anpassen:
  - `"wir moechten Ihr Fahrzeug [...] gerne in Zahlung nehmen. Zur Begutachtung und Bewertung wird das Fahrzeug durch einen externen Dienstleister kostenfrei bei Ihnen abgeholt. Nach Abschluss der Pruefung wird das Fahrzeug selbstverstaendlich kostenfrei wieder an Sie zurueckgebracht."`

### Dateien

| Datei | Aenderung |
|---|---|
| `src/pages/AdminInzahlungnahme.tsx` | Zahlen-Kreise statt Icons, Text mit externem Dienstleister |

