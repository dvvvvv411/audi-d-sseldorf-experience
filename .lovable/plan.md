

## Landingpage → audi.de Weiterleitung

### Änderung

**`src/pages/Index.tsx`**: Den gesamten Seiteninhalt durch einen sofortigen `window.location.replace("https://audi.de")` ersetzen. Die Komponente gibt nur ein leeres Fragment oder einen kurzen Ladehinweis zurück.

```tsx
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.replace("https://audi.de");
  }, []);

  return null;
};

export default Index;
```

| Datei | Änderung |
|---|---|
| `src/pages/Index.tsx` | Gesamten Inhalt durch sofortige Weiterleitung zu audi.de ersetzen |

