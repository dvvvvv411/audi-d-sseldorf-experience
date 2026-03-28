

## Zwei kleine Anpassungen auf der Gebrauchtwagen-Seite

### 1. Auftragsnummer-Icon ändern
- Im `specItems` Array das `Hash`-Icon durch `Star` (aus lucide-react) ersetzen

### 2. Standort-Spalte umbauen zu "Ihr Ansprechpartner"
- Überschrift von "Standort" zu "Ihr Ansprechpartner" ändern
- Branding-Adresse, Standort-Infos und "Route berechnen"-Button entfernen
- Nur noch Verkäufer-Infos anzeigen: Avatar, Name, Telefon, E-Mail
- "Anrufen"-Button bleibt, "Route berechnen" wird entfernt

### Datei

| Datei | Änderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | `Hash` → `Star` Import + specItems, Standort-Sektion zu Ansprechpartner umbauen |

