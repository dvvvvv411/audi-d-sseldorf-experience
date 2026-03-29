

## Aktivitätsprotokoll: Username dezenter, Kundenname dominanter

### Änderung in `src/pages/AdminAnfragen.tsx`

Zeilen 252-260 anpassen:

- **User-Email** (`admin@admin.de`): von `text-xs font-medium text-gray-900` auf `text-[10px] text-gray-400` — kleiner und grauer
- **Details** (enthält Kundenname): von `text-xs text-gray-500` auf `text-sm font-medium text-gray-900` — groesser und fetter
- Reihenfolge umkehren: Details/Kundenname zuerst anzeigen, dann User-Email + Aktionslabel darunter

Ergebnis: Der Kundenname springt sofort ins Auge, die Admin-Email ist nur als Zusatzinfo sichtbar.

| Datei | Änderung |
|---|---|
| `src/pages/AdminAnfragen.tsx` | Zeilen 252-260: Styling tauschen, Details prominenter, Email dezenter |

