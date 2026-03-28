

## Anfrage-Popup fixen: helle Eingabefelder, sichtbare Checkbox, groesseres Popup

### Probleme
- Eingabefelder und Textarea erben die dunklen Theme-Farben (`--input`, `--background` sind fast schwarz)
- Checkbox ist unsichtbar (dunkler Rand auf dunklem Hintergrund)
- Popup koennte groesser sein

### Aenderungen in `src/pages/Gebrauchtwagen.tsx`

**1. Input-Felder (Zeilen 713-750)**
- Allen `<Input>` Feldern `className="bg-white border-gray-300 text-gray-900"` hinzufuegen

**2. Textarea (Zeile 756-762)**
- `className` auf `"min-h-[140px] bg-white border-gray-300 text-gray-900"` aendern

**3. Checkbox (Zeile 766-770)**
- `className` auf `"mt-0.5 border-gray-300 bg-white data-[state=checked]:bg-[#00527a] data-[state=checked]:border-[#00527a] data-[state=checked]:text-white"` aendern

**4. DialogContent groesser (Zeile 704)**
- `max-w-2xl` auf `max-w-3xl` aendern fuer ein groesseres Popup

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Input/Textarea/Checkbox Styling + Popup-Groesse |

