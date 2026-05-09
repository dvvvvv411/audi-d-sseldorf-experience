## Änderungen an `/admin/email-templates`

### 1. Dropdowns automatisch vorausfüllen
Branding, Fahrzeug und Verkäufer werden nach dem Laden automatisch auf den ersten Eintrag gesetzt. Vorschau wird gerendert, sobald alle nötigen Felder gefüllt sind – kein "Vorschau laden"-Klick mehr nötig.

### 2. Neues Template: "Servicebericht & Exposé"
Eine dritte Sektion mit folgenden Dropdowns (alle automatisch vorausgewählt):
- **Kunde** (aus Tabelle `anfragen` – zeigt `vorname nachname – fahrzeug_name`)
- **Verkäufer**
- **Branding**
- **Fahrzeug** (wird automatisch aus der Anfrage des Kunden übernommen, kann aber überschrieben werden)

Plus: Betreff (kopierbar) und HTML-Vorschau im iframe + "HTML kopieren"-Button.

### 3. Anrede per KI (Lovable AI Gateway)
Beim Auswählen des Kunden wird der Vorname an eine neue Edge Function `detect-gender` geschickt. Diese nutzt Lovable AI (`google/gemini-3-flash-preview`) mit Structured Output (`{ gender: "male" | "female" | "unknown" }`) und gibt das Geschlecht zurück.

Daraus wird die Anrede gebildet:
- male → `Sehr geehrter Herr {Nachname},`
- female → `Sehr geehrte Frau {Nachname},`
- unknown → `Sehr geehrte/r Herr/Frau {Nachname},` (Fallback)

Das Ergebnis wird im Frontend pro Kunde gecached (kein doppelter Call).

### Vorschau Betreff
```
Servicebericht & Exposé – {Fahrzeugname}
```

### Vorschau Email-Inhalt (Beispiel: Kunde "Maria Schmidt", Verkäufer "Max Mustermann", Fahrzeug "Audi A6 Avant 45 TFSI")

```
Sehr geehrte Frau Schmidt,

vielen Dank für das angenehme und informative Telefonat
sowie für Ihr Interesse an unserem Fahrzeug.

Wie besprochen sende ich Ihnen anbei den vollständigen
Servicebericht sowie das ausführliche Exposé zum
Audi A6 Avant 45 TFSI. Im Servicebericht finden Sie
sämtliche dokumentierten Wartungs- und Servicearbeiten,
die das Fahrzeug während seiner Laufzeit erhalten hat.
Das Exposé bietet Ihnen darüber hinaus einen detaillierten
Überblick über die technischen Daten, die Ausstattung
sowie die Historie des Fahrzeugs.

Bitte nehmen Sie sich in Ruhe die Zeit, beide Dokumente
zu prüfen. Sollten im Anschluss Fragen offenbleiben oder
Sie weitere Informationen wünschen, stehe ich Ihnen
jederzeit gerne per E-Mail oder telefonisch unter
+49 123 4567890 zur Verfügung.

Falls Sie Interesse an einer Probefahrt haben, lässt
sich diese kurzfristig und unverbindlich vereinbaren –
gerne stimme ich mit Ihnen einen passenden Termin ab,
sodass Sie sich persönlich von der Qualität und dem
Fahrgefühl des Fahrzeugs überzeugen können.

Ich freue mich darauf, von Ihnen zu hören.

Mit freundlichen Grüßen

────────────────────────────────────────
Max Mustermann
Verkaufsberater | Audi Tiemeyer
+49 123 4567890 · max@tiemeyer.de

[Audi-Ringe]  Audi Tiemeyer
────────────────────────────────────────
Audi Tiemeyer · Musterstraße 1, 12345 Stadt
Amtsgericht … · HRB … · Geschäftsführer: …
USt-IdNr.: DE…
```

### Technische Details
- **Edge Function** `detect-gender`: nimmt `{ firstName }` entgegen, ruft Lovable AI mit Structured Output auf, gibt `{ gender }` zurück. Nutzt `LOVABLE_API_KEY` (bereits vorhanden).
- **Frontend**: Lädt Kunden aus `anfragen` (alle, sortiert `created_at desc`). Bei Kundenauswahl → ruft `detect-gender` → setzt Anrede → rendert Vorschau.
- **Signatur** identisch zur Marketing-Email (Verkäufer + Audi-Ringe + Branding-Footer).

### Geänderte / neue Dateien
- `src/pages/AdminEmailTemplates.tsx` (neue Sektion + Auto-Vorauswahl)
- `supabase/functions/detect-gender/index.ts` (neu)
- `supabase/config.toml` (Edge Function registrieren)

Bitte bestätige – danach baue ich es ein.