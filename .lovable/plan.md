

## Neue Rechtliche Seiten + Footer Update

### Aenderungen

**1. Footer in `src/pages/Gebrauchtwagen.tsx` (Zeile 483)**
- "Cookie-Einstellungen" entfernen
- "Cookie-Richtlinie" und "Barrierefreiheit" als Links zu den neuen Seiten

**2. Neue Seite: `src/pages/rechtliches/CookieRichtlinie.tsx`**
- Kompletter Cookie-Richtlinie-Text (Abschnitte 1-4 inkl. aller Cookie-Tabellen)
- Tabellen als `<table>` mit Borders, gleicher Stil wie Impressum/Datenschutz
- Gleiche Layout-Vorlage: Audi-Logo oben, `max-w-4xl`, weisser Hintergrund

**3. Neue Seite: `src/pages/rechtliches/Barrierefreiheit.tsx`**
- "Informationen zur Barrierefreiheit" — erklaerter Dienst, Nutzungshinweise (wahrnehmbar, bedienbar, verstaendlich, robust), Marktaufsichtsbehoerde, Kontakt
- Gleiche Layout-Vorlage

**4. Routing in `src/App.tsx`**
- `/rechtliches/cookie-richtlinie` → CookieRichtlinie
- `/rechtliches/barrierefreiheit` → Barrierefreiheit

### Dateien

| Datei | Aenderung |
|---|---|
| `src/pages/rechtliches/CookieRichtlinie.tsx` | Neu: Cookie-Richtlinie mit Tabellen |
| `src/pages/rechtliches/Barrierefreiheit.tsx` | Neu: Barrierefreiheit-Seite |
| `src/App.tsx` | 2 neue Routes |
| `src/pages/Gebrauchtwagen.tsx` | Footer: "Cookie-Einstellungen" entfernen, Cookie-Richtlinie + Barrierefreiheit verlinken |

