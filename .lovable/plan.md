

## Drei Änderungen: Beschreibung formatiert, PDF-Upload Servicenachweis, Suchleiste

### 1. Beschreibung formatiert anzeigen (AdminFahrzeugDetail.tsx)

Die `parseBeschreibung`-Funktion aus `Gebrauchtwagen.tsx` wird extrahiert (oder dupliziert) und in der Admin-Detailseite verwendet. Die Beschreibung wird im `***`-Format geparst und wie auf der Produktseite mit Kategorie-Überschriften und Checkmark-Listen dargestellt. Ein kleiner Toggle-Button ("Rohtext" / "Formatiert") wechselt zwischen formatierter und Rohtext-Ansicht.

### 2. Servicenachweis-PDF Upload (AdminFahrzeugDetail.tsx + DB)

**Datenbank**: Neue Spalte `servicenachweis_urls text[] DEFAULT '{}'` in der `fahrzeuge`-Tabelle für mehrere PDFs.

**UI im Technische Daten Card**:
- Neuer Bereich "Servicenachweis(e)" mit Upload-Button
- PDFs werden in den bestehenden `fahrzeuge` Storage-Bucket hochgeladen (Pfad: `servicenachweise/{fahrzeug_id}/{filename}`)
- Hochgeladene PDFs als Thumbnail-Karten angezeigt (PDF-Icon + Dateiname)
- Klick öffnet PDF in einem Dialog/Popup (iframe)
- Jedes PDF hat einen X-Button zum Entfernen und Option zum Ersetzen

### 3. Suchleiste (AdminFahrzeugbestand.tsx)

Eine Suchleiste oberhalb der Tabelle, die nach `fahrzeugname`, `auftragsnummer` und `fahrgestellnummer` filtert (client-seitig).

### Technische Details

| Datei | Änderung |
|---|---|
| Migration | `ALTER TABLE fahrzeuge ADD COLUMN servicenachweis_urls text[] DEFAULT '{}'` |
| `src/pages/AdminFahrzeugDetail.tsx` | parseBeschreibung + Toggle, PDF-Upload/Anzeige/Löschen im Technische Daten Card |
| `src/pages/AdminFahrzeugbestand.tsx` | Suchleiste mit Filter-Logik |
| `src/integrations/supabase/types.ts` | Wird automatisch aktualisiert |

