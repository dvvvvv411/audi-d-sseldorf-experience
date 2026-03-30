

## 4 Änderungen: Fahrgestellnummer, Fahrzeug-Detailseite, Card-Tausch, Status-Dropdown

### 1. Fahrgestellnummer in AnfrageDetail Fahrzeug-Card

**Datei:** `src/pages/AdminAnfrageDetail.tsx`

Nach der Auftragsnummer-Zeile (Zeile 220) eine neue DetailRow für Fahrgestellnummer einfügen:
```tsx
<DetailRow icon={CreditCard} iconColor="bg-emerald-50 text-emerald-600" 
  label="Fahrgestellnummer" value={fahrzeug?.fahrgestellnummer} />
```
Hash-Icon importieren oder CreditCard wiederverwenden.

### 2. Fahrzeug-Detailseite unter /admin/fahrzeugbestand/:id

**Neue Datei:** `src/pages/AdminFahrzeugDetail.tsx`

- Zurück-Button zu `/admin/fahrzeugbestand`
- Header mit Fahrzeugname + Preis
- Card-basiertes Layout im gleichen Stil wie AdminAnfrageDetail (weiße Cards mit farbigem Topbar)
- **Technische Daten Card**: Alle Felder (km-Stand, EZ, Kraftstoff, Getriebe, Antrieb, kW/PS, Hubraum, Farbe, Innenausstattung, Türen, Sitze, TÜV/AU, Auftragsnr, Fahrgestellnr)
- **Bilder Card**: Thumbnail-Grid der Fahrzeugbilder (z.B. 4 Spalten, klickbar zum Vergrößern)
- **Beschreibung/Ausstattung Card**: Freitext-Beschreibung
- Bearbeiten-Button der den Edit-Dialog öffnet (navigate zurück oder eigener Dialog)

**Datei:** `src/App.tsx` — Neue Route `fahrzeugbestand/:id` unter Admin

**Datei:** `src/pages/AdminFahrzeugbestand.tsx` — Zeilen-Klick navigiert zu `/admin/fahrzeugbestand/${f.id}`

### 3. Verkäufer und Notizen Card tauschen in AnfrageDetail

**Datei:** `src/pages/AdminAnfrageDetail.tsx`

Row 2 (Zeilen 202-263): Notizen-Card (bisher ganz unten) an die Position der Verkäufer-Card setzen. Neues Layout:
- Row 2: Fahrzeug + Notizen (nebeneinander)
- Row 3: Verkäufer (volle Breite oder einzeln)

### 4. Status-Badge durch Select-Dropdown ersetzen im Header

**Datei:** `src/pages/AdminAnfrageDetail.tsx`

Zeile 163-165: Das statische Badge durch ein Select-Dropdown ersetzen (gleiche statusOptions und statusColors wie in AdminAnfragen.tsx). Bei Änderung: Status in DB updaten + Aktivitätslog schreiben.

Import: `Select, SelectContent, SelectItem, SelectTrigger, SelectValue` von shadcn/ui.

### Technische Details

| Datei | Änderung |
|---|---|
| `src/pages/AdminAnfrageDetail.tsx` | Fahrgestellnummer-Zeile, Cards tauschen (Notizen↔Verkäufer), Status-Dropdown im Header |
| `src/pages/AdminFahrzeugDetail.tsx` | Neue Detailseite mit allen Fahrzeuginfos + Bilder-Thumbnails |
| `src/pages/AdminFahrzeugbestand.tsx` | Zeilen-Klick navigiert zur Detailseite |
| `src/App.tsx` | Neue Route `fahrzeugbestand/:id` |

