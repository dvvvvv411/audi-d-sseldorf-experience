

## Fahrzeug deaktivieren/aktivieren

### Was passiert

Ein neues Boolean-Feld `aktiv` (default `true`) wird zur `fahrzeuge`-Tabelle hinzugefügt. In der Admin-Fahrzeugbestand-Tabelle bekommt jedes Fahrzeug einen Toggle-Button zum De-/Aktivieren. Deaktivierte Fahrzeuge werden in der Admin-Tabelle ans Ende sortiert und ausgegraut dargestellt. Auf den öffentlichen Seiten (`/fahrzeugbestand` und `/fahrzeugbestand/:sellerSlug`) werden deaktivierte Fahrzeuge komplett ausgeblendet.

### Änderungen

#### 1. Datenbank-Migration
```sql
ALTER TABLE fahrzeuge ADD COLUMN aktiv boolean NOT NULL DEFAULT true;
```

#### 2. `src/pages/AdminFahrzeugbestand.tsx`
- Toggle-Button (Eye/EyeOff Icon) in der Aktionen-Spalte hinzufügen
- Fahrzeuge sortieren: aktive zuerst, dann deaktivierte
- Deaktivierte Zeilen mit `opacity-40` ausgegraut darstellen
- Toggle ruft `supabase.from("fahrzeuge").update({ aktiv: !f.aktiv }).eq("id", f.id)` auf

#### 3. `src/pages/Fahrzeugbestand.tsx`
- Alle Fahrzeug-Queries um `.eq("aktiv", true)` erweitern, damit deaktivierte Fahrzeuge auf öffentlichen Seiten nicht angezeigt werden

| Datei | Änderung |
|---|---|
| Migration | `aktiv` Boolean-Spalte hinzufügen |
| `src/pages/AdminFahrzeugbestand.tsx` | Toggle-Button, Sortierung, Grayout |
| `src/pages/Fahrzeugbestand.tsx` | Filter auf `aktiv = true` |

