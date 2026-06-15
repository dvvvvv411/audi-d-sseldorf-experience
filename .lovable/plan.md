## Ziel
Favicon wird pro Domain dynamisch aus dem Branding-Feld `logo_pdf_url` ("Logo für PDFs & Fahrzeugbestand") gesetzt.

## Umsetzung

**Neuer Hook `src/hooks/useDynamicFavicon.ts`**
- Nutzt `useActiveBranding()`.
- Sobald `branding.logo_pdf_url` vorhanden ist, wird im `<head>` der `<link rel="icon">` aktualisiert:
  - Vorhandene `link[rel~="icon"]` Tags entfernen (inkl. `shortcut icon`, `apple-touch-icon`).
  - Neuen `<link rel="icon">` mit `href = branding.logo_pdf_url` einfügen.
  - Zusätzlich `apple-touch-icon` setzen.
- Fallback (kein Logo / kein Branding): Standard `/favicon.ico` bzw. das aktuelle Audi-Favicon in `index.html` bleibt aktiv.

**Einbindung in `src/App.tsx`**
- Hook einmalig auf App-Ebene aufrufen, damit er auf jeder Route greift (inkl. `/`-Redirect-Seite vor dem Redirect — schadet aber nicht, da Redirect sofort erfolgt; primär relevant für `/:sellerSlug` & Admin auf Custom Domains).

## Hinweise
- Keine DB-Änderungen, keine neuen Felder — `logo_pdf_url` existiert bereits.
- Funktioniert mit beliebigen Bildtypen (PNG/SVG/JPG); Browser akzeptieren das für Favicons.
- Da das Bild von Supabase Storage geladen wird, gibt es einen kurzen Moment mit dem Default-Favicon — akzeptabel.
- Keine Anpassung am bestehenden Redirect oder an `usePageMeta` nötig.
