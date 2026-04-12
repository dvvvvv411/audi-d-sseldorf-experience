

## Neuer Admin-Reiter "Exposés" mit PDF-Generierung

### Konzept

Neue Seite `/admin/exposes`. Fahrzeug, Verkäufer und Branding auswählen, PDF-Exposé im Audi-Branding generieren, Vorschau und Download.

### PDF-Layout (A4, 210x297mm, Margins 15mm)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  [Branding Name]                                          ┌────────────┐ │
│  [Straße]                                                 │ Audi Logo  │ │
│  [PLZ Stadt]                                              │ (SVG 80px) │ │
│                                                           └────────────┘ │
│  [Verkäufer Vorname Nachname]                                            │
│  Telefon: [telefon]                                                      │
│  eMail: [email]                                                          │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────────── │
│                                                                          │
│                  [FAHRZEUGNAME - fett, zentriert, ~14pt]                  │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  ┌─────────────────────────────────┐ ┌──────────┐ ┌──────────┐          │
│  │                                 │ │          │ │          │          │
│  │                                 │ │  Bild 2  │ │  Bild 3  │          │
│  │        Großes Bild 1            │ │ 33mm x   │ │ 33mm x   │          │
│  │        108mm x 75mm             │ │ 36mm     │ │ 36mm     │          │
│  │                                 │ ├──────────┤ ├──────────┤          │
│  │                                 │ │          │ │          │          │
│  │                                 │ │  Bild 4  │ │  Bild 5  │          │
│  │                                 │ │ 33mm x   │ │ 33mm x   │          │
│  └─────────────────────────────────┘ │ 36mm     │ │ 36mm     │          │
│                                      └──────────┘ └──────────┘          │
│  Höhe: 36 + 3gap + 36 = 75mm = Großes Bild ✓                            │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────────── │
│  Fahrzeugdaten:                                                          │
│  Farbe:          [farbe]           │  Innenausstattung: [innenausst.]   │
│  kW/(PS):        [kw]/([ps])       │  Türen/Sitze:      [t]/[s]        │
│  Hubraum:        [hubraum]         │  Erstzulassung:    [ez]           │
│  km-Stand:       [km]              │  TÜV/AU:           [tuev]         │
│  Motor/Antrieb:  [kraft.] [getr.]  │  Auftragsnummer:   [auftr.]       │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────────── │
│  Serien- und Sonderausstattung:                                          │
│  [Beschreibungstext, kleiner Font, mehrzeilig]                           │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  Da wir uns Zwischenverkauf vorbehalten       Barpreis:  57.880 €        │
│  müssen, empfehlen wir Ihnen, vor einer                  ~~~~~~~~        │
│  Besichtigung beim genannten Ansprech-                   (sehr groß,     │
│  partner telefonisch rückzufragen, ob                     ~20pt, fett,   │
│  das Fahrzeug noch unverkauft ist.                        rechts neben   │
│                                                           "Barpreis:")   │
│  Erstellt am: [Datum]                         MwSt-Ausweis möglich!     │
│  Zwischenverkauf und Irrtum vorbehalten!                                 │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Preis-Layout Detail (Footer rechts)

```text
Barpreis:  57.880 €      ← "Barpreis:" ~10pt normal, Preis ~20pt fett, auf gleicher Zeile
           MwSt-Ausweis möglich!  ← darunter, kleiner ~8pt
```

Der Preis steht **rechts neben** dem Label "Barpreis:" auf derselben Zeile, in sehr großer Schrift (~20pt, fett). Nicht darunter.

### Technische Umsetzung

- PDF wird client-seitig mit **jsPDF** generiert (kein autoTable nötig, alles manuell gezeichnet)
- Bilder aus Supabase Storage als Base64 laden
- Audi-Logo von `tiemeyer.de` einbetten

### Dateien

| Datei | Änderung |
|---|---|
| `src/pages/AdminExposes.tsx` | Neue Seite: Fahrzeug/Verkäufer/Branding-Auswahl, PDF-Generierung mit jsPDF, Vorschau (iframe blob), Download |
| `src/pages/AdminLayout.tsx` | Nav-Eintrag "Exposés" mit FileText Icon |
| `src/App.tsx` | Route `/admin/exposes` |
| `package.json` | `jspdf` als Dependency |

