

## PDF-Dateiname um Interessenten-Name erweitern

Kleine Änderung in `src/pages/AdminAngebote.tsx` in der `handleDownload`-Funktion:

Der Dateiname wird aktuell so generiert:
```
{Fahrzeugname}_Angebot.pdf
```

Neues Format:
```
{Fahrzeugname}_Angebot_{InteressentName}.pdf
```

### Umsetzung

Zeile 453-454: Den `interessentName` ebenfalls bereinigen und an den Dateinamen anhängen:

```ts
const safeName = selectedFahrzeug.fahrzeugname.replace(/[^a-zA-Z0-9äöüÄÖÜß\-_ ]/g, "").replace(/\s+/g, "_");
const safePerson = interessentName.replace(/[^a-zA-Z0-9äöüÄÖÜß\-_ ]/g, "").replace(/\s+/g, "_");
a.download = `${safeName}_Angebot_${safePerson}.pdf`;
```

### Datei

| Datei | Änderung |
|---|---|
| `src/pages/AdminAngebote.tsx` | Dateiname um Interessenten-Name ergänzen |

