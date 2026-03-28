

## Gebrauchtwagen-Seite: 3 Fixes

### 1. Tooltip-Hintergrund auf Blau (`#00527a`)

Die `TooltipContent`-Komponente nutzt `bg-popover` (dunkel/schwarz aus dem globalen Theme). Fix: Beim Aufruf in `Gebrauchtwagen.tsx` eine eigene `className` mitgeben:

```tsx
<TooltipContent className="bg-[#00527a] text-white border-[#00527a]">
```

### 2. Erstzulassung-Format `03/2018`

Die `formatErstzulassung`-Funktion nutzt `new Date(ez)` — das funktioniert, aber der Wert aus der DB kommt vermutlich als `2018-03-21` (volles Datum mit Tag). `new Date("2018-03-21")` ergibt korrekt Monat 3. Das Problem koennte sein, dass der Wert als deutsches Datum `21.03.2018` gespeichert ist, was `new Date()` nicht parsen kann und dann der Fallback `return ez` greift.

Fix: Robusteres Parsing hinzufuegen — auch `dd.mm.yyyy` Format erkennen:

```ts
const formatErstzulassung = (ez: string | null) => {
  if (!ez) return "–";
  // Handle dd.mm.yyyy format
  const dotMatch = ez.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dotMatch) {
    return `${dotMatch[2].padStart(2, "0")}/${dotMatch[3]}`;
  }
  // Handle yyyy-mm-dd or other parseable formats
  const d = new Date(ez);
  if (!isNaN(d.getTime())) {
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  }
  return ez;
};
```

### 3. Thumbnail-Galerie: Embla Carousel statt overflow-scroll

Statt `overflow-x-auto` mit haesslicher Scrollbar → Embla Carousel (bereits im Projekt als `carousel.tsx` vorhanden) fuer smooth swiping. Darunter eine eigene Progress-Bar die den Scroll-Fortschritt anzeigt (einfacher `div` mit `bg-[#00527a]` und dynamischer Breite basierend auf Scroll-Position).

### Dateien

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Tooltip className, Erstzulassung-Parsing, Thumbnail-Galerie mit Embla Carousel + Progress-Bar |

