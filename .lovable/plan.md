

## SEO Meta-Daten für alle Seiten hinzufügen

### Konzept
Da es sich um eine React SPA handelt, wird ein kleiner `usePageMeta`-Hook erstellt, der `document.title` und die Meta-Description dynamisch pro Seite setzt. Jede öffentliche Seite ruft diesen Hook mit passenden Texten auf.

### 1. Neuer Hook: `src/hooks/usePageMeta.ts`
Setzt `document.title` und aktualisiert `<meta name="description">` + OG-Tags per `useEffect`.

### 2. Hook-Aufrufe pro Seite

| Seite | Title | Description |
|---|---|---|
| `/` (Index) | Audi Düsseldorf – Ihr Premium-Partner | Willkommen bei Audi Düsseldorf. Entdecken Sie Neuwagen, Gebrauchtwagen, Service und Beratung bei Ihrem Audi Partner in Düsseldorf. |
| `/fahrzeugbestand` | Fahrzeugbestand · Audi Düsseldorf | Unser aktueller Fahrzeugbestand – finden Sie Ihren Audi bei Audi Düsseldorf. Große Auswahl an Neu- und Gebrauchtwagen. |
| `/gebrauchtwagen` | Gebrauchtwagen · Audi Düsseldorf | Geprüfte Audi Gebrauchtwagen in Düsseldorf. Alle Modelle mit Garantie und Top-Ausstattung. |
| `/gebrauchtwagen/:slug/:nr` | (dynamisch: Fahrzeugname) · Audi Düsseldorf | (dynamisch basierend auf Fahrzeugdaten) |
| `/rechtliches` | Rechtliches · Audi Düsseldorf | Rechtliche Informationen von Audi Düsseldorf. |
| `/rechtliches/impressum` | Impressum · Audi Düsseldorf | Impressum und Kontaktdaten von Audi Düsseldorf. |
| `/rechtliches/datenschutzinformation` | Datenschutz · Audi Düsseldorf | Datenschutzinformationen und Ihre Rechte bei Audi Düsseldorf. |
| `/rechtliches/cookie-richtlinie` | Cookie-Richtlinie · Audi Düsseldorf | Informationen zur Verwendung von Cookies auf audi-duesseldorf.de. |
| `/rechtliches/barrierefreiheit` | Barrierefreiheit · Audi Düsseldorf | Erklärung zur Barrierefreiheit von Audi Düsseldorf. |
| `/rechtliches/digital-services-act` | Digital Services Act · Audi Düsseldorf | Informationen zum Digital Services Act bei Audi Düsseldorf. |
| `/rechtliches/eu-data-act` | EU Data Act · Audi Düsseldorf | Informationen zum EU Data Act bei Audi Düsseldorf. |

### 3. `index.html` bleibt als Fallback
Die bestehenden Meta-Tags in `index.html` bleiben als Standard-Fallback für Crawler, die kein JS ausführen.

### Dateien

| Datei | Änderung |
|---|---|
| `src/hooks/usePageMeta.ts` | Neuer Hook: setzt title, description, OG-Tags |
| `src/pages/Index.tsx` | `usePageMeta(...)` Aufruf |
| `src/pages/Fahrzeugbestand.tsx` | `usePageMeta(...)` Aufruf |
| `src/pages/Gebrauchtwagen.tsx` | `usePageMeta(...)` Aufruf |
| `src/pages/rechtliches/*.tsx` | `usePageMeta(...)` Aufruf (6 Seiten) |
| `src/pages/NotFound.tsx` | `usePageMeta(...)` Aufruf |

