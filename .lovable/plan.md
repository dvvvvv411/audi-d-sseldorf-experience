
## Inzahlungnahme: Beraterinfos statt Vorstand im Footer

### Footer-Visualisierung (mit Berater)

```text
─────────────────────────────────────────────────────────────────────
So erreichen       Ihr Berater:         USt-IdNr.:        Bankverbindung
Sie uns:            Max Mustermann       DE811115368       Audi AG Bank
Audi AG             Tel: 0123 456789     Amtsgericht       IBAN: DE72 3702
Vertrieb            E-Mail:              Ingolstadt        0500 0001 0379 00
Auto-Union-         max.mustermann@      HR B 1            BIC: AUIDE71XXX
Straße 1            audi.de
85057
Ingolstadt
─────────────────────────────────────────────────────────────────────
```

**Änderung:** Spalte 2 zeigt jetzt die Verkäuferinfos (Vorname Nachname, Telefon, E-Mail) statt der Vorstandsmitglieder

### Änderungen in `src/pages/AdminInzahlungnahme.tsx`

- Zeilen 260-278: Spalte 2 komplett ersetzen
- Titel: `"Ihr Berater:"` statt `"Vorstand:"`
- Inhalt: 
  - `${verkaeufer.vorname} ${verkaeufer.nachname}`
  - `Tel: ${verkaeufer.telefon}`
  - `E-Mail:`
  - `${verkaeufer.email}` (eventuell mehrzeilig bei langer E-Mail)

### Dateien

| Datei | Änderung |
|---|---|
| `src/pages/AdminInzahlungnahme.tsx` | Spalte 2: Beraterinfos statt Vorstand |
