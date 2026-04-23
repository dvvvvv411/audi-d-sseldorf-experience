

## Nur `kfz-resolve` als Quelle für die `redirectId`

### Befund
Die Logs bestätigen: `kfz-resolve` matcht zuverlässig (`matched_by: user_agent`/`ip`) und feuert den Cloaker-Webhook bereits selbst (`cloaker webhook 200`). Die zusätzlichen Pfade (URL-Param, Referrer-Parsing) sind unnötiger Ballast und führen zu inkonsistentem Verhalten.

### Lösung
Frontend wird radikal vereinfacht: **Es gibt nur noch einen Weg** — `kfz-resolve` aufrufen, Ergebnis speichern, fertig.

### Neue Auflösung in `useRedirectTracking.ts`

```text
1. Seite lädt
2. kfz-resolve aufrufen (mit Retries: 0s, 1.5s, 4s, 8s)
3. Wenn redirectId zurückkommt:
   → in sessionStorage speichern
   → Visit-Webhook hat kfz-resolve bereits server-seitig gefeuert
4. Wenn nicht: nichts tun
```

**Entfernt wird:**
- URL-Param-Pfad (`?rid=`)
- Referrer-Pfad-Parsing (`parseRidFromReferrer`, `OWN_HOST_SUFFIXES`, `SEGMENT_REGEX`)
- separater Visit-Callback aus dem Client (macht `kfz-resolve` schon selbst)
- `kfz_rid_visited` Guard
- doppelte Logik

**Bleibt:**
- Retry-Strategie für `kfz-resolve` (fängt Race-Condition mit `kfz-notify` ab)
- `STORAGE_KEY` für `redirectId`
- `RESOLVE_DONE_KEY` Guard pro Session

### `kfz-resolve` (keine Änderung nötig)
Funktioniert bereits korrekt:
- Stage A: IP-Match
- Stage B: User-Agent-Match
- Setzt `captcha_solved=true` in DB
- Feuert Cloaker-Webhook mit `captchaSolved: true`

### Action-Callback in `Gebrauchtwagen.tsx`
Beim Anfrage-Submit:
- `redirectId` aus `sessionStorage` lesen
- `kfz-callback` mit `{ redirectId, actionCreated: true }` aufrufen
- `clearRedirectId()` erst nach erfolgreichem Callback
- bei Fehler: `redirectId` behalten

### Dateien

| Datei | Änderung |
|---|---|
| `src/hooks/useRedirectTracking.ts` | Komplett vereinfachen: nur noch `kfz-resolve` mit Retries, alles andere entfernen |
| `src/pages/Gebrauchtwagen.tsx` | Action-Callback erst nach Erfolg `clearRedirectId()` |

### Erwartetes Ergebnis

```text
Visitor kommt an
→ kfz-notify hat Eintrag mit IP+UA
→ kfz-resolve matcht IP oder UA
→ captcha_solved=true + Cloaker-Webhook (captchaSolved)
→ redirectId im sessionStorage

Visitor schickt Anfrage
→ kfz-callback (actionCreated: true)
→ action_created=true + Cloaker-Webhook (actionCreated)
→ redirectId aus Storage entfernt
```

