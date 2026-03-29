

## Specs-Grid Abstände vergrößern

### Änderung in `src/pages/Fahrzeugbestand.tsx`

**Zeile 68:** Specs-Grid Container — vertikales Padding hinzufügen:
- `<div className="bg-[#fbfbfb]">` → `<div className="bg-[#fbfbfb] py-1">`

**Zeile 71:** Einzelne Spec-Zellen — etwas mehr vertikaler Abstand:
- `py-3 px-2` → `py-3.5 px-2`

| Datei | Änderung |
|---|---|
| `src/pages/Fahrzeugbestand.tsx` | Specs-Grid: py-1 auf Container, py-3→py-3.5 auf Zellen |

