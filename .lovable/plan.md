

## Änderungen an Angebote & Anfragen

### 1. AdminAngebote.tsx – PDF-Änderungen

**Disclaimer entfernen** (Zeilen 354-363): Den Text "Angaben ohne Gewähr / Im Zuge der optischen Aufbereitung..." komplett entfernen.

**Bild-Verzerrung beheben** (Zeile 192): Statt fester Aspect Ratio `0.45` das tatsächliche Seitenverhältnis des Bildes berechnen, indem das Bild zuerst in ein `Image`-Objekt geladen wird und `naturalWidth/naturalHeight` verwendet wird.

**Divider bei Kostenaufschlüsselung entfernen** (Zeilen 269-281): Die `drawLine()`-Aufrufe innerhalb der Preistabelle entfernen. Nur die finale Linie über der Gesamtsumme bleibt.

### 2. AdminAnfragen.tsx – Angebot-Button + neue Status

**Angebot-Button**: In der Aktions-Spalte (neben Notizen, Mail, Eye) einen neuen Button mit `Receipt`-Icon hinzufügen. Bei Klick navigiert er zu `/admin/angebote` und übergibt via URL-Suchparameter die IDs:
- `?fahrzeug={fahrzeug_id}&verkaeufer={verkaeufer_id}&branding={branding_name}&name={vorname}+{nachname}`

Dafür müssen `fahrzeug_id` und `verkaeufer_id` zum `Anfrage`-Interface hinzugefügt werden (sie kommen bereits aus `select("*")`).

**Neue Status-Optionen**: `"Service gesendet"` und `"Angebot gesendet"` zur `statusOptions`-Liste und `statusColors`-Map hinzufügen.

### 3. AdminAngebote.tsx – URL-Parameter auslesen

Beim Laden der Seite die URL-Suchparameter auslesen (`useSearchParams`) und die Felder vorausfüllen:
- `selectedFahrzeugId` aus `fahrzeug`
- `selectedVerkaeuferId` aus `verkaeufer`
- `selectedBrandingId` über Namens-Abgleich aus `branding`
- `interessentName` aus `name`

### Dateien

| Datei | Änderung |
|---|---|
| `src/pages/AdminAngebote.tsx` | Disclaimer entfernen, Bild-Aspect-Ratio fix, Divider entfernen, URL-Params vorausfüllen |
| `src/pages/AdminAnfragen.tsx` | Angebot-Button + 2 neue Status |

