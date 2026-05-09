## Ziel
Im Aktivitätsprotokoll auf `/admin/anfragen` sollen keine SMS-Einträge mehr angezeigt werden (z.B. "SMS gesendet" / "SMS fehlgeschlagen").

## Änderung
**Datei:** `src/pages/AdminAnfragen.tsx` (Query um Zeile 150)

- Beim Laden des Aktivitätsprotokolls die Supabase-Query so anpassen, dass Einträge mit `aktion ILIKE 'SMS%'` ausgeschlossen werden (`.not("aktion", "ilike", "SMS%")`).
- Limit von 50 bleibt bestehen.

## Nicht angefasst
- Edge Function `send-anfrage-sms` loggt weiterhin in `aktivitaets_log` (für Audit-Zwecke / SMS-Verlauf-Seite). Nur die Anzeige im Anfragen-Aktivitätsprotokoll wird gefiltert.
- Keine DB-Migration, keine Änderung anderer Seiten (Dashboard etc.).

Sag Bescheid, wenn die SMS-Einträge stattdessen komplett nicht mehr geloggt werden sollen — dann passe ich die Edge Function an.