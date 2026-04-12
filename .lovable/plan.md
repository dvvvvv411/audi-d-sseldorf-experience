

## Marketing-Email Template (persönlich & seriös)

### Konzept

Neue Sektion "Marketing-Email" auf `/admin/email-templates`. Die Email wirkt wie eine persönliche, seriöse Nachricht vom Verkäufer. Kein gestylter Header -- nur der Signatur-Block ist visuell gestaltet.

### Email-Text (überarbeiteter, seriöser Ton)

```text
Sehr geehrte Damen und Herren,

mein Name ist [Vorname Nachname] und ich betreue Sie als
persönlicher Ansprechpartner bei [Branding Name].

Gerne möchte ich Sie darauf aufmerksam machen, dass wir
derzeit ausgewählte Fahrzeuge im Kundenauftrag zu attraktiven
Sonderkonditionen anbieten. Sämtliche Fahrzeuge werden
selbstverständlich mit Garantie übergeben.

Eine Übersicht unserer aktuellen Fahrzeuge finden Sie hier:
%link%

Sollte ein Fahrzeug Ihr Interesse wecken, können Sie direkt
über unsere Plattform eine unverbindliche Anfrage stellen.
Ich werde mich anschließend zeitnah persönlich bei Ihnen melden.

Für Rückfragen stehe ich Ihnen jederzeit gerne per E-Mail
oder telefonisch unter %telefon% zur Verfügung.

Mit freundlichen Grüßen

─── Gestylte Signatur ───────────────
[Rundes Verkäufer-Foto]
Vorname Nachname
Verkaufsberater | Branding Name
telefon | email

[Audi Ringe SVG]
Branding Name
───────────────────────────────────────
```

### Technische Umsetzung in `src/pages/AdminEmailTemplates.tsx`

1. **Verkäufer laden**: Query `verkaeufer` Tabelle (id, vorname, nachname, email, telefon, avatar_url)
2. **Neue Sektion** "Marketing-Email" mit Select für Verkäufer + Branding, "Vorschau laden" Button, "HTML kopieren" Button (mit Toast-Feedback)
3. **`generateMarketingEmail(branding, verkaeufer)`**: HTML mit plain-text Body (kein gestylter Header), nur Signatur-Block gestylt (Foto rund, Kontakt, Audi-Ringe, Branding)
4. Platzhalter `%link%` und `%telefon%` bleiben im HTML (werden in Brevo ersetzt)

| Datei | Änderung |
|---|---|
| `src/pages/AdminEmailTemplates.tsx` | Verkäufer-Query, `generateMarketingEmail`, UI-Sektion mit Vorschau + HTML-Copy |

