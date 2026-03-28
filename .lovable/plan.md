

## Checkbox per Text-Klick aktivierbar machen

### Problem
Obwohl `htmlFor`/`id` gesetzt sind, kann es bei Radix Checkbox vorkommen, dass der native Label-Klick nicht zuverlaessig weitergeleitet wird.

### Aenderung in `src/pages/Gebrauchtwagen.tsx`

**Label (Zeile 776):**
- `onClick={() => setDatenschutz(!datenschutz)}` und `cursor-pointer` zum `<label>` hinzufuegen
- Der Link innerhalb des Labels behaelt `e.stopPropagation()` damit ein Klick auf "Datenschutzbestimmungen" nur den Link oeffnet und nicht die Checkbox toggled

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | `onClick` + `cursor-pointer` auf Label, `stopPropagation` auf Link |

