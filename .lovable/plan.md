## Neue Funktion: "Email senden" auf /admin/anfragen

Neuer Aktions-Button (Send-Icon) in der Aktionen-Spalte, öffnet ein Popup zum strukturierten Versand vorbereiteter Emails an den Anfragesteller (Kunden).

### Schritt 1 — Template-Auswahl im Popup
Dropdown mit zwei Optionen:
- **Servicebericht & Exposé**
- **Persönliches Angebot**

Alle Stammdaten (Branding, Verkäufer, Fahrzeug, Kunde, Anrede) werden automatisch aus der Anfrage geladen. Geschlecht für die Anrede wird über die bestehende `detect-gender` Edge Function ermittelt (mit lokalem Cache).

---

### Empfänger & Absender (für BEIDE Varianten gleich)

- **Empfänger (`to`):** Email des Kunden aus `anfragen.email`.
- **Absender-Email (`from` Adresse):** `verkaeufer.email` aus `/admin/verkaeufer` — also die persönliche Email-Adresse des zuständigen Verkäufers (NICHT `branding.email_absender`).
- **Absender-Anzeigename:** `"{Verkäufer Vorname} {Verkäufer Nachname} - {Branding Name}"`, also z.B. `Markus Stoll - Audi Zentrum Berlin`.
- **Resend-Header insgesamt:** `Markus Stoll - Audi Zentrum Berlin <markus.stoll@...>`.
- **Resend API Key:** weiterhin `branding.resend_api_key` (der API-Key gehört zum Branding, nicht zum Verkäufer).

> Hinweis: Damit Resend die Verkäufer-Email als `from` akzeptiert, muss die Domain dieser Adresse im Resend-Account des Brandings verifiziert sein. Falls nicht, wird Resend den Versand mit einem Fehler ablehnen — der Fehler wird im Toast und im Aktivitätslog sichtbar gemacht.

---

### Variante A — Servicebericht & Exposé

1. **Exposé-PDF** wird im Browser via `generateExposePdf()` (bereits vorhanden in `src/lib/expose-pdf.ts`) generiert.
2. **Servicenachweis-PDFs** werden aus `fahrzeuge.servicenachweis_urls` heruntergeladen (jede URL einzeln gefetcht, als ArrayBuffer).
3. **Email-Vorschau** im selben Stil wie `/admin/email-templates` (iframe + Betreff-Feld). Statusanzeige unterhalb:
   - „Exposé generiert (X KB)"
   - „Servicenachweis angehängt (N Dateien)"
   - „Absender: Markus Stoll - Audi Zentrum Berlin <markus.stoll@…>"
4. **„Email senden"-Button** ruft die neue Edge Function `send-template-email` mit Template `servicebericht`, allen PDF-Anhängen (base64), Betreff und HTML auf.
5. **Nach Erfolg:**
   - Anfrage-Status → `Service gesendet` (DB-Update + Toast + Aktivitätslog).
   - SMS an den Kunden via `send-anfrage-sms` (siehe SMS-Abschnitt) mit Text:
     > „Hallo {Vorname}, wir haben Ihnen soeben Exposé und Servicenachweis per Email zugeschickt. — {Branding}"

---

### Variante B — Persönliches Angebot

Zusätzliche Eingabefelder im Popup:
- **Nachlass** (Zahleneingabe in €, optional, default 0)
- **Unternehmensname** (optional)
- **Straße + Hausnummer** (optional, vorausgefüllt aus `anfragen.strasse`)
- **PLZ + Stadt** (optional, vorausgefüllt aus `anfragen.plz`/`stadt`)

1. **Angebot-PDF** wird im Browser über die bestehende `generateAngebotPdf()` aus `src/pages/AdminAngebote.tsx` generiert. Die Funktion wird dazu nach `src/lib/angebot-pdf.ts` ausgelagert.
2. **Email-Vorschau** im selben Stil wie Servicebericht. Statusanzeige: „Angebot generiert (X KB)" + Absender-Zeile.
3. **„Email senden"-Button** ruft `send-template-email` mit Template `angebot`, dem Angebot-PDF als Anhang.
4. **Nach Erfolg:**
   - Status → `Angebot gesendet`.
   - SMS an Kunden:
     > „Hallo {Vorname}, wir haben Ihnen soeben Ihr persönliches Angebot per Email zugeschickt. — {Branding}"

---

### Neue Edge Function `send-template-email`

- **Input:** `branding_id`, `verkaeufer_id`, `to`, `subject`, `html`, `attachments[]` (`{ filename, content_base64 }`), optional `anfrage_id`.
- Lädt Branding (`resend_api_key`, `name`) und Verkäufer (`vorname`, `nachname`, `email`).
- Resend-Aufruf:
  - `from: "{Verkäufer Vor+Nachname} - {Branding Name} <{verkaeufer.email}>"`
  - `to: [kunde_email]`, `subject`, `html`, `attachments`
- Loggt nach `aktivitaets_log` (`Email gesendet` / `Email fehlgeschlagen`).
- `verify_jwt = false` in `supabase/config.toml`.

### SMS-Versand

Bestehende `send-anfrage-sms` wird wiederverwendet und minimal um ein optionales `text_override`-Feld erweitert: wenn gesetzt, ersetzt es den Standardtext (Logging, `sms_verlauf`, Telefon-Normalisierung bleiben unverändert). Aufruf vom Frontend nach erfolgreichem Email-Versand.

---

### Reihenfolge der Umsetzung

1. **Refactor:** `generateAngebotPdf` aus `AdminAngebote.tsx` nach `src/lib/angebot-pdf.ts` extrahieren.
2. **Edge Function `send-template-email`** anlegen (Resend mit Anhängen, Verkäufer-Email als `from`) + `config.toml` ergänzen.
3. **Edge Function `send-anfrage-sms`** um optionales `text_override` erweitern.
4. **AdminAnfragen.tsx:**
   - Neuen `Send`-Aktions-Button + Tooltip „Email senden".
   - Neuer Email-Dialog mit Schritt-für-Schritt-Logik (Template-Auswahl → Vorbereitung → Vorschau mit Absender-Zeile → Versand).
   - PDF-Generierung + Servicenachweis-Download im Browser.
   - Aufruf von `send-template-email` und anschließend `send-anfrage-sms` (mit `text_override`).
   - Status-Update + Aktivitätslog-Eintrag nach Erfolg.
5. **Manuelles Testen** beider Varianten.

### Geänderte / neue Dateien

- `src/pages/AdminAnfragen.tsx`
- `src/pages/AdminAngebote.tsx`
- `src/lib/angebot-pdf.ts` (neu)
- `supabase/functions/send-template-email/index.ts` (neu)
- `supabase/functions/send-anfrage-sms/index.ts`
- `supabase/config.toml`

Bitte bestätigen — danach baue ich es in der oben genannten Reihenfolge.
