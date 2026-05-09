## Seven.io SMS-Integration

### Ziel
- Pro Branding einen Seven.io API-Key (Cleartext) im Admin pflegen.
- Bei jeder neuen Anfrage automatisch eine Bestätigungs-SMS an den Kunden (Variante 2, persönlich mit Verkäufername).
- Erfolg/Fehler im `aktivitaets_log` protokollieren.
- Neuer Admin-Reiter **„SMS Verlauf"** mit Liste aller versendeten SMS.

### 1. Datenbank

**a) `brandings`** — neue Spalte:
- `sevenio_api_key` (text, nullable)

**b) Neue Tabelle `sms_verlauf`:**
| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | |
| `created_at` | timestamptz | Versandzeitpunkt |
| `anfrage_id` | uuid | Referenz Anfrage (nullable) |
| `branding_id` | uuid | Referenz Branding |
| `empfaenger` | text | E.164-Nummer |
| `absender` | text | Verwendeter Sender (sevenio_absendername) |
| `text` | text | Gesendeter SMS-Text |
| `status` | text | `gesendet` / `fehlgeschlagen` |
| `fehler` | text | Fehlermeldung (nullable) |
| `seven_response` | jsonb | Roh-Antwort von Seven.io |

RLS: nur `authenticated` SELECT; INSERT erfolgt aus Edge Function via Service-Role.

### 2. Telefonnummer-Normalisierung (E.164)

**Default-Ländervorwahl:** `+49` (Deutschland), da Beispiele DE-Nummern sind.

**Algorithmus** (in dieser Reihenfolge):
1. **Whitespace, Bindestriche, Slashes, Klammern, Punkte entfernen** → nur Ziffern und führendes `+` bleiben übrig.
2. Wenn das Ergebnis mit `+` beginnt → **bereits E.164**, alle Nicht-Ziffern nach dem `+` entfernen, fertig.
3. Wenn das Ergebnis mit `00` beginnt → `00` durch `+` ersetzen, fertig.
4. Wenn das Ergebnis mit `0` beginnt → führende `0` entfernen und `+49` voranstellen.
5. Andernfalls (reine Ziffern ohne führende 0/00/+) → `+49` voranstellen.

**Beispiele (verifiziert):**

| Eingabe | Schritt 1 (cleaned) | Regel | Ergebnis |
|---|---|---|---|
| `03771 159182` | `03771159182` | beginnt mit `0` → `+49` + Rest | `+493771159182` |
| `+49 157 86502896` | `+4915786502896` | beginnt mit `+` | `+4915786502896` |
| `01723071207` | `01723071207` | beginnt mit `0` → `+49` + Rest | `+491723071207` |
| `07544/9558990` | `075449558990` | beginnt mit `0` → `+49` + Rest | `+4975449558990` |
| `0043 660 1234567` | `00436601234567` | `00` → `+` | `+436601234567` |

**Validierung nach Normalisierung:** `+` gefolgt von 8–15 Ziffern (E.164-Standard). Bei Verstoß → `skipped: "invalid_phone"`, kein SMS-Versand, kein sms_verlauf-Eintrag.

### 3. Admin UI

**a) `src/pages/AdminBrandings.tsx`** — Im SMS-Block neues Feld **Seven.io API-Key** (Cleartext-Input, optional).

**b) Neue Seite `src/pages/AdminSmsVerlauf.tsx`** — Reiter „SMS Verlauf":
- Liste aller `sms_verlauf`-Einträge, neueste zuerst.
- Spalten: Datum/Zeit, Empfänger, Absender, Branding, Status-Badge (grün/rot), Text-Vorschau, Fehler.
- Klick → Detail-Modal mit komplettem Text + Roh-Response.
- Suche (Empfänger/Text) + Status-Filter.
- Link „Zur Anfrage" → `/admin/anfragen/:anfrage_id`.

**c) `src/App.tsx`** — Route `/admin/sms` → `AdminSmsVerlauf`.

**d) `src/pages/AdminLayout.tsx`** — Sidebar-Eintrag „SMS Verlauf" (Icon `MessageSquare`).

### 4. Neue Edge Function — `supabase/functions/send-anfrage-sms/index.ts`

Body: `{ branding_id, anfrage_id, telefon, vorname, verkaeufer_name }` (Zod-validiert).

Ablauf:
1. Branding laden (`sevenio_api_key`, `sevenio_absendername`, `name`).
2. Wenn API-Key fehlt → `{skipped: "no_api_key"}`.
3. Telefon nach **Abschnitt 2** normalisieren. Bei ungültig → `{skipped: "invalid_phone"}`.
4. SMS-Text (Variante 2):
   ```
   Hallo {vorname}, Ihre Anfrage ist bei uns eingegangen.
   {verkaeufer_name} wird sich zeitnah persönlich bei Ihnen melden.
   {sevenio_absendername || branding.name}
   ```
5. POST `https://gateway.seven.io/api/sms` mit Header `X-Api-Key`, Body `{ to, text, from }` (`from` nur wenn ≤ 11 Zeichen).
6. Insert in `sms_verlauf` (Status `gesendet`/`fehlgeschlagen`, Roh-Response).
7. Insert in `aktivitaets_log` (`SMS gesendet`/`SMS fehlgeschlagen`, `user_email="system"`).

CORS gesetzt; `verify_jwt = false`.

### 5. Frontend Hook in Anfrage-Submit

`src/pages/Gebrauchtwagen.tsx`:
- Insert auf `.select("id").single()` umstellen.
- Parallel zu `send-anfrage-email` (fire-and-forget):
```ts
supabase.functions.invoke("send-anfrage-sms", {
  body: { branding_id, anfrage_id, telefon, vorname, verkaeufer_name },
}).catch((err) => console.error("SMS send error:", err));
```

### 6. Sicherheit
- `sevenio_api_key` wird nie im Frontend selektiert (nur Service-Role in Edge Function).

### Geänderte/neue Dateien

| Datei | Änderung |
|---|---|
| Migration | `brandings.sevenio_api_key` + Tabelle `sms_verlauf` mit RLS |
| `src/pages/AdminBrandings.tsx` | Eingabefeld API-Key |
| `supabase/functions/send-anfrage-sms/index.ts` | Neue Edge Function |
| `src/pages/Gebrauchtwagen.tsx` | Insert mit `.select("id")` + SMS-Aufruf |
| `src/pages/AdminSmsVerlauf.tsx` | Neue Seite SMS Verlauf |
| `src/App.tsx` | Route `/admin/sms` |
| `src/pages/AdminLayout.tsx` | Sidebar-Link „SMS Verlauf" |

### Erwartetes Ergebnis
1. Admin trägt Seven.io API-Key am Branding ein.
2. Kunde sendet Anfrage → erhält sofort persönliche Bestätigungs-SMS an die korrekt normalisierte Nummer.
3. „SMS Verlauf"-Reiter zeigt alle Versände mit Status und Fehlerdetails.
4. Activity Log enthält zusätzlich kurze Einträge.
