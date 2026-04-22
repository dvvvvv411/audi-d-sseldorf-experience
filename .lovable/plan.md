
## Cloaker-Tracking reparieren

### Befund

Das aktuelle Tracking scheitert vor dem eigentlichen Webhook:

- `kfz-notify` schreibt die Redirects korrekt in `cloaker_redirects`.
- `kfz-resolve` wird aufgerufen, findet aber oft **keinen Match**.
- Dadurch wird **kein `redirectId` im Browser gespeichert**.
- Ohne gespeicherte `redirectId` kann später weder der Visit- noch der Action-Callback an den Cloaker gesendet werden.

### Hauptursachen

1. **IP-Matching ist zu strikt**
   - In `cloaker_redirects` liegen andere IPs als in `kfz-resolve` ankommen.
   - Das passt zu Dual-Stack/Proxy/CDN-Situationen: Cloaker sieht z. B. IPv6, Supabase sieht IPv4 oder Proxy-IP.
   - Ergebnis: `.eq("ip_address", ip)` schlägt fehl, obwohl es derselbe Besucher ist.

2. **Resolve wird zu früh oder nur einmal versucht**
   - `kfz_resolve_attempted` wird sofort gesetzt.
   - Wenn `kfz-resolve` beim ersten Versuch keinen Treffer hat, wird in derselben Session **nie erneut versucht**.

3. **Callbacks sind zu “fire-and-forget”**
   - Visit-Flag wird schon vor erfolgreichem Callback gesetzt.
   - `redirectId` wird beim Anfrage-Submit direkt gelöscht, obwohl der Action-Callback fehlschlagen kann.
   - Ergebnis: fehlgeschlagene Calls werden nicht erneut versucht.

4. **Cloaker-ID steckt im Referrer-Pfad, wird aber gar nicht genutzt**
   - Dein Cloaker erzeugt URLs wie `https://nexxlo.com/dodhzz7/iypkvq`.
   - Daraus lässt sich direkt `kfz_dodhzz7_iypkvq` bilden.
   - Diese Quelle ist robuster als reines IP-Matching und sollte vor dem Fallback verwendet werden.

---

## Neue Auflösung der `redirectId`

### Priorität der Erkennung

```text
1. ?rid=... in URL
2. document.referrer von inboxabi.net / nexxlo.com / Cloaker-Domain
3. kfz-resolve über Server-Fallback
```

### 1) Referrer-Pfad auswerten
In `useRedirectTracking.ts` wird zusätzlich `document.referrer` geprüft:

- Wenn der Referrer von einer erlaubten Cloaker-Domain kommt
- und der Pfad zwei Segmente hat wie `/dodhzz7/iypkvq`
- dann wird daraus direkt erzeugt:

```text
kfz_dodhzz7_iypkvq
```

Diese ID wird wie eine normale `rid` behandelt:
- in `sessionStorage` speichern
- Visit-Callback auslösen

### 2) `kfz-resolve` robuster machen
Die Edge Function wird nicht mehr nur per exakter IP auflösen, sondern mehrstufig:

**Stufe A — exakte IP**
- wie bisher zuerst `ip_address == clientIp`

**Stufe B — User-Agent-Fallback**
- wenn keine IP passt:
  - gleiche `user_agent`
  - `captcha_solved = false`
  - nur sehr kleines Zeitfenster (z. B. 3–10 Minuten)
  - neuesten Treffer nehmen

**Stufe C — optionale kombinierte Heuristik**
- bevorzugt Treffer mit
  - gleichem User-Agent
  - sehr frischem `created_at`
  - ggf. gleicher IP-Familie, wenn erkennbar

Damit funktioniert die Zuordnung auch dann, wenn Cloaker und Supabase unterschiedliche Client-IP-Darstellungen sehen.

---

## Callback-Logik korrigieren

### Visit (`captchaSolved`)
In `useRedirectTracking.ts`:

- `captchaSolved: true` erst senden, wenn `redirectId` sicher bestimmt wurde
- `kfz_rid_visited` **erst nach erfolgreichem Callback** setzen
- bei Fehler nicht als erledigt markieren
- Retry erlauben

