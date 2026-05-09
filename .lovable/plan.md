## Ziel
Admin-Reiter "Email Verlauf" unter `/admin/email`, der alle aus `EmailSendDialog` versendeten Emails (Template "Servicebericht & Exposé" und "Persönliches Angebot") anzeigt — analog zum bestehenden SMS-Verlauf.

## 1. Datenbank — Migration
Neue Tabelle `email_verlauf` (analog `sms_verlauf`):
- `id` uuid PK, `created_at` timestamptz default now()
- `anfrage_id` uuid (nullable)
- `branding_id` uuid (nullable)
- `verkaeufer_id` uuid (nullable)
- `empfaenger` text not null
- `absender` text – z.B. `Markus Stoll - Audi Zentrum Berlin <…>`
- `betreff` text
- `template` text – `service` | `angebot`
- `status` text – `gesendet` | `fehlgeschlagen`
- `fehler` text (nullable)
- `resend_id` text (nullable)
- `attachments` jsonb (nullable) – `[{ filename, size }]`
- `html` text (nullable) – für Detail-Preview
- RLS: nur SELECT für `authenticated`. INSERT erfolgt ausschließlich aus der Edge Function via Service Role.

## 2. Edge Function `send-template-email`
- Akzeptiert zusätzliches Feld `template` (`"service"` | `"angebot"`).
- Nach erfolgreichem Resend-Call: Insert in `email_verlauf` mit Status `gesendet`, `resend_id` aus Resend-Response, Attachments-Metadaten (Dateiname + Bytegröße aus base64), html, betreff, absender (`senderName <email>`).
- Bei Fehler: Insert mit Status `fehlgeschlagen` und `fehler`.
- `aktivitaets_log` bleibt zusätzlich erhalten.

## 3. `EmailSendDialog.tsx`
- Beim Invoke von `send-template-email` zusätzlich `template: "service" | "angebot"` mitsenden (basierend auf Auswahl im Dialog).

## 4. Neue Seite `src/pages/AdminEmailVerlauf.tsx`
Layout & Styling übernommen aus `AdminSmsVerlauf`:
- Tabelle: Datum, Empfänger, Absender, Template-Badge ("Service gesendet" / "Angebot gesendet"), Betreff, Status-Badge (grün/rot), Anhänge-Anzahl
- Filter:
  - Template-Dropdown: Alle / Service gesendet / Angebot gesendet
  - Suchfeld (Empfänger, Betreff)
  - Status-Filter (Alle / gesendet / fehlgeschlagen)
- Sortierung: `created_at DESC`
- Klick auf Zeile → Detail-Dialog (weißes Modal, dunkler Overlay):
  - Metadaten (Empfänger, Absender, Betreff, Datum, Status, evtl. Fehler)
  - Liste der Anhänge (Dateiname + KB)
  - HTML-Preview in iframe (sandbox)

## 5. Routing & Navigation
- `src/App.tsx`: `<Route path="email" element={<AdminEmailVerlauf />} />`
- `src/pages/AdminLayout.tsx`: Sidebar-Eintrag "Email Verlauf" (Mail-Icon) direkt unter "SMS Verlauf".

## Geänderte/neue Dateien
- **Migration:** Tabelle `email_verlauf` + RLS-Policy
- **Neu:** `src/pages/AdminEmailVerlauf.tsx`
- **Edit:** `src/App.tsx`, `src/pages/AdminLayout.tsx`, `src/components/EmailSendDialog.tsx`, `supabase/functions/send-template-email/index.ts`

## Reihenfolge der Umsetzung
1. Migration `email_verlauf` (mit RLS)
2. Edge Function `send-template-email` um Insert + `template`-Feld erweitern
3. `EmailSendDialog.tsx` → `template` mitsenden
4. `AdminEmailVerlauf.tsx` (Liste + Detail-Dialog)
5. Route + Sidebar-Eintrag