

## Cards modernisieren (Verkäufer + Brandings)

Angelehnt an das Screenshot-Design: abgerundete Cards mit klarer Hierarchie — Titel oben links, Aktionen oben rechts, Tags/Badges in einer Zeile, Details darunter, und Metadaten unten rechts.

### Verkäufer-Cards (`src/pages/AdminVerkaeufer.tsx`)

Neues Layout pro Card:
- `rounded-xl border border-gray-200 bg-white p-6` (abgerundete Ecken, mehr Padding)
- **Zeile 1**: Avatar + Name + Branding-Badge links, Aktions-Icons (Car, Edit, Delete) rechts oben
- **Zeile 2**: Tags-Zeile mit farbigen Badges (z.B. Branding-Name als grüner Badge, Fahrzeug-Count als blauer Badge)
- **Zeile 3**: Email + Telefon als Text
- Kein separater Border-Top für Aktionen — alles in einer fließenden Card

### Brandings-Cards (`src/pages/AdminBrandings.tsx`)

Neues Layout pro Card:
- `rounded-xl border border-gray-200 bg-white p-6`
- **Zeile 1**: Name (fett, groß) links, Edit/Delete Icons rechts
- **Zeile 2**: Badges für Stadt und ggf. weitere Tags
- **Zeile 3**: Details (GF, AG, HRB, USt-IdNr, Email) als kompakter Text
- **Zeile 4**: Adresse unten rechts als dezente Metadaten

### Gemeinsame Stilmerkmale
- `rounded-xl` statt eckig
- `shadow-sm hover:shadow-md transition-shadow` für Tiefe
- Badges: `rounded-full px-3 py-1 text-xs font-medium` mit farbigem Hintergrund
- Aktionen: Icon-Buttons gruppiert oben rechts
- Mehr Whitespace und klare vertikale Hierarchie

| Datei | Änderung |
|---|---|
| `src/pages/AdminVerkaeufer.tsx` | Card-Layout modernisieren: rounded-xl, Badges, Aktionen oben rechts |
| `src/pages/AdminBrandings.tsx` | Card-Layout modernisieren: rounded-xl, Badges, kompaktere Details |

