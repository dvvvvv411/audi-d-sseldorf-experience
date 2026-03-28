

## Anfrage-Detailseite aufwerten

### Aktuell
Drei schlichte weiße Karten mit `border-gray-200`, einfache Key-Value-Zeilen, kein visuelles Highlight. Wirkt wie eine Tabelle, nicht wie ein Dashboard.

### Redesign

**1. Header-Bereich mit Status-Badge und Datum**
- Oben: Name groß + farbige Status-Badge (grün fuer NEU, orange fuer In Bearbeitung etc.) + Datum rechts
- Kompakter als jetzt, gibt sofort Kontext

**2. Kontaktdaten-Card mit Icons**
- Jedes Feld bekommt ein Icon (User, Mail, Phone, Calendar)
- Icons in einem kleinen farbigen Kreis (z.B. `bg-blue-50 text-blue-600`)
- Card-Header mit einem farbigen Top-Border (`border-t-4 border-blue-500`)
- E-Mail und Telefon als klickbare Links (`mailto:`, `tel:`)

**3. Nachricht-Card separat hervorheben**
- Eigene Card mit `border-t-4 border-amber-500`
- Nachricht in einem leicht getönten Bereich (`bg-amber-50`) mit Anführungszeichen-Icon
- Mehr Platz, größere Schrift

**4. Fahrzeug-Card mit Preis-Highlight**
- `border-t-4 border-green-500`
- Preis groß und prominent oben anzeigen (`text-2xl font-bold text-green-700`)
- Fahrzeug-Details in einem 2-Spalten-Grid statt als lange Liste
- Kleine Icons fuer Kraftstoff, Getriebe, KM etc.

**5. Verkäufer-Card**
- `border-t-4 border-purple-500`
- Avatar-Kreis mit Initialen
- Kontaktdaten mit Icons, klickbar

**6. Notizen-Card**
- `border-t-4 border-gray-400`
- Speichern-Button prominenter (`bg-gray-900 text-white`)

### Technische Details

**Nur eine Datei:** `src/pages/AdminAnfrageDetail.tsx`

- Import zusätzlicher Lucide-Icons: `User, Mail, Phone, Calendar, Car, Fuel, Gauge, Palette, CreditCard, MessageSquare, StickyNote, Quote`
- Import `Badge` von `@/components/ui/badge`
- Layout bleibt `max-w-5xl` (etwas breiter), Grid wird flexibler:
  - Obere Reihe: Kontakt + Nachricht (2 Spalten)
  - Mittlere Reihe: Fahrzeug + Verkäufer (2 Spalten)  
  - Untere Reihe: Notizen (volle Breite)
- Jede Card bekommt `shadow-sm hover:shadow-md transition-shadow` fuer subtile Interaktivität
- InfoRow-Komponente bekommt optionales `icon`-Prop

| Datei | Aenderung |
|---|---|
| `src/pages/AdminAnfrageDetail.tsx` | Komplettes Card-Redesign mit Icons, farbigen Akzenten, besserem Layout |

