## Problem

Aktuell wird das PDF clientseitig mit `pdfjs-dist` in reinen Text umgewandelt und alle Text-Items werden mit einem Leerzeichen aneinandergehängt (`AdminFahrzeugbestand.tsx`, Zeile 100). Damit gehen Spalten- und Zeileninformationen verloren.

Im neuen Caddy-Exposé ist der "Fahrzeugdaten"-Block 4-spaltig (Label/Wert | Label/Wert) und "Innenausstattung: Stoff" steht in der Kopfzeile rechts. Ohne Koordinaten ergibt der Join eine Reihenfolge wie
`Innenausstattung: Stoff Farbe: ... kW/(PS): 110/(150) Türen/Sitze: 5/5 ...`
Dadurch ordnet das LLM Werte falschen Labels zu (km-Stand, Antrieb, Innenausstattung, TÜV/AU, Auftragsnummer werden teils leer/falsch) und der Serien-/Sonderausstattungsblock wird unsauber abgegriffen.

## Lösung

Statt selbst Text zu extrahieren, das PDF **direkt als `inline_data` an Gemini** schicken. Gemini liest das PDF mit Layout-Verständnis und liefert über den bestehenden Tool-Call sauber strukturierte Daten – unabhängig davon, ob das Layout 2-spaltig (alt) oder 4-spaltig (Caddy) ist.

### Änderungen

1. **`supabase/functions/extract-fahrzeug-pdf/index.ts`**
   - Request-Body akzeptiert `pdf_base64` (Pflicht) plus optional `filename`. `text` wird als Fallback geduldet, aber Vision ist der Default.
   - User-Message wird zu einem `content`-Array mit `{ type: "file", file: { filename, file_data: "data:application/pdf;base64,..." } }` (OpenAI-kompatibles File-Format, das das Lovable AI Gateway für Gemini durchreicht).
   - System-Prompt erweitern:
     - Hinweis, dass "Fahrzeugdaten" 2- oder 4-spaltig sein kann; Labels immer mit dem Wert in derselben Zeile/Spalte verknüpfen.
     - Explizite Beispiele für die problematischen Felder (km-Stand als reine Zahl, Antrieb aus "Motor/Antrieb" als 3. Teil, Innenausstattung kann oben rechts oder rechts in der Tabelle stehen, TÜV/AU im Format `MM.YYYY/MM.YYYY`, Auftragsnummer ist eine 5–8-stellige Zahl).
     - `beschreibung`: alles ab "Serien- und Sonderausstattung:" bis vor dem Disclaimer "Da wir uns Zwischenverkauf vorbehalten…" bzw. "Barpreis:" wörtlich inkl. aller `***` Trenner übernehmen – nichts kürzen, nichts umformulieren.
   - Fehlende Felder weiterhin weglassen; VIN-Regex-Fallback aus Dateiname bleibt.

2. **`src/pages/AdminFahrzeugbestand.tsx`**
   - `handlePdfFile`: pdfjs-Block entfernen und stattdessen die PDF-Bytes in Base64 wandeln (FileReader → `result.split(",")[1]`) und als `{ pdf_base64, filename }` an die Edge Function übergeben.
   - Größenwarnung: wenn Datei > 15 MB, Toast „PDF zu groß" und abbrechen (Gateway-Limits).
   - Mapping auf `form` bleibt unverändert.
   - Import `pdfjs-dist` und Worker-Setup können entfernt werden (in dieser Datei nicht mehr nötig).

3. **Keine** DB- oder Schema-Änderungen, keine Änderungen an `AdminFahrzeugDetail.tsx` (Servicenachweis-Upload bleibt wie es ist).

### Validierung

- Hochgeladenes `Caddy_Hybrid_Expose.pdf` testen → erwartet:
  - `km_stand: 12143`, `antrieb: "Frontantrieb"`, `getriebe: "Automatik"`, `kraftstoff: "Hybrid-Plugin"`, `innenausstattung: "Stoff"`, `tuev_au: "06.2028/06.2028"`, `auftragsnummer: "120204"`, vollständige `beschreibung` mit allen `***` Blöcken.
- Altes Tiemeyer/A6-Exposé muss weiter funktionieren (gleicher Code-Pfad).
