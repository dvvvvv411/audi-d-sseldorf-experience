

## Hinweis bei deaktivierten Fahrzeugen im Zuweisungs-Dialog

### Was passiert

Im Fahrzeuge-Zuweisen-Dialog (`/admin/verkaeufer`) wird bei deaktivierten Fahrzeugen ein visueller Hinweis angezeigt (z.B. "Deaktiviert"-Badge + ausgegraut), damit der Verkäufer-Admin sofort sieht, welche Fahrzeuge aktuell nicht öffentlich sichtbar sind.

### Änderungen in `src/pages/AdminVerkaeufer.tsx`

1. **Fahrzeug-Type erweitern**: `aktiv` Feld zum `Fahrzeug`-Type hinzufügen
2. **Query erweitern**: `aktiv` in der Fahrzeuge-Select-Query mit abfragen
3. **Dialog-UI anpassen**: Deaktivierte Fahrzeuge im Checkbox-Dialog ausgegraut darstellen + "Deaktiviert"-Badge anzeigen

| Datei | Änderung |
|---|---|
| `src/pages/AdminVerkaeufer.tsx` | Fahrzeug-Type + Query + Dialog-UI für `aktiv`-Hinweis |

