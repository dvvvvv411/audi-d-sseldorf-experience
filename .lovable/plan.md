

## Zurueck-Button ueber dem Fahrzeugtitel

### Aenderung in `src/pages/Gebrauchtwagen.tsx`

**Zeile 296 (vor dem `<h1>`):**
- `useNavigate` aus `react-router-dom` importieren
- `ArrowLeft` aus `lucide-react` importieren
- Einen Button mit `onClick={() => navigate(-1)}` einfuegen: Pfeil-Icon + "Zurueck"-Text
- Stil: `text-sm text-gray-500 hover:text-gray-900`, inline-flex mit gap, kein Hintergrund

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | `useNavigate` + `ArrowLeft` importieren, Zurueck-Button vor `<h1>` einfuegen |

