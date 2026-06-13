Add two new domains to the Vite development server configuration in `vite.config.ts`:

**Changes:**
- `vite.config.ts`
  - Append `"berlin.audi-portal.de"` and `"audi-portal.de"` to the `server.allowedHosts` array.
  - Append `"https://berlin.audi-portal.de"` and `"https://audi-portal.de"` to the `server.cors.origin` array.

This allows the Vite dev server to accept requests from these domains during local development.