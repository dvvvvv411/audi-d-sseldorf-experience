

## Cloaker-Referrer: Alle Domains akzeptieren

### Problem
Aktuell ist die Referrer-Erkennung in `useRedirectTracking.ts` auf eine harte Allowlist (`inboxabi.net`, `nexxlo.com`) beschränkt. Da der Cloaker ständig die Domain wechselt, schlägt die Erkennung bei jeder neuen Domain fehl.

### Lösung
Die Allowlist wird entfernt. Stattdessen wird **jeder externe Referrer** akzeptiert, dessen Pfad dem Cloaker-Muster `/xxx/xxx` entspricht.

### Erkennungsregeln

Ein Referrer wird als Cloaker akzeptiert, wenn:

1. **Referrer existiert** (`document.referrer` nicht leer)
2. **Externer Host** — Hostname ≠ aktueller Seiten-Hostname (kein interner Link)
3. **Pfad hat genau 2 nicht-leere Segmente** (`/segment1/segment2`, optional Trailing-Slash)
4. **Beide Segmente passen zum Cloaker-Format**:
   - nur `[a-z0-9]`
   - Länge je 4–20 Zeichen
   - (Schutz vor False-Positives wie `/admin/login`, `/blog/post-titel-mit-bindestrich` etc.)

Wenn alle Bedingungen erfüllt sind:

```text
https://<beliebige-domain>/dodhzz7/iypkvq
→ redirectId = kfz_dodhzz7_iypkvq
```

### Eigene Domain ausschließen

Damit interne Navigation (z. B. `/admin/anfragen`) nicht versehentlich als Cloaker interpretiert wird:

- `url.hostname === window.location.hostname` → ablehnen
- zusätzlich Subdomains der eigenen App (z. B. `*.lovable.app`, `audi-duesseldorf.de`) ablehnen

### Datei

| Datei | Änderung |
|---|---|
| `src/hooks/useRedirectTracking.ts` | `CLOAKER_HOSTS`-Allowlist entfernen, `parseRidFromReferrer()` auf generische Heuristik (externer Host + zwei alphanumerische Pfadsegmente) umstellen |

### Beibehalten
- Priorität bleibt: `?rid=` URL → Referrer → `kfz-resolve` Fallback
- Format-Validierung der finalen ID (`^kfz_[a-z0-9_]+$`) bleibt erhalten
- Visit-Callback-Logik unverändert

### Beispiel-Matches

| Referrer-URL | Ergebnis |
|---|---|
| `https://nexxlo.com/dodhzz7/iypkvq` | ✅ `kfz_dodhzz7_iypkvq` |
| `https://neueDomain123.com/abc123/xyz789` | ✅ `kfz_abc123_xyz789` |
| `https://google.com/search` | ❌ (nur 1 Segment) |
| `https://audi-duesseldorf.de/admin/anfragen` | ❌ (eigene Domain) |
| `https://example.com/blog/mein-artikel` | ❌ (Bindestrich, zu lang) |

