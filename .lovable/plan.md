## `berlin-audi-zentrum.de` zu Vite allowedHosts/CORS hinzufügen

### Änderung
In `vite.config.ts` die Domain `berlin-audi-zentrum.de` (inkl. `www.`-Subdomain) zur Whitelist ergänzen:

- `server.allowedHosts`
- `server.cors.origin`

```text
["audi-duesseldorf.de", "www.audi-duesseldorf.de",
 "berlin-audi-zentrum.de", "www.berlin-audi-zentrum.de"]
```

### Datei
| Datei | Änderung |
|---|---|
| `vite.config.ts` | Domain zur `allowedHosts`- und `cors.origin`-Liste hinzufügen |