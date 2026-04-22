

## Cloaker-Tracking: Visitor ohne `?rid=` zuordnen

### Problem
Der Cloaker ruft `kfz-notify` korrekt auf (4 Einträge in DB), aber er hängt **kein `?rid=` an die Visitor-URL**. Dadurch kennt das Frontend die `redirectId` nicht und kann weder Visit- noch Action-Callback senden.

### Lösung: Server-seitiges IP-Matching

Da Cloaker uns IP + User-Agent in `kfz-notify` mitschickt, können wir den Visitor anhand seiner IP identifizieren — ohne dass er `?rid=` in der URL haben muss.

### Flow

```text
Cloaker ──POST──▶ /kfz-notify (speichert rid + ip + ua)
                        │
Visitor öffnet Seite (ohne ?rid=)
                        │
Frontend ──POST──▶ /kfz-resolve  ──▶ findet neuesten rid für diese IP
                        │           ──▶ feuert captchaSolved
                        ▼
            sessionStorage.kfz_rid = rid
                        │
Visitor schickt Anfrage ──▶ kfz-callback mit actionCreated
```

### Komponenten

**1. Neue Edge Function `kfz-resolve` (public, no JWT)**
- GET-Endpoint, liest IP des Aufrufers aus Headern (`x-forwarded-for`, `cf-connecting-ip`).
- Sucht in `cloaker_redirects` den **neuesten Eintrag** der letzten 30 Min mit passender `ip_address` und `captcha_solved=false`.
- Wenn gefunden:
  - Updated `captcha_solved=true`, `callback_sent_at=now()`.
  - Sendet POST an `https://inboxabi.net/api/webhooks/kfz` mit `{ redirectId, captchaSolved: true }`.
  - Gibt `{ redirectId }` an das Frontend zurück.
- Wenn nichts gefunden: `{ redirectId: null }`.

**2. `useRedirectTracking.ts` erweitern**
- Wie bisher: prüft erst `?rid=` URL-Param (falls Cloaker doch mal einen mitgibt).
- **Fallback:** wenn kein `rid` in URL und nichts in `sessionStorage` → ruft `kfz-resolve` auf, speichert das Ergebnis in `sessionStorage`.
- Guard via `kfz_resolve_attempted` damit nicht bei jedem Render gefeuert wird.

**3. `Gebrauchtwagen.tsx` Submit**
- Bleibt unverändert: liest `getRedirectId()` aus sessionStorage und sendet `actionCreated: true`.

### Dateien

| Datei | Änderung |
|---|---|
| `supabase/functions/kfz-resolve/index.ts` | NEU: IP-basiertes Matching, captchaSolved-Callback |
| `src/hooks/useRedirectTracking.ts` | Fallback: ohne `?rid=` → `kfz-resolve` aufrufen |

### Hinweise

- Zeitfenster 30 Min, damit alte IP-Treffer nicht mit neuen Visitors kollidieren.
- Bei NAT/Mehrfach-Visitors aus gleicher IP greift „neuester Eintrag" → minimale Fehlzuordnung möglich, aber praktisch akzeptabel.
- Falls Cloaker später doch `?rid=` mitschickt, hat der URL-Param-Pfad Vorrang.

