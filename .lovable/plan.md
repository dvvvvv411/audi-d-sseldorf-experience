

## PDF-Bereinigung: ABC_02_01, Nachlass-Logik, Divider

### Änderungen in `src/pages/AdminAngebote.tsx`

1. **"ABC_02_01" entfernen** (Zeilen 354-356): Den Page-Code-Block komplett löschen.

2. **Nachlass/Zwischensumme bedingt anzeigen** (Zeilen 276-278): Nur wenn `nachlass > 0`, die Zeilen "- Nachlass" und "Zwischensumme" rendern. Bei `nachlass === 0` direkt nur Fahrzeugpreis, Kostenlose Lieferung und Gesamtsumme anzeigen.

3. **Divider über Gesamtsumme entfernen** (Zeile 280): `drawLine(y - 2)` und `y += 1` entfernen.

### Datei

| Datei | Änderung |
|---|---|
| `src/pages/AdminAngebote.tsx` | 3 Stellen anpassen |

