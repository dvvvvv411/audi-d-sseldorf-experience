

## Angebot-Generator im Admin Panel

Neuer Reiter "Angebote" unter `/admin/angebote` zur Erstellung mehrseitiger PDF-Angebote (jsPDF), basierend auf der hochgeladenen Vorlage.

### Admin UI (Formular)

Auswahl-Felder (wie bei Exposes):
- **Fahrzeug** (Select)
- **Branding** (Select)
- **Verkaufer** (Select)

Eingabefelder Interessent:
- **Voller Name** (Text-Input)
- **Strasse + Hausnummer** (Text-Input)
- **PLZ + Stadt** (Text-Input)

Preisfeld:
- **Nachlass in EUR** (Number-Input, optional, Default 0)

Buttons: "Angebot erstellen" + "PDF herunterladen", darunter iframe-Vorschau.

### PDF-Layout (4 Seiten, A4, jsPDF)

```text
┌─────────────────────────────────────────────┐
│  SEITE 1 – Deckblatt                        │
│                                             │
│  Audi AG                                    │
│  {Branding.strasse}                         │
│  {Branding.plz} {Branding.stadt}            │
│                                             │
│  Ansprechpartner: {Verkaeufer Name}         │
│  Telefon: {Verkaeufer.telefon}              │
│                                             │
│  ══════════════════════════════════          │
│  Angebot                                    │
│  ══════════════════════════════════          │
│                                             │
│  fuer {Interessent Name}                    │
│  {Interessent Strasse}                      │
│  {Interessent PLZ Stadt}                    │
│                                             │
│  ─────────────────────────────────          │
│                                             │
│  ┌──────────────────────────────┐           │
│  │   [Audi Gebrauchtwagen       │           │
│  │    :plus Bild mit rotem      │           │
│  │    Banner]                   │           │
│  └──────────────────────────────┘           │
│                                             │
│  Sprechen Sie Ihren Verkaeufer ueber die    │
│  detaillierten Inhalte des Programms an.    │
│                                   AOG_02_01 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  SEITE 2 – Preisangebot                     │
│                                      - 2 -  │
│  Angebot Nr. {Auto-Nr} vom {Datum}          │
│  an {Interessent Name}                      │
│                                             │
│  ══ Unser Privat-Angebot ══                 │
│                                             │
│  Unter Zugrundelegung der derzeit           │
│  gueltigen Verkaufsbedingungen ...          │
│                                             │
│  {Fahrzeugname} (bold)                      │
│  {Tueren} Tueren, {Getriebe},               │
│  Lackierung: {Farbe}                        │
│  EZ: {EZ}, km: {km}                         │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Fahrzeugpreis        EUR xx.xxx,00  │    │
│  │ Nachlass             EUR -x.xxx,00  │ ← NEU
│  │ Zwischensumme        EUR xx.xxx,00  │    │
│  │ Kostenlose Lieferung EUR     0,00   │ ← NEU
│  │ Gesamtsumme          EUR xx.xxx,00  │    │
│  └─────────────────────────────────────┘    │
│  Alle Werte inkl. gesetzl. MwSt.           │
│                                             │
│  Kontakt + Grussformel                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  SEITE 3+4 – Sonderausstattungen            │
│                                      - 3 -  │
│  Angebotsheader + Fahrzeugdaten             │
│                                             │
│  Die Sonderausstattungen:                   │
│  {Beschreibung zeilenweise,                 │
│   auto Seitenumbruch auf S.4}               │
│                                             │
│  Angaben ohne Gewaehr ...                   │
└─────────────────────────────────────────────┘
```

### Preisberechnung

- **Fahrzeugpreis** = `fahrzeug.preis`
- **Nachlass** = Eingabefeld (EUR, default 0) -- wird als negative Zeile angezeigt
- **Zwischensumme** = Fahrzeugpreis - Nachlass
- **Kostenlose Lieferung** = immer EUR 0,00 (feste Zeile)
- **Gesamtsumme** = Zwischensumme (da Lieferung 0)

### Dateien

| Datei | Aenderung |
|---|---|
| `src/pages/AdminAngebote.tsx` | Neue Seite: Formular (inkl. Nachlass-Feld) + PDF-Generator |
| `src/pages/AdminLayout.tsx` | Nav-Eintrag "Angebote" hinzufuegen |
| `src/App.tsx` | Route `/admin/angebote` hinzufuegen |
| `public/images/audi_gwplus.jpg` | Hochgeladenes Titelbild als Asset |

### Technische Details

- jsPDF wie bei AdminExposes, gleiche Interfaces/Helpers wiederverwenden
- Audi-Logo oben rechts (gleiche `loadAudiLogoAsBase64` Funktion)
- Titelbild (0.jpg) als Base64 eingebettet auf Seite 1
- Angebotsnummer: `{YYMMDD}{random4}`
- Nachlass-Feld: `<Input type="number" />`, bei 0 wird die Nachlass-Zeile trotzdem angezeigt mit EUR 0,00

