

## 2 neue Rechtsseiten + Zurueck-Button + Scroll-to-Top

### Neue Seiten

| Route | Datei |
|---|---|
| `/rechtliches/digital-services-act` | `src/pages/rechtliches/DigitalServicesAct.tsx` |
| `/rechtliches/eu-data-act` | `src/pages/rechtliches/EuDataAct.tsx` |

Gleiche Layout-Vorlage wie bestehende Rechtsseiten (Audi-Logo, `max-w-4xl`, weiss).

### Zurueck-Button auf allen Rechtsseiten

Auf **allen 7 Rechtsseiten** (Impressum, Rechtliches, Datenschutzinformation, CookieRichtlinie, Barrierefreiheit + 2 neue) einen Zurueck-Button einfuegen:
- Neben oder unter dem Audi-Logo: `← Zurück` als Link zurueck zu `/gebrauchtwagen`
- Oder: `useNavigate()` mit `navigate(-1)` fuer Browser-History-basiertes Zurueckgehen

### Scroll-to-Top bei Seitenwechsel

Ein `ScrollToTop`-Komponente erstellen, die bei jedem Routenwechsel `window.scrollTo(0, 0)` ausfuehrt:

```tsx
// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
```

In `App.tsx` innerhalb des `<BrowserRouter>` einbinden.

### Footer-Update

"Digital Services Act" und "EU Data Act" als Links zu den neuen Seiten.

### Dateien

| Datei | Aenderung |
|---|---|
| `src/pages/rechtliches/DigitalServicesAct.tsx` | Neu: DSA-Seite mit Zurueck-Button |
| `src/pages/rechtliches/EuDataAct.tsx` | Neu: EU Data Act mit Zurueck-Button |
| `src/components/ScrollToTop.tsx` | Neu: Scroll-to-Top bei Routenwechsel |
| `src/App.tsx` | 2 neue Routes + ScrollToTop einbinden |
| `src/pages/Gebrauchtwagen.tsx` | Footer: DSA + EU Data Act verlinken |
| `src/pages/rechtliches/Impressum.tsx` | Zurueck-Button hinzufuegen |
| `src/pages/rechtliches/Rechtliches.tsx` | Zurueck-Button hinzufuegen |
| `src/pages/rechtliches/Datenschutzinformation.tsx` | Zurueck-Button hinzufuegen |
| `src/pages/rechtliches/CookieRichtlinie.tsx` | Zurueck-Button hinzufuegen |
| `src/pages/rechtliches/Barrierefreiheit.tsx` | Zurueck-Button hinzufuegen |

