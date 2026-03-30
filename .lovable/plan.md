

## Verkäufer-Card 3-spaltig machen

### Änderung in `src/pages/AdminAnfrageDetail.tsx`

Zeilen 344-348: Das `space-y-1` Layout durch ein 3-spaltiges Grid ersetzen. Avatar+Name, E-Mail und Telefon nebeneinander statt untereinander.

Neues Layout:
- **Spalte 1**: Avatar + Name + Branding (bereits vorhanden, bleibt)
- **Spalte 2**: E-Mail
- **Spalte 3**: Telefon

Den Avatar-Block (Zeilen 334-342) und die Details (Zeilen 344-348) zusammenfassen in ein `grid grid-cols-3 gap-6 items-center`.

| Datei | Änderung |
|---|---|
| `src/pages/AdminAnfrageDetail.tsx` | Zeilen 333-349: Avatar + E-Mail + Telefon in 3-Spalten-Grid |

