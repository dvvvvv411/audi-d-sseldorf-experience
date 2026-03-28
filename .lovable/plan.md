

## Rechtliche Seiten erstellen + Footer aktualisieren

### Neue Seiten

3 neue Seiten unter `/rechtliches/`:

| Route | Datei | Inhalt |
|---|---|---|
| `/rechtliches/impressum` | `src/pages/rechtliches/Impressum.tsx` | Impressum der AUDI AG (Adresse, Vorstand, HR-Eintrag, USt-ID, Streitbeilegung) |
| `/rechtliches` | `src/pages/rechtliches/Rechtliches.tsx` | Haftungsausschluss + Karriere-Hinweis |
| `/rechtliches/datenschutzinformation` | `src/pages/rechtliches/Datenschutzinformation.tsx` | Kompletter Datenschutztext (Abschnitte A-D, inkl. Cookie/Tracking-Infos) |

### Design der Seiten

- Schlichtes Layout: weisser Hintergrund, `max-w-4xl mx-auto px-4 py-12`
- Audi-Logo oben links (klickbar, zurueck zu `/gebrauchtwagen`)
- Ueberschrift `text-2xl font-bold mb-8`
- Fliesstext `text-sm text-gray-700 leading-relaxed`
- Unterueberschriften `text-lg font-semibold mt-8 mb-3`
- Aufzaehlungen als `<ul>` mit `list-disc ml-6`
- Tabellen wo noetig (Datenschutz Abschnitt C.I) als einfache `<table>` mit Borders

### Footer-Aenderungen in `src/pages/Gebrauchtwagen.tsx`

- "Hinweisgebersystem" aus der Footer-Zeile entfernen
- "Impressum", "Rechtliches", "Datenschutzinformation" als Links zu den neuen Seiten machen (React Router `Link`)
- Restliche Labels (Cookie-Einstellungen, Cookie-Richtlinie, etc.) bleiben als Text ohne Link

### Routing in `src/App.tsx`

3 neue Routes hinzufuegen:
```
/rechtliches         → Rechtliches
/rechtliches/impressum → Impressum
/rechtliches/datenschutzinformation → Datenschutzinformation
```

### Dateien

| Datei | Aenderung |
|---|---|
| `src/pages/rechtliches/Impressum.tsx` | Neu: Impressum-Seite |
| `src/pages/rechtliches/Rechtliches.tsx` | Neu: Haftungsausschluss-Seite |
| `src/pages/rechtliches/Datenschutzinformation.tsx` | Neu: Datenschutz-Seite (voller Text) |
| `src/App.tsx` | 3 neue Routes unter `/rechtliches/` |
| `src/pages/Gebrauchtwagen.tsx` | Footer: "Hinweisgebersystem" entfernen, Impressum/Rechtliches/Datenschutz verlinken |

