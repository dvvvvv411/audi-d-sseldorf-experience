

## Notizen als Chat-Log mit neuer DB-Tabelle

### Problem
Aktuell werden Notizen als einzelnes Textfeld (`notizen` in `anfragen`) gespeichert und überschrieben. Es gibt kein Log, keine Historie.

### Lösung
Neue Tabelle `anfrage_notizen` mit einzelnen Notiz-Einträgen (wie ein Chat-Log). Jede Notiz hat Timestamp und Text. Darstellung als chronologische Liste mit Eingabefeld unten.

### 1. Neue Datenbank-Tabelle: `anfrage_notizen`

```sql
CREATE TABLE public.anfrage_notizen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anfrage_id uuid NOT NULL,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.anfrage_notizen ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth can select" ON public.anfrage_notizen FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can insert" ON public.anfrage_notizen FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can delete" ON public.anfrage_notizen FOR DELETE TO authenticated USING (true);
```

### 2. AdminAnfragen.tsx — Notizen-Popup als Chat-Log

- Beim Öffnen: Alle `anfrage_notizen` für die Anfrage laden, sortiert nach `created_at`
- Darstellung: Scrollbare Liste mit Notiz-Bubbles (Text + Timestamp)
- Unten: Eingabefeld + "Hinzufügen"-Button → Insert in `anfrage_notizen`
- Altes `notizen`-Feld wird nicht mehr verwendet

### 3. AdminAnfrageDetail.tsx — Notizen-Sektion als Chat-Log

- Gleiche Logik: `anfrage_notizen` laden und als chronologische Liste darstellen
- Textarea + Button zum Hinzufügen neuer Notizen (Insert statt Update)
- Ersetzt die alte Textarea-basierte Speicherung

### UI-Darstellung (beide Seiten)

```text
┌─────────────────────────────┐
│ Interne Notizen             │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Kunde hat angerufen     │ │
│ │ 28.03.2026 14:30        │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Probefahrt vereinbart   │ │
│ │ 29.03.2026 09:15        │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ [Neue Notiz eingeben...  ]  │
│              [Hinzufügen]   │
└─────────────────────────────┘
```

| Datei | Änderung |
|---|---|
| Migration | Neue Tabelle `anfrage_notizen` |
| `src/pages/AdminAnfragen.tsx` | Notizen-Popup: Chat-Log statt Textfeld |
| `src/pages/AdminAnfrageDetail.tsx` | Notizen-Sektion: Chat-Log statt Textfeld |

