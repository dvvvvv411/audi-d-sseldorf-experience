

## Status-Dropdown in /admin/anfragen

### Änderungen in `src/pages/AdminAnfragen.tsx`

1. **Status-Werte definieren**: Array mit den erlaubten Status-Werten:
   - `Neu` (statt `NEU`)
   - `In Bearbeitung`
   - `Möchte Daten`
   - `Möchte Rechnung`
   - `Rechnung versendet`
   - `Bezahlt`

2. **Status-Badge durch Select-Dropdown ersetzen** (Zeile ~167-170): Statt der statischen Badge ein `<Select>` mit `<SelectItem>` für jeden Status. Bei Änderung: Supabase-Update auf `anfragen.status` und lokalen State aktualisieren.

3. **Farbcodierung pro Status** (Badge-Farben im Select-Trigger):
   - Neu → grau
   - In Bearbeitung → blau
   - Möchte Daten → gelb
   - Möchte Rechnung → orange
   - Rechnung versendet → purple
   - Bezahlt → grün

4. **DB-Kompatibilität**: Der Default-Wert in der DB ist `'NEU'`. Bestehende Einträge mit `NEU` werden beim Anzeigen auf `Neu` gemappt. Beim Speichern wird der neue Wert (z.B. `Neu`, `In Bearbeitung`) direkt geschrieben.

5. **Sidebar-Badge anpassen** in `AdminLayout.tsx`: Count-Query muss auf `status = 'Neu'` UND `status = 'NEU'` prüfen (`.in("status", ["NEU", "Neu"])`), damit alte und neue Einträge gezählt werden.

### Technische Details

| Datei | Änderung |
|---|---|
| `src/pages/AdminAnfragen.tsx` | Select-Import, Status-Array, Badge→Select, updateStatus-Funktion |
| `src/pages/AdminLayout.tsx` | Status-Filter auf `["NEU", "Neu"]` erweitern |

