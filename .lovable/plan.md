

## Mobile Sidebar auf helles Theme umstellen

### Aenderung in `src/pages/Gebrauchtwagen.tsx`

Die `SheetContent` bekommt explizit helle Farben, da das globale Theme dunkel ist:

- Container: `className="w-full sm:max-w-md overflow-y-auto bg-white text-gray-900"`
- SheetTitle und alle Texte erben dadurch dunkle Farben
- Falls einzelne Elemente noch dunkle Theme-Farben nutzen, werden diese auf explizit helle Werte gesetzt (z.B. `text-gray-600`, `text-gray-500`)

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Zeile 264: `bg-white text-gray-900` auf SheetContent setzen |

