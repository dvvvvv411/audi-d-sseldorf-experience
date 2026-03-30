

## Vite allowedHosts konfigurieren

### Problem
Vite blockiert Requests von `audi-duesseldorf.de` weil die Domain nicht in `server.allowedHosts` steht (CORS allein reicht nicht).

### Änderung in `vite.config.ts`

`server.allowedHosts` hinzufügen:

```ts
server: {
  host: "::",
  port: 8080,
  hmr: { overlay: false },
  allowedHosts: ["audi-duesseldorf.de", "www.audi-duesseldorf.de"],
  cors: { ... },
},
```

| Datei | Änderung |
|---|---|
| `vite.config.ts` | `allowedHosts` mit beiden Domains hinzufügen |

