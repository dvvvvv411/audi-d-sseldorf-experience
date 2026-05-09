## Problem
Beim Absenden einer Fahrzeuganfrage (öffentliche Verkäuferseite, anon User) schlägt der Versand fehl. Ursache:

- `send-anfrage-sms` ist in `supabase/config.toml` korrekt mit `verify_jwt = false` konfiguriert.
- `send-anfrage-email` **fehlt** in `config.toml` und läuft daher mit JWT-Pflicht — anon Calls werden abgelehnt.
- `kfz-callback` ist ebenfalls nicht eingetragen, wird aber direkt nach dem Anfrage-Insert vom anon Client aufgerufen.

RLS auf `anfragen` ist bereits korrekt (`Anon can insert anfragen`). Die internen Inserts in `sms_verlauf`, `email_verlauf` und `aktivitaets_log` laufen über Service Role Key in den Edge Functions und sind von RLS unberührt.

## Fix
`supabase/config.toml` ergänzen:

```toml
[functions.send-anfrage-email]
verify_jwt = false

[functions.kfz-callback]
verify_jwt = false
```

Damit können anon Besucher Anfragen abschicken und die nachgelagerten Email-/SMS-/Callback-Funktionen aufrufen.

Keine weiteren Code-Änderungen nötig — die Funktionen lesen alle nötigen Daten serverseitig über den Service Role Key und enthalten keine eigenen Auth-Checks, was für diese öffentlichen Endpunkte gewollt ist.
