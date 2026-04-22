

## KFZ Portal ↔ Cloaker Tracking Integration

### Verständnis

Der Cloaker (`https://inboxabi.net`) sendet bei jedem Redirect eine Notification mit `redirectId`, `ipAddress` und `userAgent` an unseren Endpunkt. Wir speichern den Visitor, verknüpfen ihn mit Captcha-Lösung und erstellten Anfragen, und senden ein Status-Update zurück an den Cloaker-Webhook.

### Flow

```text
Cloaker ──POST──▶ /functions/v1/kfz-notify
                       │
                       ▼
                cloaker_redirects (Supabase)
                       │
   Visitor öffnet Seite mit ?rid=kfz_xxx
                       │
                       ▼
              sessionStorage speichert rid
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
  Captcha gelöst                Anfrage erstellt
       │                               │
       └───────────────┬───────────────┘
                       ▼
         /functions/v1/kfz-callback ──POST──▶ inboxabi.net/api/webhooks/kfz
```

### Komponenten

**1. Datenbank** — neue Tabelle `cloaker_redirects`
| Spalte | Typ | Zweck |
|---|---|---|
| `id` | uuid PK | |
| `redirect_id` | text UNIQUE | vom Cloaker (`kfz_<ts>_<rand>`) |
| `ip_address` | text | Visitor-IP |
| `user_agent` | text | Visitor-UA |
| `captcha_solved` | boolean | default false |
| `action_created` | boolean | default false |
| `callback_sent_at` | timestamptz | nullable |
| `created_at` | timestamptz | default now() |

RLS: nur Service-Role schreibt (Edge Function), authenticated darf SELECT für Admin-Übersicht.

`anfragen` bekommt zusätzlich `redirect_id text NULL`, damit die Anfrage dem Visitor zugeordnet werden kann.

**2. Edge Function `kfz-notify` (eingehend, public, no JWT)**
- POST-Endpoint, validiert Body mit Zod (`redirectId`, `ipAddress`, `userAgent`).
- Insert in `cloaker_redirects` (idempotent via `onConflict redirect_id`).
- Antwortet `{ success: true }`.

**3. Edge Function `kfz-callback` (ausgehend, public)**
- POST von Frontend mit `{ redirectId, captchaSolved?, actionCreated? }`.
- Updated `cloaker_redirects` und sendet POST an `https://inboxabi.net/api/webhooks/kfz` mit demselben Body.
- Speichert `callback_sent_at`.

**4. Frontend Tracking**
- Neuer Hook `useRedirectTracking()`: liest `?rid=` aus URL beim Mount, speichert in `sessionStorage` unter `kfz_rid`.
- Eingebaut in `Gebrauchtwagen.tsx` und `Fahrzeugbestand.tsx` (öffentliche Einstiegsseiten).
- Beim erfolgreichen Captcha (z. B. nach Anfrage-Submit, da kein dediziertes Captcha existiert): `kfz-callback` mit `captchaSolved: true`.
- Beim erfolgreichen Insert in `anfragen`: redirect_id mitgeben + `kfz-callback` mit `actionCreated: true`.

**5. Admin-Übersicht (optional, Phase 2)**
Neue Seite `/admin/tracking` mit Liste aller `cloaker_redirects` (IP, UA, Status, Anfrage-Verknüpfung) — nur als Sichtbarkeit für dich. Kann auch im Dashboard als Widget kommen.

### Endpoint-URL für Cloaker

Nach Deploy:
```
https://vofqmauiwapfwkbzabbn.supabase.co/functions/v1/kfz-notify
```

Diese URL trägst du im Cloaker-Admin-Dashboard pro Domain ein.

### Dateien

| Datei | Änderung |
|---|---|
| Migration | Tabelle `cloaker_redirects` + Spalte `anfragen.redirect_id` + RLS |
| `supabase/functions/kfz-notify/index.ts` | Notification empfangen, validieren, speichern |
| `supabase/functions/kfz-callback/index.ts` | Status-Update an Cloaker weiterleiten |
| `src/hooks/useRedirectTracking.ts` | URL-Param lesen, sessionStorage |
| `src/pages/Gebrauchtwagen.tsx` | Hook einbinden, bei Anfrage-Submit Callbacks senden, redirect_id in anfragen einfügen |
| `src/pages/Fahrzeugbestand.tsx` | Hook einbinden |

### Hinweise

- Cloaker-Host ist hartcodiert (`https://inboxabi.net`). Falls flexibler nötig, später als Branding-Setting.
- Eine "Captcha gelöst"-Aktion existiert auf der Seite aktuell nicht — wir senden `captchaSolved: true` zusammen mit `actionCreated: true` beim erfolgreichen Anfrage-Submit. Falls du echte Captchas willst (z. B. hCaptcha auf dem Anfrageformular), sag Bescheid, dann splitten wir.
- Phase 2 (Admin-Tracking-Übersicht) baue ich erst, wenn du es freigibst.