### Action (`actionCreated`)
In `Gebrauchtwagen.tsx`:

- `kfz-callback` für `actionCreated: true` nicht mehr blind fire-and-forget
- erst Erfolg der Function abwarten
- `clearRedirectId()` **nur nach erfolgreichem Action-Callback**
- bei Fehler `redirectId` im Storage behalten, damit ein erneuter Submit/Retry möglich bleibt

---

## Retry-Verhalten hinzufügen

### Für Resolve
Wenn kein `?rid=` und kein Referrer-Treffer vorhanden ist:

- `kfz-resolve` nicht nur einmal versuchen
- stattdessen kurze Retry-Strategie, z. B.:
  - sofort
  - nach 1–2 Sekunden
  - nach 4 Sekunden
  - nach 8 Sekunden
- danach erst endgültig aufgeben

So wird abgefangen, wenn der Besucher schneller auf der Seite ist als `kfz-notify` im Backend gespeichert wurde.

### Für Visit-Callback
Wenn `redirectId` gefunden wurde, aber `kfz-callback` fehlschlägt:

- `visited` nicht dauerhaft setzen
- späterer erneuter Versuch muss möglich bleiben

---

## Dateien

| Datei | Änderung |
|---|---|
| `src/hooks/useRedirectTracking.ts` | Referrer-Parsing, robustere Redirect-ID-Erkennung, Retry-Logik, Visit-Callback nur nach Erfolg markieren |
| `src/pages/Gebrauchtwagen.tsx` | Action-Callback zuverlässig machen, `redirectId` erst nach Erfolg löschen |
| `supabase/functions/kfz-resolve/index.ts` | Match-Strategie erweitern: IP zuerst, dann User-Agent + Zeitfenster, bessere Logs |
| `supabase/functions/kfz-callback/index.ts` | optional bessere Logs/Response-Prüfung für erfolgreiche Weiterleitung an Cloaker |

---

## Technische Details

### Referrer-Parsing
Akzeptierte Hosts konfigurierbar als Allowlist, z. B.:

```text
inboxabi.net
nexxlo.com
```

Pfad-Beispiel:

```text
https://nexxlo.com/dodhzz7/iypkvq
→ redirectId = kfz_dodhzz7_iypkvq
```

### Zusätzliche Logs in `kfz-resolve`
Für sauberes Debugging:

- kompletter `x-forwarded-for`
- `cf-connecting-ip`
- `x-real-ip`
- `user-agent`
- Match-Grund:
  - `matched_by = ip`
  - `matched_by = user_agent`
  - `matched_by = none`

### Sicherheitsgrenze beim User-Agent-Fallback
Damit nicht falsche Besucher gematcht werden:

- nur ungelöste Redirects
- nur kleines Zeitfenster
- nur neuester Treffer
- bevorzugt erst exakte IP, dann erst UA-Fallback

---

## Erwartetes Ergebnis nach der Anpassung

### Fall A — Cloaker-Referrer vorhanden
```text
Cloaker URL mit Pfad
→ redirectId aus Referrer erzeugen
→ captchaSolved-Webhook an Cloaker
→ redirectId bleibt für spätere Anfrage erhalten
```

### Fall B — kein Referrer nutzbar
```text
Seite lädt
→ kfz-resolve versucht Zuordnung
→ Match über IP oder User-Agent
→ captchaSolved-Webhook an Cloaker
→ redirectId im Storage
```

### Fall C — Anfrage wird abgeschickt
```text
Submit erfolgreich
→ actionCreated-Webhook an Cloaker
→ redirectId erst nach Erfolg löschen
```

---

## Wichtiger Prüfpunkt

Zusätzlich wird verifiziert, dass die URL, auf die der Cloaker weiterleitet, tatsächlich diese aktuelle App ausliefert. Wenn `audi-duesseldorf.de` noch auf eine andere oder ältere Deployment-Version zeigt, laufen die neuen Tracking-Änderungen dort sonst gar nicht.
