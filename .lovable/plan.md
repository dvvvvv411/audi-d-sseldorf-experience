

## Cloaker-Tracking: Callbacks splitten

### Neues Verhalten

| Event | Callback |
|---|---|
| Visitor öffnet Seite mit `?rid=kfz_xxx` | `captchaSolved: true` |
| Visitor schickt Anfrage erfolgreich ab | `actionCreated: true` |

### Änderungen

**`src/hooks/useRedirectTracking.ts`**
- Wenn `?rid=` in URL erkannt wird und in `sessionStorage` gespeichert wird, **direkt danach** `kfz-callback` mit `{ redirectId, captchaSolved: true }` aufrufen.
- Guard: nur einmal pro Session feuern (Flag `kfz_rid_visited` in `sessionStorage`), damit ein Reload nicht erneut sendet.

**`src/pages/Gebrauchtwagen.tsx`**
- Beim erfolgreichen Anfrage-Submit nur noch `{ redirectId, actionCreated: true }` senden (kein `captchaSolved` mehr mitschicken).

**`supabase/functions/kfz-callback/index.ts`**
- Keine Änderung nötig — die Function akzeptiert beide Flags bereits optional und leitet weiter.

### Dateien

| Datei | Änderung |
|---|---|
| `src/hooks/useRedirectTracking.ts` | Nach Speichern von `rid`: Callback mit `captchaSolved: true` (einmal pro Session) |
| `src/pages/Gebrauchtwagen.tsx` | Submit-Callback: nur `actionCreated: true` senden |

