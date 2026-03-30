

## CORS-Zugriff von audi-duesseldorf.de erlauben

### Änderung in `vite.config.ts`

`server.cors` konfigurieren mit `origin: ["https://audi-duesseldorf.de", "https://www.audi-duesseldorf.de"]`:

```ts
server: {
  host: "::",
  port: 8080,
  hmr: { overlay: false },
  cors: {
    origin: [
      "https://audi-duesseldorf.de",
      "https://www.audi-duesseldorf.de",
    ],
  },
},
```

| Datei | Änderung |
|---|---|
| `vite.config.ts` | `server.cors.origin` mit audi-duesseldorf.de Domains hinzufügen |

