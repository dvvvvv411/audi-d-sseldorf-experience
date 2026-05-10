# Phase 2 — Audi-Hardcoding entfernen (Texte, Rechtstexte, Redirect)

## 1. Branding-Schema erweitern

Neue Spalten in `brandings`:
- `footer_unternehmensname` (text) — z. B. "AUDI AG"
- `vorstand` (jsonb, default `[]`) — Array von Strings, erste Person = Vorsitzender (wird allerdings aus `geschaeftsfuehrer` gespiegelt, siehe unten)
- `originallink` (text) — z. B. `https://audi.de`
- `eigene_domain` (text) — z. B. `berlin-audi-zentrum.de`

Seed des bestehenden „Audi Zentrum Berlin"-Brandings:
- `footer_unternehmensname = "AUDI AG"`
- `vorstand = ["Dieter Dehoorne","Rouven Mohr","Jürgen Rittersberger","Javier Ros Hernández","Marco Schubert","Gerd Walker"]` (Vorsitzender kommt aus `geschaeftsfuehrer`)
- `originallink = "https://audi.de"`
- `eigene_domain = "berlin-audi-zentrum.de"`

## 2. AdminBrandings.tsx — neue UI-Sektionen

- **Footer**: Eingabefeld „Footer-Unternehmensname"
- **Vorstand**: dynamische Liste (Add/Remove-Button, beliebig viele Einträge). Hinweis-Label: „Vorsitzender = Geschäftsführer (oben)". Liste enthält nur die weiteren Mitglieder.
- **Domains & Weiterleitung**:
  - Eingabefeld „Originallink (Weiterleitungsziel)"
  - Eingabefeld „Eigene Domain"

## 3. `index.html` & SEO generisch

- `<title>` → „Fahrzeugbestand"
- Meta-Description und OG-Tags markenneutral, z. B. „Aktuelle Fahrzeuge unseres Hauses. Premium-Beratung und Service."
- `Fahrzeugbestand.tsx` setzt via `usePageMeta` weiterhin den brand-spezifischen Titel/Description erst beim Mount der Seite.
- `NotFound.tsx` und Rechts-Seiten: Titel-Suffix `· Audi` → `· {branding.footer_unternehmensname}` bzw. generisch entfernen wenn kein Branding-Kontext.

## 4. `Fahrzeugbestand.tsx` — Texte

- Z. 402: Kommentar `{/* Audi Header */}` entfernen
- Z. 682 Garantie-Bullet: `"3 Jahre {brandFirstWord} Gebrauchtwagengarantie"` — `brandFirstWord = branding.name.split(" ")[0]`
- Z. 783 Footer: `© 2026 {branding.footer_unternehmensname}. Alle Rechte vorbehalten.`
- WLTP-Satz „Weitere Informationen zu WLTP finden Sie unter www.audi.de/wltp." entfernen
- Meta-Description generisch ohne Markenname

## 5. Rechtstexte dynamisch

Alle Seiten in `src/pages/rechtliches/*` bekommen Branding-Kontext. Da Rechts-URLs derzeit global (`/rechtliches/...`) sind und kein Seller-Slug enthalten, brauchen wir eine Quelle. **Vorschlag:** Standardmäßig das erste/aktive Branding aus `brandings` laden (per `useEffect` + Supabase-Fetch). Wenn nur ein Branding existiert → das. Mehrere → wir verwenden den `referrer`/`document.referrer`-Kontext nicht zuverlässig; daher reicht bis Multi-Brand-Routing eine Auswahl per Domain-Match (`window.location.hostname` gegen `brandings.eigene_domain`), Fallback erstes Branding.

Pro Seite:
- **Impressum**: Adresse, Kontakt, Amtsgericht/HR/USt-IdNr, Geschäftsführer als Vorsitzender, Vorstandsliste aus `branding.vorstand`. Hardcoded „AUDI AG" → `branding.footer_unternehmensname`.
- **Barrierefreiheit, Cookie-Richtlinie, Datenschutz, DSA, EU Data Act, Rechtliches**: Alle „AUDI AG" → `footer_unternehmensname`. Alle „Audi" als Markennennung im Fließtext → erstes Wort des Branding-`name` (z. B. „Volkswagen"). Spezielle Audi-URLs (`audi.de`, `myAudi`, `dsa@audi.de`, Cookie-Namen `AUDI_ENSIGHTEN_*`) bleiben **nicht** dynamisch ersetzbar — werden zu generischen Platzhaltern entfernt oder durch `branding.email` / generischen Hinweis ersetzt. Cookie-Namen-Sektion wird allgemein formuliert („marken­spezifische Tracking-Cookies").

## 6. Edge-Function `send-anfrage-email`

- Base64-Audi-Ringe-PNG aus dem HTML-Body entfernen
- Stattdessen `<img src="${branding.email_logo_url}">` (Branding wird in der Funktion bereits geladen — `email_logo_url` zur Selektion ergänzen)

## 7. Landing-Redirect dynamisch (`Index.tsx`)

Neue Logik auf `/`:
1. `hostname = window.location.hostname`
2. Supabase-Query: `brandings.select('originallink').eq('eigene_domain', hostname).maybeSingle()`
3. Treffer → `window.location.replace(branding.originallink)`
4. Kein Treffer (z. B. lovable.app Preview) → Fallback `https://audi.de` bleibt, oder simple Fallback-Page mit Hinweis. Konkret: Fallback = erstes Branding oder hardcoded `https://audi.de` als Notfall.

`vite.config.ts` `allowedHosts`/CORS bleiben in dieser Phase unverändert (oder optional erweitert) — wird in einer späteren Phase generisch gemacht.

## 8. AdminLayout / AdminTelegram / AdminEmailTemplates (kleine Texte)

- `AdminTelegram.tsx`: Testnachricht-Text → „✅ Testnachricht von deinem Admin-Panel!"
- `AdminLayout.tsx`: `AudiRingsSmall` SVG → ersetzt durch generisches Icon (z. B. `Building2` oder `branding.logo_pdf_url` falls global verfügbar — bleibt ansonsten neutral)
- `AdminEmailTemplates.tsx`: AUDI-AG-Adresse im Footer → `branding.footer_unternehmensname` + Adressfelder; inline Audi-Rings-SVG → `branding.email_logo_url`
- `AdminInzahlungnahme.tsx`: PDF-Text „Audi AG Bank" → generisch „Hausbank" oder neues Branding-Feld (falls gewünscht — **nicht in dieser Phase**, behalten als Notiz)

## Technische Hinweise

- Migration: `ALTER TABLE brandings ADD COLUMN ...` für 4 neue Spalten; anschließend UPDATE für Audi-Zentrum-Berlin-Datensatz.
- Für Rechtstexte erstellen wir einen kleinen Hook `useActiveBranding()` (lädt per Domain-Match oder erstes Branding) — wiederverwendbar.
- Markenname-Helper: `getBrandShort(branding) = branding.name.split(" ")[0]`.

## Reihenfolge der Umsetzung

1. Migration (Spalten + Seed)
2. AdminBrandings UI (neue Sektionen Footer, Vorstand, Domains)
3. `useActiveBranding` Hook
4. Fahrzeugbestand Texte + index.html + SEO
5. Rechtstexte (7 Dateien)
6. Edge-Function E-Mail-Logo
7. Index.tsx Redirect-Logik
8. Kleine Admin-Texte (Telegram, Layout, EmailTemplates)
