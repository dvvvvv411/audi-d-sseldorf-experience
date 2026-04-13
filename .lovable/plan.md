

## Erweiterungen: Expose-Button, Kontaktdaten bearbeiten, Mailbox-Verlauf

### 1. AdminAnfragen.tsx -- Expose-Button in Tabelle

Neuer Button (FileText-Icon) in der Aktions-Spalte neben dem Angebot-Button. Bei Klick oeffnet sich ein Dialog mit:
- Drei vorausgefuellte Select-Felder (Fahrzeug, Verkaeufer, Branding) -- vorausgewaehlt anhand der Anfrage-Daten (`fahrzeug_id`, `verkaeufer_id`, `branding_name`-Abgleich)
- "Expose erstellen"-Button der die `generateExposePdf`-Funktion aus AdminExposes aufruft
- "PDF herunterladen"-Button nach Generierung

Dafuer muss die `generateExposePdf`-Funktion und ihre Hilfsfunktionen aus `AdminExposes.tsx` in eine geteilte Datei extrahiert werden (z.B. `src/lib/expose-pdf.ts`), damit beide Seiten sie nutzen koennen. Zusaetzlich muessen `fahrzeuge`, `verkaeufer` und `brandings` im AdminAnfragen geladen werden.

### 2. AdminAnfrageDetail.tsx -- Kontaktdaten bearbeitbar

Name (Vorname/Nachname), E-Mail und Telefon als editierbare Felder darstellen. Aehnlich wie die Adressfelder: Input-Felder mit einem "Speichern"-Button. State-Variablen: `editVorname`, `editNachname`, `editEmail`, `editTelefon`, initialisiert aus `anfrage`. Speicherung via `supabase.from("anfragen").update(...)`.

### 3. AdminAnfrageDetail.tsx -- Expose-Button

In der Aktionsbuttons-Sektion (Zeile 286-300) einen weiteren Button "Expose erstellen" hinzufuegen. Bei Klick oeffnet sich derselbe Dialog wie in der Tabelle -- vorausgefuellt mit Fahrzeug, Verkaeufer und Branding der Anfrage.

### 4. AdminAnfrageDetail.tsx -- Mailbox-Verlauf Card

Neue Card (nach der Verkaeuter-Card, Zeile 445) mit lila/rotem Akzent. Laedt `mailbox_clicks` fuer die aktuelle Anfrage-ID und zeigt eine chronologische Liste der Zeitstempel an. Gleiche Darstellung wie im Popup in der Tabelle.

### Dateien

| Datei | Aenderung |
|---|---|
| `src/lib/expose-pdf.ts` | NEU -- `generateExposePdf` und Hilfsfunktionen aus AdminExposes extrahiert |
| `src/pages/AdminExposes.tsx` | Import aus `expose-pdf.ts` statt lokaler Definition |
| `src/pages/AdminAnfragen.tsx` | Expose-Button + Dialog, Laden von fahrzeuge/verkaeufer/brandings |
| `src/pages/AdminAnfrageDetail.tsx` | Kontaktdaten editierbar, Expose-Button+Dialog, Mailbox-Verlauf Card |

