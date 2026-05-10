## Plan: Rechtstexte markenneutral machen

Ziel: Alle verbleibenden Audi-Hardcodes in den Rechtstexten entfernen und durch markenneutrale, dynamische Inhalte ersetzen. Admin-Placeholders und der `AudiLogo`-Fallback bleiben unverändert.

### Betroffene Dateien

1. **`src/pages/rechtliches/Barrierefreiheit.tsx`**
   - Markenneutral umschreiben: „Audi Fahrzeuge/Partner/Konfigurator" → „unsere Fahrzeuge/Vertragspartner/Fahrzeug-Konfigurator"
   - URLs `www.audi.de`, `audi.de/de/stories/audi-experiences/` → entfernen bzw. durch `branding.eigene_domain` ersetzen
   - „myAudi Account"-Absatz: komplett entfernen (zu Audi-spezifisch, gibt es bei VW/Skoda nicht 1:1)
   - „dsa@audi.de" → `branding.email`
   - „AUDI AG" → `branding.footer_unternehmensname`

2. **`src/pages/rechtliches/CookieRichtlinie.tsx`**
   - Adressen „AUDI AG, Auto-Union-Straße 1, …" → `branding.footer_unternehmensname` + `branding.strasse/plz/stadt`
   - „datenschutz@audi.de" → `branding.email`
   - „Audi Online Beratung" Sektion (Z. 312–313) → entfernen oder generisch („Online Beratung")
   - Cookie-Tabelle mit `AUDI_ENSIGHTEN_*`, `myaudi`, `_acq_visit` etc.: → durch eine generische Standard-Cookie-Tabelle ersetzen (Session-Cookie, CSRF, Consent, Analytics-Platzhalter). Die `AUDI_ENSIGHTEN_*`-Einträge sind echte Audi-Tracker und passen für andere Marken nicht.
   - „AUDI Gesellschaft" → „unser Unternehmen"

3. **`src/pages/rechtliches/Datenschutzinformation.tsx`**
   - H1 „Datenschutzinformation audi.de" → „Datenschutzinformation"
   - Komplette Datei durchgehen und Audi-spezifische Inhalte (myAudi, Konfigurator, Audi Connect, Audi Online Beratung, audi.de-URLs) markenneutral umschreiben oder entfernen
   - Adressblöcke und Kontakt-E-Mails dynamisch aus `branding`

4. **`src/pages/rechtliches/DigitalServicesAct.tsx`**
   - „dsa@audi.de" → `branding.email`
   - „Uns, der AUDI AG („Audi", „wir")" → dynamisch aus `branding.footer_unternehmensname` (Klammer-Kürzel mit `getBrandShort`)
   - Alle weiteren „AUDI AG"/"Audi" werden bereits vom `useDynamicLegalReplacements`-Hook ersetzt — bleibt so.

5. **`src/pages/rechtliches/EuDataAct.tsx`**
   - Analog DSA: hardcodierte E-Mails und „AUDI AG"-Klammern auflösen, Rest übernimmt der Replacement-Hook.

6. **`src/pages/rechtliches/Rechtliches.tsx`**
   - Audi-Karriere-Hinweis (Absatz „Zusätzlicher Hinweis zu den Karriere Seiten") → entfernen, da nicht mehr relevant.

7. **`src/hooks/useDynamicLegalReplacements.ts`**
   - Fallback-Werte `"AUDI AG"` und `"Audi"` → durch leere Strings ersetzen, sodass nichts „Audi" stehen bleibt, wenn Branding fehlt.

### Was nicht angefasst wird

- `AudiLogo`-Fallback in `Fahrzeugbestand.tsx` (bleibt wie gewünscht).
- Placeholders in `AdminBrandings.tsx` (Admin Panel bleibt unverändert).
- `public/images/Audi.svg` und `audi_gwplus.jpg` (ungenutzt, aber nicht stören).

### Vorgehen

Da ein Großteil der Rechtstexte in JSX-Strings steht, schreibe ich die betroffenen Absätze direkt um (statt nur den Replacement-Hook zu erweitern). So wird das Ergebnis unabhängig vom Hook lesbar und auch in Suchmaschinen-Crawls/SSR korrekt. Der `useDynamicLegalReplacements`-Hook bleibt für die generischen Replacements (z. B. dynamische Firmierung) zusätzlich aktiv.

Nach Implementierung: kurzer `grep -ri "audi"` über `src/pages/rechtliches` zur Verifikation, dass nichts übrig bleibt außer ggf. neutralen Variablennamen.