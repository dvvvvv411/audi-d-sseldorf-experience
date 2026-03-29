

## Fix: Datenschutz-Checkbox wird beim Klick auf Label-Text doppelt getoggled

### Problem
Die `<label>` hat sowohl `htmlFor="datenschutz"` als auch einen eigenen `onClick`-Handler. Beim Klick auf den Text passiert Folgendes:
1. `htmlFor` triggert die Checkbox nativ (toggle an)
2. `onClick` auf dem Label toggled den State nochmal zurück (toggle aus)

Ergebnis: Checkbox bleibt unverändert.

### Lösung
Den redundanten `onClick={() => setDatenschutz(!datenschutz)}` vom `<label>` entfernen. Das native `htmlFor="datenschutz"` reicht aus, um die Checkbox beim Klick auf den Text zu aktivieren.

| Datei | Änderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Zeile 807: `onClick` vom Label entfernen, `htmlFor` bleibt |

