

## Kundenname bei "Notiz hinzugefügt" im Aktivitätsprotokoll

Aktuell wird bei `notiz_hinzugefuegt` nur der Notiztext als `details` gespeichert. Der Kundenname fehlt.

### Änderung in `src/pages/AdminAnfragen.tsx`

In der `addNotiz`-Funktion (ca. Zeile 158-170): Den `details`-String ändern von nur `neueNotiz.trim()` zu `{Vorname} {Nachname}: {Notiztext}`, sodass der Kundenname vorangestellt wird.

Konkret: Die Anfrage über `selectedAnfrageId` aus dem `anfragen`-Array suchen und den Namen extrahieren.

```
// Vorher:
details: neueNotiz.trim()

// Nachher:
details: `${anfrage.vorname} ${anfrage.nachname}: ${neueNotiz.trim()}`
```

Gleiches Format wie bei `status_geaendert`, wo bereits der Name enthalten ist.

| Datei | Änderung |
|---|---|
| `src/pages/AdminAnfragen.tsx` | `addNotiz`: Kundenname vor Notiztext in details setzen |

