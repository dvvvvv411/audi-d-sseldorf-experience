

## Dropdown Hover-States sichtbar machen

### Problem
`--accent` ist `0 0% 96%` (fast weiß) und `--popover` ist `0 0% 100%` (weiß) — der Kontrast beim Hover ist praktisch unsichtbar.

### Lösung

In `src/index.css` die `admin-theme` Variablen anpassen:
- `--accent: 0 0% 96%` → `--accent: 214 95% 93%` (helles Blau, passend zum blauen Active-State der Sidebar)
- `--accent-foreground: 0 0% 9%` bleibt

Das gibt allen Dropdown-Items, Select-Items und Menü-Einträgen einen sichtbaren blauen Hover-Hintergrund.

| Datei | Änderung |
|---|---|
| `src/index.css` | `--accent` in `.admin-theme` auf helles Blau ändern |

