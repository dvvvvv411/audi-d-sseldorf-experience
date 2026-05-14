## Ziel
Im Popup "Fahrzeug hinzufügen" auf `/admin/fahrzeugbestand` ein Drag-and-Drop-Feld einbauen, in das ein Fahrzeug-PDF (z.B. Tiemeyer/SEG-Angebot) gezogen werden kann. Die Felder Fahrzeugname, Preis, Farbe, kW, PS, Hubraum, km-Stand, Kraftstoff, Getriebe, Antrieb, Innenausstattung, Türen, Sitze, Erstzulassung, TÜV/AU, Auftragsnummer, Fahrgestellnummer und Serien-/Sonderausstattung werden automatisch ausgefüllt.

## Umsetzung

### 1. PDF-Text-Extraktion (Client)
- Paket `pdfjs-dist` installieren.
- Beim Drop wird das PDF im Browser ausgelesen → reiner Text.

### 2. Strukturierte Extraktion via Lovable AI Gateway
- Neue Edge Function `extract-fahrzeug-pdf` (POST mit `{ text }`).
- Ruft Lovable AI Gateway (`google/gemini-2.5-flash`) mit Tool-Calling/JSON-Schema auf und gibt ein sauberes JSON mit allen Feldern zurück.
- Fahrgestellnummer wird zusätzlich aus dem Dateinamen geparst (Muster `WAU…`), falls im PDF-Inhalt nicht enthalten – wie im Beispiel `A6_-_WAUZZZF22PN037331.pdf`.
- Beschreibung (Serien-/Sonderausstattung) wird **wörtlich** aus dem PDF übernommen (kein Umformulieren), inkl. der `***`-Trenner.

### 3. UI im Dialog (`AdminFahrzeugbestand.tsx`)
- Neues Drag-and-Drop-Feld ganz oben im Dialog ("PDF hier ablegen oder klicken zum Hochladen").
- Statusanzeige: "PDF wird gelesen…" → "Daten extrahiert".
- Nach Erfolg werden alle Form-Felder vorausgefüllt; vorhandene Eingaben werden überschrieben.
- Bilder bleiben unberührt – die fügt der Nutzer wie bisher manuell hinzu.
- Funktioniert nur im "Hinzufügen"-Modus (nicht beim Bearbeiten).
- Fehlerfall: Toast "PDF konnte nicht gelesen werden".

### 4. Mapping-Regeln
- `Motor/Antrieb: Diesel Automatik/Allradantrieb` → Kraftstoff=`Diesel`, Getriebe=`Automatik`, Antrieb=`Allradantrieb`.
- `kW/(PS): 150/(204)` → kW=150, PS=204.
- `Türen/Sitze: 4/5` → Türen=4, Sitze=5.
- `Barpreis: 43.460 €` → Preis=43460.
- Fahrzeugname = Überschrift unter dem Briefkopf (z.B. `A6 40 TDI Q 2x S LINE`).

## Technische Details
- Neue Datei: `supabase/functions/extract-fahrzeug-pdf/index.ts` (registriert in `supabase/config.toml`, JWT off).
- Nutzt `LOVABLE_API_KEY` (bereits vorhanden).
- `pdfjs-dist` als neue Dependency; Worker via `?url`-Import gebündelt.
- `AdminFahrzeugbestand.tsx`: neuer State `extracting`, Handler `handlePdfDrop`, kleiner Drop-Bereich oberhalb des Bilder-Blocks im Dialog.

Keine Datenbank-Änderungen nötig.