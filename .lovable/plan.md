## Priorisierte Status oben in /admin/anfragen

In `AdminAnfragen.tsx` wird die Sortierung der gefilterten Anfragen so angepasst, dass Anfragen mit den folgenden Status **immer ganz oben** stehen:

1. "Möchte Daten"
2. "Möchte Angebot"
3. "Möchte Rechnung"

### Logik
- Vor dem Pagination-Slice wird `filtered` zusätzlich sortiert.
- Eine Prioritäts-Map vergibt den drei Status feste Indexe (0, 1, 2). Alle anderen Status erhalten einen niedrigeren Rang (z. B. 99).
- Sortierung primär nach Priorität (aufsteigend), sekundär nach `created_at` (absteigend, wie bisher) — damit innerhalb jeder Gruppe weiterhin die neueste Anfrage oben steht.
- Funktioniert nahtlos mit Pagination, Suche und Hidden-Filter.

### Geänderte Datei
- `src/pages/AdminAnfragen.tsx` — Sortierungs-Schritt zwischen Filter und Pagination
