

## Audi Logo im Header ersetzen

### Änderung in `src/pages/Gebrauchtwagen.tsx`

**Zeilen 324-328 — SVG mit Kreisen ersetzen durch den offiziellen Audi-Ringe-Pfad:**

Das aktuelle SVG mit 4 `<circle>`-Elementen wird ersetzt durch ein SVG mit dem bereitgestellten `<path>` in schwarz (`fill="black"`).

ViewBox wird auf `0 0 69 24` gesetzt (passend zum Pfad), Breite/Höhe angepasst auf ca. `width="100" height="35"`.

```tsx
<svg width="100" height="35" viewBox="0 0 69 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M57.0623 21.3142C54.9409 21.3142 ... 63.6447 0 57.0623 0Z" fill="black" />
</svg>
```

| Datei | Änderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | SVG-Logo durch offiziellen Pfad ersetzen, `fill="black"` |

