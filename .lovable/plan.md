

## Aktualisierter Plan: Email Template ohne Fahrzeugbild

Gleicher Plan wie zuvor, aber das Fahrzeugbild wird aus der E-Mail-Vorlage entfernt. Die Fahrzeug-Zusammenfassung zeigt nur die Textdaten (Modell, Preis, EZ, km, Kraftstoff, Leistung) ohne Bild.

### Änderungen gegenüber vorherigem Plan

Einzige Änderung: In `generateAnfrageEmail()` wird kein `<img>`-Tag für `fahrzeug.bilder[0]` gerendert. Der Fahrzeug-Block zeigt nur Text:

```text
┌────────────────────────────────┐
│  Ihr ausgewähltes Fahrzeug     │
│  Audi A4 Avant 35 TDI          │
│  Preis: 45.900 €               │
│  EZ: 03/2023 · 15.000 km       │
│  Kraftstoff: Diesel             │
│  Leistung: 163 PS              │
└────────────────────────────────┘
```

Alles andere (Sidebar-Eintrag, Route, Branding/Fahrzeug-Dropdowns, Audi-Styling, Footer) bleibt identisch.

| Datei | Änderung |
|---|---|
| `src/pages/AdminEmailTemplates.tsx` | Neue Seite, Fahrzeug-Block ohne Bild |
| `src/pages/AdminLayout.tsx` | Nav-Item "Email Templates" |
| `src/App.tsx` | Route `/admin/email-templates` |

