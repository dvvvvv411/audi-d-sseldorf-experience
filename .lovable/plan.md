

## Auth-Seite & Admin-Dashboard fuer Audi Duesseldorf

### Uebersicht
1. Supabase Auth aktivieren (Email/Passwort)
2. `/auth` Seite mit 50/50 Split-Layout (links Branding, rechts Login/Register)
3. `user_roles` Tabelle mit admin-Rolle
4. Mockup `/admin` Dashboard (helles Theme)
5. Auth-Guard fuer geschuetzte Routen

### 1. Datenbank-Migration

```sql
-- Enum und Rollen-Tabelle
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'admin',
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security-definer Funktion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

-- RLS: Nutzer kann eigene Rolle lesen
CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Trigger: Automatisch admin-Rolle bei Registrierung
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$ BEGIN INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin'); RETURN NEW; END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Auth-Seite (`/auth`)

**Layout**: Fullscreen, 2-Spalten (50/50) auf Desktop, gestapelt auf Mobile.

- **Linke Seite** (dunkel/schwarz): Audi Ringe, "Audi Duesseldorf", Untertitel "Verwaltungsportal", dezente Grafik/Gradient
- **Rechte Seite** (helles Theme, weiss): Login/Register-Tabs
  - **Login**: Email + Passwort + Button
  - **Register**: Email + Passwort + Passwort bestaetigen + Button
  - Sauberes, modernes Design mit guter Typografie

Nach erfolgreichem Login/Register: Redirect zu `/admin`.

### 3. Admin-Dashboard (`/admin`) -- Mockup, helles Theme

**Layout**: Sidebar-Navigation + Main Content, helles Farbschema.

**Sidebar**:
- Audi Logo oben
- Navigation: Fahrzeugbestand, Fahrzeug hinzufuegen, Anfragen, Abmelden

**Hauptbereich** (Default: Fahrzeugbestand):
- **Fahrzeugbestand**: Tabelle mit Mockdaten (Modell, Baujahr, Preis, Status), Suchfeld
- **Fahrzeug hinzufuegen**: Formular-Mockup (Modell, Baujahr, Preis, Beschreibung, Bild-Upload-Platzhalter)
- **Anfragen**: Liste mit Mockdaten (Name, Email, Betreff, Datum, Status)

Alle Aktionen sind rein visuell (keine echte DB-Anbindung).

### 4. Route-Schutz

- `ProtectedRoute` Komponente: Prueft Auth-Status, leitet zu `/auth` um wenn nicht eingeloggt
- `/admin` wird mit `ProtectedRoute` geschuetzt

### 5. Dateien

| Datei | Aenderung |
|---|---|
| `src/pages/Auth.tsx` | Neue Auth-Seite mit Split-Layout |
| `src/pages/Admin.tsx` | Neues Admin-Dashboard Mockup |
| `src/components/ProtectedRoute.tsx` | Auth-Guard Komponente |
| `src/App.tsx` | Neue Routen `/auth`, `/admin` |
| Migration | user_roles Tabelle + Trigger |

