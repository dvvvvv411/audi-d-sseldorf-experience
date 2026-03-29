

## Fahrzeugbestand-Titel ändern + Fahrzeuganzahl anzeigen

### Änderungen in `src/pages/Fahrzeugbestand.tsx`

**Zeile 289:** Titel und Anzahl-Anzeige aktualisieren:
- `<h1>Fahrzeugbestand</h1>` → `<h1>Alle Fahrzeuge</h1>`
- Darüber eine dezente Zeile mit der Fahrzeuganzahl einfügen: `<p className="text-sm text-gray-400 mb-1">{fahrzeuge.length} Fahrzeuge</p>`

```text
Vorher:                          Nachher:
                                 <p class="text-sm text-gray-400 mb-1">12 Fahrzeuge</p>
<h1>Fahrzeugbestand</h1>        <h1>Alle Fahrzeuge</h1>
```

| Datei | Änderung |
|---|---|
| `src/pages/Fahrzeugbestand.tsx` | Titel → "Alle Fahrzeuge", Fahrzeuganzahl darüber |

