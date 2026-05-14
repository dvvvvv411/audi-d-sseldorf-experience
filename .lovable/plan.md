## Plan: Komplette Datenbank rekonstruieren

Der gesamte Verlauf der Datenbank steckt bereits versioniert im Projekt — 23 Migrationsdateien unter `supabase/migrations/`. Die `types.ts` (704 Zeilen) bestätigt den letzten Stand. Es gibt **keinen** Datenverlust an Schema-Wissen, nur die Daten selbst sind weg.

### Was rekonstruiert wird

**Tabellen** (aus den Migrationen + Code-Verweisen abgeleitet):
- `verkaeufer` — Verkäufer-Profile mit Slug
- `brandings` — Marken/Standorte (alle Felder inkl. Logo-URLs, Resend-/Seven.io-/Pixel-Konfig, Domain, Vorstand)
- `fahrzeuge` — Fahrzeugbestand
- `verkaeufer_fahrzeuge` — Zuordnung Verkäufer ↔ Fahrzeug
- `anfragen` — Kundenanfragen
- `anfrage_notizen` — Notizen zu Anfragen
- `email_verlauf` — gesendete E-Mails
- `sms_verlauf` — gesendete SMS
- `aktivitaets_log` — Activity Log
- `mailbox_clicks` — Klick-Tracking
- `cloaker_redirects` — Redirect-Tracking
- `telegram_chat_ids` — Telegram-Empfänger
- `user_roles` + `app_role` Enum — Rollen (admin etc.)

**Datenbank-Funktionen & Trigger**:
- `has_role(_user_id, _role)` — SECURITY DEFINER, Standard-Pattern
- `handle_new_user()` + Trigger auf `auth.users` — neue User bekommen automatisch `admin`-Rolle
- `update_updated_at_column()` + Trigger auf relevanten Tabellen

**RLS-Policies**: alle Policies aus den 23 Migrationen (admin-only auf den meisten Tabellen, public read wo nötig).

**Storage-Buckets** (aus Code-Verwendung in `AdminBrandings`, `AdminFahrzeugbestand`, `AdminVerkaeufer`):
- `avatars` — public
- `fahrzeuge` — public
- `branding-assets` — public

### Vorgehen

1. **Eine einzige konsolidierte Replay-Migration** erzeugen, indem alle 23 vorhandenen Migrationsdateien in chronologischer Reihenfolge zu einer großen Migration zusammengeführt werden. Das garantiert exakt denselben Endzustand wie vorher, ohne dass etwas erraten werden muss.
2. **Storage-Buckets** im selben Migration-Call anlegen (Insert in `storage.buckets` + Storage-Policies, falls vorhanden).
3. **Edge Functions** redeployen — Code liegt unverändert im Repo:
   - `detect-gender`, `kfz-callback`, `kfz-notify`, `kfz-resolve`, `send-anfrage-email`, `send-anfrage-sms`, `send-telegram-test`, `send-template-email`
4. **Secrets prüfen** — laut aktueller Konfiguration sind bereits gesetzt: `LOVABLE_API_KEY`, `TELEGRAM_BOT_TOKEN`, plus Standard-Supabase-Secrets. Resend- und Seven.io-Keys werden **pro Branding** in der DB gespeichert (nicht als Edge-Function-Secret) — kommen mit dem Wiederanlegen der Brandings automatisch zurück.

### Was du nach dem Migrations-Approve manuell tun musst

- **Admin-Account neu anlegen**: einmalig auf `/auth` registrieren — der `handle_new_user`-Trigger gibt dem neuen Account automatisch die Admin-Rolle.
- **Brandings, Verkäufer, Fahrzeuge** im Admin-Panel neu erfassen (oder, falls du noch ein Backup/Export der alten DB hast: über Insert-Tool importieren — sag Bescheid).
- **Storage-Inhalte** (Logos, Fahrzeugbilder, Avatare) müssen neu hochgeladen werden — Buckets selbst werden vom Migration-Schritt erstellt, die Dateien sind weg.
- **Telegram Chat-IDs** in `/admin/telegram` neu eintragen (oder Bot erneut anschreiben, je nach bestehender Logik).

### Reihenfolge der Tool-Calls nach Approval

1. `supabase--migration` mit dem zusammengeführten SQL aller 23 Migrationen + Storage-Buckets.
2. Nach Bestätigung: `supabase--deploy_edge_functions` für alle 8 Funktionen.
3. `supabase--linter` zur Sicherheitskontrolle.
4. Kurzer Test-Read auf `brandings`/`verkaeufer`, um zu verifizieren, dass alle Tabellen existieren.

### Was **nicht** im Scope ist

- **Daten**-Wiederherstellung: ohne Backup unmöglich. Falls du bei Supabase ein PITR-Backup oder einen DB-Dump hast, sag Bescheid — dann importieren wir Daten statt sie neu zu erfassen.
- Änderungen am Frontend-Code — der ist bereits korrekt für dieses Schema.
- Ändern der `types.ts` — die wird nach Migration automatisch von Supabase regeneriert.

### Risiko-Hinweis

Die 23 Migrationen enthalten teilweise spätere `ALTER TABLE`/`DROP COLUMN`-Schritte, die Spalten erst hinzufügen und später wieder entfernen. Beim sequentiellen Replay ist das unkritisch, weil exakt dieselbe Reihenfolge angewandt wird — Endzustand ist identisch zum vorherigen Schema.
