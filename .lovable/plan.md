
Ziel: Das falsche Mail-Logo in `supabase/functions/send-anfrage-email/index.ts` sauber ersetzen.

Problem
- Aktuell steckt dort ein hartcodiertes Base64-PNG.
- Dieses PNG ist offensichtlich falsch erzeugt bzw. falsch gecroppt/skaliert: Im Screenshot sieht man nur einen kleinen/verrutschten Teil der Ringe auf schwarzem Hintergrund.
- Das eigentliche Audi-SVG ist vorhanden; für E-Mail-Clients muss es aber als korrekt erzeugtes weißes PNG eingebettet werden.

Umsetzung
1. In `supabase/functions/send-anfrage-email/index.ts` das aktuelle defekte `data:image/png;base64,...` komplett entfernen.
2. Das von dir bereitgestellte Audi-Logo als Ausgangsbasis nehmen und eine weiße Variante erzeugen:
   - gleicher Pfad / gleiche Proportionen
   - weiß auf transparentem Hintergrund
   - korrekt auf den Inhalt gecroppt, ohne riesige leere Fläche
3. Diese weiße Variante als neues Base64-PNG in das `<img>` im schwarzen Mail-Header einbetten.
4. Im `<img>` feste sinnvolle Maße setzen, damit nichts verzerrt:
   - Breite ca. 150–160px
   - Höhe proportional
   - `display:block; margin:0 auto; border:0; outline:none; text-decoration:none;`
5. Sicherstellen, dass nur das echte Audi-Logo verwendet wird und keine gezeichnete Ersatzgrafik / kein fehlerhaftes altes PNG mehr.

Technische Details
- Datei: `supabase/functions/send-anfrage-email/index.ts`
- Austausch nur im Header-Bereich der HTML-Mail
- Das Logo bleibt als Base64-PNG eingebettet, weil das in E-Mail-Clients deutlich zuverlässiger ist als SVG als `img`
- Wichtig ist diesmal nicht nur “weiß”, sondern auch:
  - korrektes Seitenverhältnis
  - enger Zuschnitt um die Ringe
  - transparente Fläche statt schwarzer Rasterfehler
  - keine Verzerrung durch falsche Width/Height-Kombination

Ergebnis
- In der Anfrage-Bestätigung erscheint das Audi-Logo korrekt, mittig, weiß und vollständig sichtbar auf dem schwarzen Balken.
