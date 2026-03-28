

## Fahrzeug-Zusammenfassung + Anfrage-Button in Mobile Sidebar

### Aenderung in `src/pages/Gebrauchtwagen.tsx` (Zeilen 268-302)

Nach dem Ansprechpartner-Bereich und vor dem schliessenden `</div>` werden eingefuegt:

**1. Fahrzeug-Zusammenfassung**
- Trennlinie (`border-t border-gray-200 pt-4`)
- Fahrzeugname als Ueberschrift (`text-lg font-semibold`)
- Kompakte Info-Liste mit Icons: Preis, km-Stand, Erstzulassung, Kraftstoff, Leistung (PS/kW)
- Stil: `text-sm text-gray-600`, Icons in `text-gray-400`

**2. "Fahrzeug anfragen"-Button**
- Volle Breite, petrolblau (`bg-[#00527a]`), weisse Schrift
- Oeffnet `mailto:` mit dem Verkaeufer-Email und vorausgefuelltem Betreff (Fahrzeugname + Auftragsnummer)
- Unter der Zusammenfassung, mit `mt-4`

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Zeile ~301: Fahrzeug-Kurzinfos + Anfrage-Button in Sidebar einfuegen |

