

## Verkäufer- und Brandings-Verwaltung im Admin Panel

### Uebersicht
Zwei neue Unterseiten im Admin-Bereich mit Supabase-Tabellen, Storage-Bucket fuer Avatare, und Sidebar-Navigation.

### 1. Datenbank

**Tabelle `brandings`:**
- id (uuid, PK), name (text), strasse (text), plz (text), stadt (text), email (text), amtsgericht (text), handelsregister (text), geschaeftsfuehrer (text), ust_id (text)
- Optional: resend_api_key (text, nullable), email_absender (text, nullable), absendername (text, nullable), sevenio_absendername (text, nullable, max 11 Zeichen)
- created_at (timestamptz)
- RLS: Authentifizierte Nutzer koennen CRUD

**Tabelle `verkaeufer`:**
- id (uuid, PK), vorname (text), nachname (text), email (text), telefon (text), avatar_url (text, nullable), branding_id (uuid, FK auf brandings, nullable)
- created_at (timestamptz)
- RLS: Authentifizierte Nutzer koennen CRUD

**Storage Bucket `avatars`:** Oeffentlich, fuer Verkäufer-Bilder.

### 2. Routing & Sidebar

- Admin-Layout wird zu einer Wrapper-Komponente mit Sidebar + `<Outlet />`
- Routen: `/admin` (Dashboard), `/admin/verkaeufer`, `/admin/brandings`
- Sidebar erhaelt zwei neue Eintraege: "Verkäufer" (Users-Icon) und "Brandings" (Building-Icon)
- `src/App.tsx`: Verschachtelte Routen unter `/admin/*`

### 3. Brandings-Seite (`/admin/brandings`)

- Card/Tabellen-Ansicht aller Brandings aus Supabase
- "Branding hinzufuegen" Button oeffnet Dialog mit Formular:
  - Pflicht: Unternehmensname, Strasse+Nr, PLZ+Stadt, Email, Amtsgericht, Handelsregister, Geschaeftsfuehrer, USt-IdNr
  - Optional: Resend API-Key, Email Absender, Absendername, Seven.io Absendername (max 11 Zeichen)
- Bearbeiten/Loeschen pro Eintrag

### 4. Verkäufer-Seite (`/admin/verkaeufer`)

- Card-Ansicht aller Verkäufer aus Supabase (Foto, Name, Email, Telefon, Branding)
- "Verkäufer hinzufuegen" Button oeffnet Dialog:
  - Vorname, Nachname, Email, Telefonnummer
  - Avatar-Upload (Supabase Storage)
  - Branding-Auswahl (Dropdown aus brandings-Tabelle)
- Bearbeiten/Loeschen pro Karte

### 5. Dateien

| Datei | Aenderung |
|---|---|
| Migration SQL | brandings + verkaeufer Tabellen, Storage Bucket, RLS |
| `src/pages/AdminLayout.tsx` | Neuer Layout-Wrapper mit Sidebar + Outlet |
| `src/pages/AdminDashboard.tsx` | Bestehender Dashboard-Inhalt extrahiert |
| `src/pages/AdminVerkaeufer.tsx` | Verkäufer-Verwaltung |
| `src/pages/AdminBrandings.tsx` | Brandings-Verwaltung |
| `src/App.tsx` | Verschachtelte Admin-Routen |

