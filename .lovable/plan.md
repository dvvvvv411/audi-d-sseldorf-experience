

## Header fuer /gebrauchtwagen — Weiss mit Audi-Logo, Standort + Verkaeufername

### Design

Weisser Header mit:
- **Links**: Audi-Ringe Logo (SVG, schwarz)
- **Mitte**: Standortname aus Branding (`branding.name`, z.B. "Audi Zentrum Duesseldorf")
- **Rechts**: Verkaeufername (`vorname nachname`) mit kleinem Label "Ihr Berater"
- **Unten**: 1px hellgraue Trennlinie (`border-b border-gray-200`)

Auf Mobile: Logo links, Standort darunter, Verkaeufername entfaellt (ist ja unten im Ansprechpartner-Bereich sichtbar).

```text
Desktop:
+--[Audi ::::] -------- Audi Zentrum Duesseldorf -------- Ihr Berater: Max Mustermann --+
+--- border-b border-gray-200 ---------------------------------------------------------+

Mobile:
+--[Audi ::::] --- Audi Zentrum Duesseldorf --+
+--- border-b border-gray-200 ---------------+
```

### Umsetzung

**Datei: `src/pages/Gebrauchtwagen.tsx`**
- Neuen Header-Bereich am Anfang des Returns einfuegen (vor dem Titel)
- Audi-Ringe als inline SVG (4 Ringe, schwarz, ca. 120px breit)
- Standort aus `branding.name` (bereits geladen via `verkaeufer[0]?.branding`)
- Verkaeufername aus `verkaeufer[0]?.vorname` + `nachname`
- Sticky Header mit `sticky top-0 z-50 bg-white` damit er beim Scrollen oben bleibt

### Daten

Alle Daten sind bereits vorhanden:
- `branding.name` → Standortname (z.B. "Audi Zentrum Duesseldorf")
- `verkaeufer[0].vorname / nachname` → Beratername

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Header-Komponente mit Audi-SVG-Logo, Standort, Verkaeufername einfuegen |

