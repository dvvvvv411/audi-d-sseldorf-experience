# Schritt 1: Statische Assets / Logos pro Branding

Ziel: Logos und das Marketing-Bild aus `public/images/` raus, hinein ins `brandings`-Schema, sodass jedes Branding (Audi, später VW, Skoda, …) eigene Assets mitbringt.

## Datenbank

Neue Spalten in `brandings`:
- `logo_pdf_url text` – Logo für PDFs **und** Fahrzeugbestand-Seite (Header, Loader, Empty-State)
- `marketing_image_url text` – „Gebrauchtwagen :plus"-Werbebild auf Seite 1 des Angebots-PDF
- `email_logo_url text` – externe Logo-URL für E-Mail-HTML

Alle drei sind nullable (kein Default), damit alte Brandings nicht brechen.

## Storage

Neuer Bucket `branding-assets` (public). RLS:
- public SELECT
- authenticated INSERT/UPDATE/DELETE

## Admin-Brandings-Dialog

In `src/pages/AdminBrandings.tsx` neue Sektion **„Logos & Bilder"**:
- Datei-Upload „Logo (PDFs & Fahrzeugbestand-Seite)" → SVG/PNG → speichert in Bucket, schreibt public URL in `logo_pdf_url`
- Datei-Upload „Marketing-Bild Angebots-PDF" (JPG/PNG) → `marketing_image_url`
- Text-Input „E-Mail-Logo URL" → `email_logo_url` (kein Upload, weil Mails externe URL brauchen)
- Vorschau der aktuellen Bilder, Button zum Entfernen

## Bestehendes Audi-Branding seeden

Beim Migrationsschritt:
1. `/public/images/Audi.svg` und `/public/images/audi_gwplus.jpg` in den neuen Bucket hochladen (Script via `code--exec` mit Supabase Service-Role-Key, oder per SQL `storage.objects` direkt – sauberer ist ein kleines Upload-Script).
2. UPDATE auf das vorhandene „Audi Zentrum Berlin"-Branding mit:
   - `logo_pdf_url` → public URL des hochgeladenen `Audi.svg`
   - `marketing_image_url` → public URL des hochgeladenen `audi_gwplus.jpg`
   - `email_logo_url` → `https://www.tiemeyer.de/media/uploads/2025/06/Audi.svg` (bestehender Wert)

## Code-Anpassungen

### PDF-Generatoren – Branding wird durchgereicht
- `src/lib/expose-pdf.ts`: `loadAudiLogoAsBase64` ersetzen durch `loadBrandLogo(url)`. Funktionssignatur erhält bereits `branding`-Objekt → `branding.logo_pdf_url` verwenden, Fallback auf altes `/images/Audi.svg`. Header-Text `"Audi AG"` → `branding.name`.
- `src/lib/angebot-pdf.ts`: gleiches für Logo, dazu `loadImageAsBase64("/images/audi_gwplus.jpg")` → `branding.marketing_image_url`. Header-Text `"Audi AG"` → `branding.name`. Falls `marketing_image_url` leer ist, Bildbereich überspringen.
- `src/pages/AdminInzahlungnahme.tsx`: Selber Umbau, `branding.logo_pdf_url` nutzen, Header `branding.name`. (Bankzeile „Audi AG Bank" lassen wir vorerst, gehört zu Schritt 6/Rechtstexte.)

### Fahrzeugbestand-Seite
- `src/pages/Fahrzeugbestand.tsx`: Inline-`AudiLogo`-SVG-Komponente entfernen. Stattdessen `<img src={branding?.logo_pdf_url} alt={branding?.name} />` an drei Stellen (Header weiß-invertiert über CSS-Filter `brightness-0 invert`, Loader grau über `opacity` + Filter, Empty-State). Höhe entsprechend der bisherigen `width/height`.

### E-Mail-Templates
- `src/components/EmailSendDialog.tsx`: zwei `<img src="https://www.tiemeyer.de/...">` → `${branding.email_logo_url}`. Branding-Type um `email_logo_url` erweitern.
- `src/pages/AdminEmailTemplates.tsx`: drei `<img src="https://www.tiemeyer.de/...">` → `${branding.email_logo_url}`. Da `branding` schon vom Typ `Tables<"brandings">` ist, reicht der Tausch der URL.
- `supabase/functions/send-anfrage-email/index.ts`: Inline-Base64-Logo lassen wir bei diesem Schritt unangetastet – Edge-Function bekommt im Schritt 5 (E-Mails) eine eigene Anpassung; sonst müssen wir hier zusätzlich URL-Fetching einbauen, was das Scope sprengt. (Wenn du willst, ziehen wir es mit rein – sag kurz Bescheid.)

### Auth-Seite
- `src/pages/Auth.tsx`: Inline-`AudiRings`-Komponente und Text `Audi AG` ersetzen durch generischen Header, z. B. „Fahrzeug-Verkaufsplattform" mit einem neutralen Auto-Icon (lucide `Car`). Keine Markenreferenz mehr.

### Nicht angefasst (per User-Wunsch)
- Admin-Layout / `AdminRingsSmall` – bleibt Audi.
- `Gebrauchtwagen.tsx` Texte (Garantie, WLTP, Footer) – Schritt 7.
- Rechtstexte – Schritt 6.
- `index.html` Meta-Tags – Schritt 2.

## Technische Details

### Migration (Schema)
```sql
ALTER TABLE public.brandings
  ADD COLUMN logo_pdf_url text,
  ADD COLUMN marketing_image_url text,
  ADD COLUMN email_logo_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('branding-assets', 'branding-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read branding-assets"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'branding-assets');

CREATE POLICY "Auth can insert branding-assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'branding-assets');

CREATE POLICY "Auth can update branding-assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'branding-assets');

CREATE POLICY "Auth can delete branding-assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'branding-assets');
```

### Asset-Seeding
- Per Node-Script in `code--exec`: SVG/JPG aus `public/images/` lesen, mit Service-Role-Key in den Bucket uploaden, dann `UPDATE brandings` mit den drei URLs für „Audi Zentrum Berlin".

### Komponenten-Props
- `Fahrzeugbestand.tsx` lädt `branding` schon → einfach durchreichen.
- `EmailSendDialog`: Props-Interface des Branding-Objekts um `email_logo_url: string | null` erweitern. Aufrufer (`AdminAnfrageDetail`) muss diese Spalte mit selektieren.

## Akzeptanzkriterien
- Audi Zentrum Berlin: Exposé-PDF, Angebots-PDF, Inzahlungnahme-PDF und Fahrzeugbestand-Seite zeigen das Audi-Logo aus dem Storage-Bucket (nicht mehr aus `/public/images`).
- Angebots-PDF Seite 1 zeigt das GW+-Bild aus dem Storage-Bucket.
- E-Mails (Vorschau & Versand-Dialog) zeigen das Audi-Logo aus `email_logo_url`.
- Auth-Seite zeigt kein Audi-Logo mehr, sondern einen neutralen Header.
- Im Branding-Dialog kann ich für ein neues Branding alle drei Assets festlegen.