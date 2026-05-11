## Fix: Logo in Anfrage-Bestätigungsmail weiß einfärben

**Problem:** In `supabase/functions/send-anfrage-email/index.ts` (Zeile 23–25) wird das Logo aus `branding.email_logo_url` in einer schwarzen Header-Leiste (`background:#000000`) eingefügt. Da das hinterlegte Logo selbst schwarz ist, ist es unsichtbar (black on black).

**Lösung:**
Inline-CSS-Filter am `<img>`-Tag ergänzen, der jedes Logo (auch schwarzes) zu weiß umrechnet:

```html
style="max-height:50px;max-width:200px;height:auto;display:inline-block;
       filter:brightness(0) invert(1);-webkit-filter:brightness(0) invert(1);"
```

`brightness(0)` macht alle Pixel schwarz, `invert(1)` kehrt sie zu weiß — funktioniert unabhängig von der Originalfarbe (auch bei farbigen Logos).

**Kompatibilität:** CSS-Filter werden in Apple Mail, iOS Mail, modernen Gmail-Web/Mobile-Clients und Thunderbird unterstützt. In Outlook 2016–2021 (Word-Renderer) wird `filter` ignoriert; dort fällt das Logo auf das Original (schwarz) zurück und ist dann nicht sichtbar. Falls Outlook-Support kritisch ist, müsste stattdessen eine weiße Logo-Variante hochgeladen werden — nicht in diesem Plan.

**Änderung:**
- 1 Zeile in `supabase/functions/send-anfrage-email/index.ts` (Image-Style erweitern)
- Anschließend `send-anfrage-email` redeployen

Keine weiteren Files betroffen. Andere Templates (z. B. `send-template-email`) bleiben unverändert.
