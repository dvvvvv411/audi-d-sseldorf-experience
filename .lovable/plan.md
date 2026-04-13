

## Plan: Dashboard mit echten Daten, Anfragen-Layout, Kontaktdaten-UX

### 1. AdminDashboard.tsx -- Echte Daten statt Mockup

Kompletter Rewrite. Statt Mockdaten werden beim Laden echte Daten aus Supabase geholt:

**Stats-Karten (obere Reihe):**
- Fahrzeuge gesamt (aus `fahrzeuge` Tabelle, `aktiv = true`)
- Neue Anfragen (aus `anfragen`, Status `Neu` oder `NEU`, `hidden != true`)
- Offene Anfragen (Status nicht in `Überwiesen`, `Angekommen`, `Kein Interesse`)
- Überwiesen/Angekommen (Status `Überwiesen` oder `Angekommen`)

**Tabellen (untere Reihe):**
- "Neueste Anfragen" -- die 5 neuesten Anfragen aus DB, mit Name, Fahrzeug, Status, Datum. Klickbar -> navigiert zur Detail-Seite.
- "Neueste Fahrzeuge" -- die 5 neuesten aktiven Fahrzeuge aus DB, mit Name, Preis.

Alles via `useEffect` + `useState` laden, mit Loading-Spinner.

### 2. AdminAnfragen.tsx -- Suchleiste neben Titel

Die aktuelle Struktur hat den Titel links und Suche+Button rechts in einer Zeile, aber die Suchleiste ist zu schmal und unauffällig.

Änderung: Titel "Anfragen" als `h2`, daneben direkt die Suchleiste (breiter: `w-[400px]` statt `w-[300px]`), daneben der Ausgeblendete-Button. Alles in einer `flex items-center gap-3` Zeile.

### 3. AdminAnfrageDetail.tsx -- Kontaktdaten inline mit Edit-Modus

**Kontaktdaten (Name, E-Mail, Telefon):**
- Standardmäßig als fester Text dargestellt (wie `DetailRow`), klickbar zum Kopieren.
- Ein einzelner Stift-Button (Pencil-Icon) neben "Kontaktdaten" Überschrift.
- Bei Klick auf Stift: alle 4 Felder werden zu Input-Feldern mit Speichern/Abbrechen Buttons.
- State: `editingContact` boolean.

**Adresse:**
- Standardmäßig als fester Text: `Straße, PLZ Stadt` oder "–" wenn alles leer.
- Ein einzelner Stift-Button neben "Adresse" Überschrift.
- Bei Klick: alle 3 Felder (Straße, PLZ, Stadt) werden zu Inputs mit Speichern/Abbrechen.
- State: `editingAdresse` boolean.

**Copy-Buttons entfernen:** Keine separaten Copy-Buttons mehr. Klick auf den Text selbst kopiert den Wert (bereits im `DetailRow` onClick vorhanden, muss nur für Name/Email/Telefon angewendet werden).

### Dateien

| Datei | Änderung |
|---|---|
| `src/pages/AdminDashboard.tsx` | Komplett neu: echte Daten aus Supabase |
| `src/pages/AdminAnfragen.tsx` | Suchleiste breiter, direkt neben Titel |
| `src/pages/AdminAnfrageDetail.tsx` | Kontaktdaten + Adresse: inline-Text mit Edit-Modus, Copy-Buttons entfernen |

