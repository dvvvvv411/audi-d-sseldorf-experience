

## Neuer Reiter "Inzahlungnahme" mit PDF-Generator

### PDF-Visualisierung (A4 Layout)

```text
┌─────────────────────────────────────────────────────┐
│                                          [Audi Logo]│
│  Audi AG                                            │
│  Musterstraße 1                                     │
│  12345 Musterstadt                                  │
│                                                     │
│  Ansprechpartner: Max Mustermann                    │
│  Telefon: +49 123 456789                            │
│  E-Mail: max@audi.de                                │
│                                                     │
│  ─────────────────────────────────────────────────── │
│                                                     │
│          I N Z A H L U N G N A H M E                │
│                                                     │
│  Kunde: Hans Beispiel                               │
│  Musterweg 5                          (optional)    │
│  54321 Beispielstadt                  (optional)    │
│                                                     │
│  Fahrzeug: BMW 320d Touring                         │
│                                                     │
│  ─────────────────────────────────────────────────── │
│                                                     │
│  ┌─────────────────────────────────────────────────┐ │
│  │                                                 │ │
│  │   ┌─────────┐   ┌─────────┐   ┌─────────┐     │ │
│  │   │    1    │   │    2    │   │    3    │     │ │
│  │   │  (car)  │   │ (check) │   │  (car)  │     │ │
│  │   └─────────┘   └─────────┘   └─────────┘     │ │
│  │   Abholung       Prüfung       Rückgabe        │ │
│  │                                                 │ │
│  │   Wir holen      Unser          Ihr Fahrzeug   │ │
│  │   Ihr Fahrzeug   Expertenteam   wird kosten-   │ │
│  │   kostenfrei     begutachtet    frei an Sie     │ │
│  │   bei Ihnen ab.  Ihr Fahrzeug   zurückgebracht.│ │
│  │                  sorgfältig.                    │ │
│  │                                                 │ │
│  └─────────────────────────────────────────────────┘ │
│                                                     │
│  Sehr geehrte/r Herr/Frau Beispiel,                │
│                                                     │
│  wir möchten Ihr Fahrzeug "BMW 320d Touring"        │
│  gerne in Zahlung nehmen. Zur Begutachtung und      │
│  Bewertung holen wir das Fahrzeug kostenfrei bei    │
│  Ihnen ab. Nach Abschluss der Prüfung wird das     │
│  Fahrzeug selbstverständlich kostenfrei wieder an   │
│  Sie zurückgebracht.                                │
│                                                     │
│  Es entstehen Ihnen keinerlei Kosten.               │
│                                                     │
│                                                     │
│  ____________          ___________________________  │
│  Datum                 Unterschrift Verkäufer        │
│                                                     │
│  ─────────────────────────────────────────────────── │
│  Audi AG · Musterstraße 1 · 12345 Musterstadt      │
│  Erstellt am 15.04.2026                             │
└─────────────────────────────────────────────────────┘
```

### Formularfelder

- **Verkäufer** (Select aus DB)
- **Branding** (Select aus DB)
- **Kundenname** (Eingabefeld, Pflicht)
- **Kundenfahrzeug** (Eingabefeld, Pflicht -- Freitext)
- **Straße + Hausnummer** (optional)
- **PLZ + Stadt** (optional)

### Umsetzung

**Neue Datei `src/pages/AdminInzahlungnahme.tsx`:**
- Gleiche Struktur wie AdminAngebote/AdminExposes (Selects, Eingabefelder, Generate/Download/Vorschau)
- jsPDF-Generierung mit dem oben visualisierten Layout
- 3-Schritte-Diagramm wird mit jsPDF-Zeichenfunktionen erstellt (Kreise, Linien, Text)
- Kopf-/Fußbereich identisch zum Angebot-Stil (Audi-Logo rechts oben, Branding links)

**`AdminLayout.tsx`:** Neuer Nav-Eintrag "Inzahlungnahme" mit `CarFront`-Icon

**`App.tsx`:** Route `/admin/inzahlungnahme`

### Dateien

| Datei | Änderung |
|---|---|
| `src/pages/AdminInzahlungnahme.tsx` | NEU -- Formular + PDF-Generator |
| `src/pages/AdminLayout.tsx` | Neuer Nav-Eintrag |
| `src/App.tsx` | Neue Route |

