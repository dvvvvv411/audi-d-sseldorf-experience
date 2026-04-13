

## Umfangreiche Erweiterungen: Anfragen-Seite & Detail-Seite

### 1. Datenbank-Migration

Neue Spalten in `anfragen`-Tabelle fuer Adressdaten und Ausblendung:

```sql
ALTER TABLE anfragen ADD COLUMN hidden boolean NOT NULL DEFAULT false;
ALTER TABLE anfragen ADD COLUMN strasse text;
ALTER TABLE anfragen ADD COLUMN plz text;
ALTER TABLE anfragen ADD COLUMN stadt text;
```

### 2. AdminAnfragen.tsx -- Suchleiste, Ausblenden, neue Status

**Suchleiste**: Input-Feld ueber der Tabelle, filtert `anfragen` clientseitig nach Name (`vorname`/`nachname`), E-Mail, Telefon, Fahrzeug (`fahrzeug_name`). Case-insensitive Substring-Suche.

**Ausblenden-Button**: Neuer Button (EyeOff-Icon) pro Zeile in der Aktions-Spalte. Setzt `hidden = true` via Supabase-Update. Ausgeblendete Zeilen werden standardmaessig nicht angezeigt.

**Ausgeblendete anzeigen**: Toggle-Button neben der Suchleiste ("Ausgeblendete anzeigen"). Wenn aktiv, zeigt NUR die ausgeblendeten Anfragen. In diesem Modus bekommt jede Zeile einen "Wieder einblenden"-Button (Eye-Icon).

**Status-Aenderungen**: `statusOptions` und `statusColors` komplett ersetzen:

| Status | Farbe |
|---|---|
| Neu | gray |
| In Bearbeitung | blue |
| Moechte Daten | yellow |
| Service gesendet | cyan |
| Moechte Angebot | indigo (NEU) |
| Angebot gesendet | emerald |
| Moechte Rechnung | orange |
| Rechnung gesendet | purple |
| Ueberwiesen (vorher "Bezahlt") | green |
| Angekommen | lime (NEU) |
| Kein Interesse | red (NEU) |

### 3. AdminAnfrageDetail.tsx -- Kopieren, Adresse, Aktionsbuttons

**Kopieren bei Klick**: Name-, E-Mail- und Telefon-Werte in der Kontaktdaten-Card klickbar machen (cursor-pointer, hover:underline). Bei Klick -> `navigator.clipboard.writeText()` + Toast.

**Adressfelder**: Drei optionale Felder (Strasse & Hausnummer, PLZ, Stadt) in der Kontaktdaten-Card. Als editierbare Input-Felder dargestellt, gespeichert via Supabase-Update bei Aenderung (onBlur oder mit Save-Button). State: `adresseStrasse`, `adressePlz`, `adresseStadt`, initialisiert aus `anfrage`.

**Aktionsbuttons-Sektion**: Neue full-width Card zwischen Header und den Kontakt/Nachricht-Cards. Enthaelt die gleichen Buttons wie in der Tabelle:
- Notizen (StickyNote) -- scrollt zu Notizen-Bereich
- Mailbox (Mail) -- Mailbox-Klick loggen
- Angebot erstellen (Receipt) -- navigiert zu `/admin/angebote` mit vorausgefuellten Params (inkl. Adressdaten wenn vorhanden)
- Status-Dropdown (bereits im Header vorhanden, bleibt dort)

**Status**: Gleiche aktualisierte statusOptions/statusColors wie in AdminAnfragen.

### 4. AdminAngebote.tsx -- Adress-Parameter uebernehmen

URL-Parameter erweitern um `strasse`, `plz`, `stadt`. Beim Prefill die entsprechenden Felder (`interessentStrasse`, `interessentPlzStadt`) setzen.

### 5. Angebot-Navigation aus Detail-Seite

Der Receipt-Button navigiert zu:
```
/admin/angebote?fahrzeug={id}&verkaeufer={id}&branding={name}&name={name}&strasse={strasse}&plz={plz}&stadt={stadt}
```

### Dateien

| Datei | Aenderung |
|---|---|
| Migration | 4 neue Spalten: hidden, strasse, plz, stadt |
| `src/pages/AdminAnfragen.tsx` | Suchleiste, Hide/Show-Toggle, Hide-Button pro Zeile, neue Status |
| `src/pages/AdminAnfrageDetail.tsx` | Kopier-Funktion, Adressfelder, Aktionsbuttons-Sektion, neue Status |
| `src/pages/AdminAngebote.tsx` | Adress-URL-Params auslesen und vorausfuellen |

