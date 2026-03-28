

## Anfrage-Popup + Admin-Anfragen-Bereich

### 1. Neue DB-Tabelle `anfragen`

Migration erstellen:

```sql
CREATE TABLE public.anfragen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  vorname text NOT NULL,
  nachname text NOT NULL,
  email text NOT NULL,
  telefon text NOT NULL,
  nachricht text NOT NULL,
  datenschutz_akzeptiert boolean NOT NULL DEFAULT false,
  fahrzeug_id uuid NOT NULL,
  fahrzeug_name text NOT NULL,
  fahrzeug_preis numeric NOT NULL,
  auftragsnummer text,
  verkaeufer_id uuid NOT NULL,
  verkaeufer_name text NOT NULL,
  branding_name text NOT NULL,
  status text NOT NULL DEFAULT 'NEU',
  notizen text
);

ALTER TABLE public.anfragen ENABLE ROW LEVEL SECURITY;

-- Anon darf einfuegen (Kontaktformular)
CREATE POLICY "Anon can insert anfragen" ON public.anfragen FOR INSERT TO anon WITH CHECK (true);
-- Auth kann alles lesen und updaten
CREATE POLICY "Auth can select anfragen" ON public.anfragen FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can update anfragen" ON public.anfragen FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
```

### 2. Anfrage-Popup in `src/pages/Gebrauchtwagen.tsx`

- "Fahrzeug anfragen" Button (Zeile 430) oeffnet einen Dialog-State
- Grosser Dialog (`max-w-2xl`, auf Mobile `h-full w-full` fullscreen) mit `backdrop-blur-sm`
- Titel: "Schreiben Sie uns"
- Felder: Vorname*, Nachname* (nebeneinander), E-Mail*, Rueckrufnummer* (nebeneinander), Ihre Nachricht* (Textarea)
- Checkbox mit Datenschutz-Text, "Datenschutzbestimmungen" verlinkt auf `/rechtliches/datenschutzinformation`
- Hinweis "* benoetigte Angaben" unten links
- Buttons: "Zuruecksetzen" (outline) + "Abschicken" (primary petrolblau)
- Bei Submit: INSERT in `anfragen` mit Fahrzeug- und Verkaeufer-Infos, Toast bei Erfolg, Dialog schliessen

### 3. Admin-Seite `src/pages/AdminAnfragen.tsx`

- Tabelle mit Spalten: Name, Email, Telefon, Nachricht (30 Zeichen + ...), Verkaeufer, Preis, Fahrzeugtitel, Branding, Status (Badge "NEU"), Auge-Button
- Auge-Button navigiert zu `/admin/anfragen/:id`

### 4. Admin-Detailseite `src/pages/AdminAnfrageDetail.tsx`

- Laedt Anfrage per ID
- Zeigt alle Anfrage-Infos, Fahrzeug-Details, Verkaeufer-Details
- Notizfeld (Textarea) mit Speichern-Button (UPDATE notizen)
- Zurueck-Button

### 5. Routing in `src/App.tsx`

- `/admin/anfragen` → `AdminAnfragen`
- `/admin/anfragen/:id` → `AdminAnfrageDetail`

### 6. Navigation in `src/pages/AdminLayout.tsx`

- Neuen Nav-Eintrag "Anfragen" mit `MessageSquare` Icon hinzufuegen

### Dateien

| Datei | Aenderung |
|---|---|
| Migration | `anfragen` Tabelle erstellen |
| `src/pages/Gebrauchtwagen.tsx` | Dialog-State + Anfrage-Popup mit Formular |
| `src/pages/AdminAnfragen.tsx` | Neue Seite: Anfragen-Tabelle |
| `src/pages/AdminAnfrageDetail.tsx` | Neue Seite: Anfrage-Detailansicht mit Notizen |
| `src/App.tsx` | Neue Admin-Routen |
| `src/pages/AdminLayout.tsx` | Nav-Eintrag "Anfragen" |

