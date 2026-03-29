

## Datum/Uhrzeit-Spalte in Anfragen-Tabelle

### Änderung in `src/pages/AdminAnfragen.tsx`

1. **Neue Spalte "Datum"** als erste Spalte im TableHeader einfügen
2. **Wert:** `created_at` formatiert als `dd.MM.yyyy HH:mm` (bereits `date-fns` + `de` Locale vorhanden)
3. Sortierung bleibt wie gehabt (neueste zuerst)

| Datei | Änderung |
|---|---|
| `src/pages/AdminAnfragen.tsx` | Neue erste TableHead "Datum" + TableCell mit formatiertem `created_at` |

