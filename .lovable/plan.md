

## Aktivitätsprotokoll + Status-Dropdown Styling

### 1. Neue DB-Tabelle: `aktivitaets_log`

```sql
CREATE TABLE public.aktivitaets_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_email text NOT NULL,
  aktion text NOT NULL,        -- 'status_geaendert', 'notiz_hinzugefuegt', 'mailbox_klick'
  details text,                -- z.B. "Status: Neu → In Bearbeitung" oder Notiztext
  anfrage_id uuid              -- optional, für Filterung pro Anfrage
);

ALTER TABLE public.aktivitaets_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can insert aktivitaets_log" ON public.aktivitaets_log
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can select aktivitaets_log" ON public.aktivitaets_log
  FOR SELECT TO authenticated USING (true);
```

### 2. Aktivitätsprotokoll-Sektion in `AdminAnfragen.tsx`

- Oberhalb der Tabelle (unter dem Titel "Anfragen") eine aufklappbare/sichtbare Sektion "Aktivitätsprotokoll" einfügen
- Beim Laden: alle Einträge aus `aktivitaets_log` laden (neueste zuerst, limit ~50)
- Darstellung als vertikale Timeline mit:
  - Timestamp (dd.MM.yyyy HH:mm)
  - User-E-Mail mit farbigem Dot (Farbe per Hash der E-Mail generiert)
  - Aktionstext + Details (bei Notizen: Notiztext anzeigen)
- Icons pro Aktionstyp: Zahnrad für Status, StickyNote für Notiz, Mail für Mailbox

### 3. Logging bei Aktionen

Bei jeder der drei Aktionen wird ein Insert in `aktivitaets_log` gemacht:

- **Statusänderung**: `aktion: "status_geaendert"`, `details: "Neu → In Bearbeitung"`, User-Email via `supabase.auth.getUser()`
- **Notiz hinzufügen**: `aktion: "notiz_hinzugefuegt"`, `details: Notiztext`
- **Mailbox-Klick**: `aktion: "mailbox_klick"`, `details: null`

### 4. Status-Dropdown hell statt schwarz

SelectTrigger-Klasse: aktuell werden die statusColors korrekt gesetzt (hell), aber ggf. überschreibt eine globale Style den Text. Sicherstellen, dass der Trigger keine dunklen Hintergrundfarben bekommt — prüfen und `bg-white` oder die jeweilige helle statusColor verwenden.

### Technische Details

| Datei | Änderung |
|---|---|
| Migration | Neue Tabelle `aktivitaets_log` |
| `src/pages/AdminAnfragen.tsx` | Aktivitätsprotokoll-Sektion, Logging bei Status/Notiz/Mailbox, SelectTrigger heller Stil |

