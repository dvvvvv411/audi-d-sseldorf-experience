

## Mailbox-Button pro Anfrage mit Klick-Zähler + Timestamp-Popup

### Konzept
Jede Anfragen-Zeile bekommt einen "Mailbox"-Button (Mail-Icon). Beim Klick wird ein Timestamp in einer neuen DB-Tabelle gespeichert. Ein roter Kreis zeigt die Anzahl der Klicks. Beim Klick auf den roten Kreis öffnet sich ein Popup mit allen Timestamps.

### 1. Neue Datenbank-Tabelle: `mailbox_clicks`

```sql
CREATE TABLE public.mailbox_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anfrage_id uuid NOT NULL,
  clicked_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mailbox_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can select mailbox_clicks" ON public.mailbox_clicks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth can insert mailbox_clicks" ON public.mailbox_clicks
  FOR INSERT TO authenticated WITH CHECK (true);
```

### 2. Änderungen in `src/pages/AdminAnfragen.tsx`

- **State**: `mailboxClicks: Record<string, string[]>` — Map von `anfrage_id` → Array von Timestamps
- **State**: `mailboxPopupAnfrageId: string | null` — welche Anfrage gerade das Timestamp-Popup zeigt
- **Laden**: Beim Mount alle `mailbox_clicks` laden und nach `anfrage_id` gruppieren
- **Pro Zeile** (neben Notizen + Auge): 
  - Mail-Icon-Button → beim Klick: Insert in `mailbox_clicks`, lokalen State updaten
  - Roter Kreis mit Zahl (nur wenn > 0) → beim Klick (`e.stopPropagation()`): Popup öffnen
- **Popup**: Dialog mit Liste aller Timestamps (formatiert als `dd.MM.yyyy HH:mm`)

### UI-Darstellung
```text
[📋] [📬 ●3] [👁]
       ↑
  Klick auf Icon = neuer Eintrag
  Klick auf ●3 = Popup mit Timestamps
```

| Datei | Änderung |
|---|---|
| Migration | Neue Tabelle `mailbox_clicks` |
| `src/pages/AdminAnfragen.tsx` | Mailbox-Button, roter Badge, Timestamp-Popup |

