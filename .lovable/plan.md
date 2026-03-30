

## Footer von Fahrzeugbestand an Gebrauchtwagen angleichen

Der Footer in `/fahrzeugbestand` ist kürzer — es fehlen die erweiterten WLTP-Informationen (Zusatzausstattungen-Text) sowie die Fußnoten ² und ³.

### Änderung in `src/pages/Fahrzeugbestand.tsx`

Zeilen 317-321 ersetzen: Den vollständigen Fußnoten-Block aus `Gebrauchtwagen.tsx` übernehmen:
- Fußnote ¹: Vollständiger WLTP-Text (inkl. Zusatzausstattungen und www.audi.de/wltp)
- Fußnote ²: EC-Karte / Kreditkarten / Standgebühr
- Fußnote ³: E-Auto-Förderung Privatkunden

| Datei | Änderung |
|---|---|
| `src/pages/Fahrzeugbestand.tsx` | Zeilen 317-321: Vollständigen Fußnoten-Block aus Gebrauchtwagen übernehmen |

