

## Anfrage-Popup Feintuning

### Aenderungen in `src/pages/Gebrauchtwagen.tsx`

**1. Titel weniger fett (Zeile 706)**
- `font-bold` auf `font-semibold` aendern

**2. Checkbox groesser + abgerundet (Zeile 770-774)**
- `h-5 w-5 rounded` zur className hinzufuegen

**3. Mobile Animation entfernen (Zeile 704)**
- Slide-Animationen komplett entfernen: alle `data-[state=open]:!slide-*` und `data-[state=closed]:slide-*` Klassen raus
- Stattdessen `max-sm:data-[state=open]:!animate-none max-sm:data-[state=closed]:!animate-none` hinzufuegen um auf Mobile jede Animation zu unterdruecken

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Titel font-weight, Checkbox Groesse/Rundung, Mobile Animation entfernen |

