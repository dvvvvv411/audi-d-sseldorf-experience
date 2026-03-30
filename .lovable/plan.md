

## Resend E-Mail bei Anfrage senden

### Was passiert

Wenn ein Kunde eine Anfrage abschickt (Kontaktformular auf `/gebrauchtwagen`), wird eine Bestätigungs-E-Mail an den Kunden gesendet. Dafür wird eine Supabase Edge Function erstellt, die die Resend API nutzt. Die E-Mail verwendet das bestehende HTML-Template aus `AdminEmailTemplates.tsx` und die Branding-Daten (Resend API Key, E-Mail-Absender, Absendername) des jeweiligen Brandings.

### Ablauf

```text
Kunde schickt Anfrage
       │
       ▼
Insert in "anfragen"-Tabelle (wie bisher)
       │
       ▼
Frontend ruft Edge Function "send-anfrage-email" auf
       │
       ▼
Edge Function:
  1. Liest Branding-Daten (resend_api_key, email_absender, absendername)
  2. Liest Fahrzeug-Daten
  3. Generiert HTML aus dem E-Mail-Template
  4. Sendet via Resend API an die Kunden-E-Mail
```

### Technische Details

#### 1. Edge Function `supabase/functions/send-anfrage-email/index.ts`

- Empfängt per POST: `anfrage_id` (oder direkt die nötigen Daten: `branding_id`, `fahrzeug_id`, `kunde_email`, `kunde_name`)
- Liest aus Supabase:
  - `brandings` → `resend_api_key`, `email_absender`, `absendername`, `name` (für Template)
  - `fahrzeuge` → Fahrzeugdaten (für Template)
- Generiert das HTML (identisches Template wie in `generateAnfrageEmail`)
- Sendet via `POST https://api.resend.com/emails` mit dem Resend API Key des Brandings
- CORS-Headers für Frontend-Aufruf
- Input-Validierung mit Zod

#### 2. Frontend `src/pages/Gebrauchtwagen.tsx`

- Nach erfolgreichem Insert in `anfragen`: `supabase.functions.invoke("send-anfrage-email", { body: { ... } })` aufrufen
- Fire-and-forget (Fehler bei E-Mail-Versand blockiert nicht die Anfrage-Bestätigung)

### Sicherheit

- Der Resend API Key liegt bereits in der `brandings`-Tabelle (Spalte `resend_api_key`) und wird nur serverseitig in der Edge Function gelesen
- Die Edge Function nutzt den Service Role Key um auf Branding-Daten zuzugreifen
- Input-Validierung aller Parameter

| Datei | Änderung |
|---|---|
| `supabase/functions/send-anfrage-email/index.ts` | Neue Edge Function: Template rendern + Resend API Call |
| `src/pages/Gebrauchtwagen.tsx` | Nach Anfrage-Insert: Edge Function aufrufen |

