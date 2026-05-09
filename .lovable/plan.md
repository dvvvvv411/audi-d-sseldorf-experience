## Neues Email-Template: "Persönliches Angebot"

Eine vierte Sektion auf `/admin/email-templates`, aufgebaut analog zum "Servicebericht & Exposé"-Template.

### Dropdowns (alle automatisch vorausgewählt)
- **Kunde** (aus `anfragen`)
- **Verkäufer**
- **Branding**
- **Fahrzeug** (übernommen aus Anfrage, überschreibbar)

### Anrede per KI
Nutzt die bestehende `detect-gender` Edge Function + den vorhandenen `genderCache`:
- male → `Sehr geehrter Herr {Nachname},`
- female → `Sehr geehrte Frau {Nachname},`
- unknown → `Sehr geehrte/r Herr/Frau {Nachname},`

### Vorschau Betreff
```
Ihr persönliches Angebot – {Fahrzeugname}
```

### Vorschau Email-Inhalt (Beispiel: "Maria Schmidt", "Audi A6 Avant 45 TFSI")

```
Sehr geehrte Frau Schmidt,

vielen Dank für Ihr Interesse an unserem Fahrzeug
sowie für das angenehme Telefonat.

Wie bereits telefonisch besprochen, sende ich Ihnen
hiermit Ihr persönliches Angebot zum Audi A6 Avant 45 TFSI.
Alle relevanten Eckdaten, Konditionen und Ausstattungs-
merkmale haben wir in dem beigefügten Dokument für Sie
übersichtlich zusammengestellt.

Wichtig ist uns: Sämtliche Fahrzeuge aus unserem Bestand
werden grundsätzlich mit einer umfassenden Gebrauchtwagen-
garantie übergeben. Diese deckt zentrale Bauteile des
Fahrzeugs ab – darunter Motor, Getriebe, Antrieb, Elektronik
sowie zahlreiche weitere sicherheits- und komfortrelevante
Komponenten. So können Sie Ihr neues Fahrzeug von Anfang
an mit einem sicheren Gefühl genießen, ohne sich Sorgen
um unerwartete Reparaturkosten machen zu müssen.

Sollten Sie Fragen zum Angebot oder zur Garantie haben
oder weitere Informationen wünschen, stehe ich Ihnen
jederzeit gerne per E-Mail oder telefonisch unter
{Telefon Verkäufer} zur Verfügung. Selbstverständlich
können wir auch jederzeit einen Termin für eine
Probefahrt vereinbaren.

Ich freue mich auf Ihre Rückmeldung.

Mit freundlichen Grüßen

{Signatur Verkäufer + Audi-Ringe + Branding-Footer}
```

### Technische Details
- Neue Funktion `generatePersoenlichesAngebotEmail(branding, verkaeufer, fahrzeug, anrede)` in `AdminEmailTemplates.tsx`.
- Neue States: `paKunde`, `paVerkaeufer`, `paBranding`, `paFahrzeug`. Auto-Vorauswahl im bestehenden `load()`-`useEffect`.
- Auto-Übernahme des Fahrzeugs aus der Kundenanfrage analog zur Servicebericht-Sektion.
- Wiederverwendung von `genderCache` und `buildAnrede` (kein zusätzlicher KI-Call nötig, wenn Kunde bereits im Cache).
- Signatur-Block + Footer identisch zu den anderen Templates.
- Betreff (kopierbar) + HTML-Vorschau im iframe + "HTML kopieren"-Button.

### Geänderte Dateien
- `src/pages/AdminEmailTemplates.tsx`

Bitte bestätigen – danach baue ich es ein.