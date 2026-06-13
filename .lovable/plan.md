## Ziel
Root `/` soll weiterhin auf den `originallink` des hostbezogenen Brandings weiterleiten (aktuelles Verhalten beibehalten/absichern).

## Änderungen

**`src/pages/Index.tsx`**
- Behält `useActiveBranding()` Logik.
- Redirect via `window.location.replace(branding.originallink)` sobald Branding geladen ist.
- Fallback: wenn `loading=false` und kein gültiger `originallink` vorhanden → `https://www.audi.de`, damit die Seite nie leer hängenbleibt.
- Während `loading` weiterhin `null` rendern (keine UI-Flash).

## Technische Details
```ts
useEffect(() => {
  if (loading) return;
  const target = branding?.originallink?.trim() || "https://www.audi.de";
  window.location.replace(target);
}, [branding, loading]);
```

Keine weiteren Dateien betroffen.
