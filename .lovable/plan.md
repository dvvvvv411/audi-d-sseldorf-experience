

## Straße + Hausnummer optional machen

Kleine Anpassung in `AdminAngebote.tsx`:

1. **Validierung**: `interessentStrasse` aus der `canGenerate`-Bedingung entfernen
2. **PDF-Generierung**: Straße nur rendern wenn ausgefüllt, Y-Position entsprechend anpassen
3. **Label**: Placeholder oder Label mit "(optional)" kennzeichnen

Betrifft nur `src/pages/AdminAngebote.tsx`.

