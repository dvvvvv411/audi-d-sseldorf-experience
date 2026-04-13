

## Telegram Notifications: Chat-IDs verwalten & Benachrichtigungen bei neuen Anfragen

### Uebersicht

Bei jeder neuen Kundenanfrage wird parallel zum E-Mail-Versand eine Telegram-Nachricht an alle gespeicherten Chat-IDs gesendet. Dazu wird eine neue Admin-Seite zum Verwalten der Chat-IDs erstellt und die bestehende Edge Function erweitert.

### 1. Telegram Bot Token als Secret

Der Bot-Token wird als Supabase Secret `TELEGRAM_BOT_TOKEN` gespeichert (via `add_secret` Tool). Der User muss vorher einen Bot bei @BotFather erstellen.

### 2. Datenbank: Neue Tabelle `telegram_chat_ids`

```sql
CREATE TABLE public.telegram_chat_ids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id text NOT NULL UNIQUE,
  label text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_chat_ids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can select telegram_chat_ids" ON public.telegram_chat_ids
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can insert telegram_chat_ids" ON public.telegram_chat_ids
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can delete telegram_chat_ids" ON public.telegram_chat_ids
  FOR DELETE TO authenticated USING (true);
```

### 3. Admin-Seite: `/admin/telegram`

Neue Seite `src/pages/AdminTelegram.tsx`:
- Liste aller gespeicherten Chat-IDs mit Label und Loeschen-Button
- Formular zum Hinzufuegen: Chat-ID (Pflicht) + optionales Label (z.B. "Max Handy")
- "Test-Nachricht senden"-Button pro Zeile, der eine Testnachricht an diese Chat-ID schickt

Navigation in `AdminLayout.tsx`: Neuer Eintrag in `verwaltungNav` mit `MessageCircle`-Icon (aus lucide-react), Pfad `/admin/telegram`.

Route in `App.tsx`: `<Route path="telegram" element={<AdminTelegram />} />` innerhalb der Admin-Route.

### 4. Edge Function erweitern: `send-anfrage-email`

Die bestehende Edge Function wird um Telegram-Versand erweitert. Nach dem erfolgreichen E-Mail-Versand (oder parallel dazu):

1. Alle Chat-IDs aus `telegram_chat_ids` laden
2. An jede Chat-ID eine formatierte Nachricht senden via Telegram Bot API (`https://api.telegram.org/bot{TOKEN}/sendMessage`)

**Nachrichtenformat** (HTML parse_mode):
```
🚗 Neue Anfrage eingegangen!

Name: Max Mustermann
📞 +49 123 456789
📧 max@example.com

Fahrzeug: Audi A4 Avant 2.0 TDI
Preis: 45.900 €
```

Der Edge-Function-Body bleibt gleich (`branding_id`, `fahrzeug_id`, `kunde_email`). Zusaetzlich werden `kunde_name`, `kunde_telefon` hinzugefuegt, damit die Telegram-Nachricht diese Daten hat.

### 5. Frontend: Anfrage-Submission anpassen

In `Gebrauchtwagen.tsx` beim `supabase.functions.invoke("send-anfrage-email", ...)` zusaetzlich `kunde_name` und `kunde_telefon` im Body mitsenden:

```ts
body: {
  branding_id: v.branding_id,
  fahrzeug_id: fahrzeug.id,
  kunde_email: anfrageForm.email.trim(),
  kunde_name: `${anfrageForm.vorname.trim()} ${anfrageForm.nachname.trim()}`,
  kunde_telefon: anfrageForm.telefon.trim(),
}
```

### 6. Test-Edge-Function: `send-telegram-test`

Separate kleine Edge Function fuer den "Test senden"-Button auf der Admin-Seite. Nimmt `chat_id` und `message` entgegen und sendet via Bot API.

### Dateien

| Datei | Aenderung |
|---|---|
| Migration | Neue Tabelle `telegram_chat_ids` |
| Secret | `TELEGRAM_BOT_TOKEN` hinzufuegen |
| `src/pages/AdminTelegram.tsx` | NEU -- Chat-ID Verwaltung |
| `src/pages/AdminLayout.tsx` | Neuer Nav-Eintrag "Telegram" |
| `src/App.tsx` | Neue Route `/admin/telegram` |
| `supabase/functions/send-anfrage-email/index.ts` | Telegram-Versand nach E-Mail |
| `supabase/functions/send-telegram-test/index.ts` | NEU -- Test-Nachricht senden |
| `src/pages/Gebrauchtwagen.tsx` | `kunde_name` + `kunde_telefon` mitsenden |
| `src/integrations/supabase/types.ts` | Wird automatisch aktualisiert |

