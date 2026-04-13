

## Sonderausstattungen formatiert darstellen

### Änderung in `src/pages/AdminAngebote.tsx`

Die Sonderausstattungen-Seite(n) werden so angepasst, dass Zeilen die als Überschriften/Kategorien erkennbar sind (z.B. komplett in Großbuchstaben, oder Zeilen die mit einem Doppelpunkt enden, oder Zeilen ohne führendes Sonderzeichen) **bold** gerendert werden, während die einzelnen Ausstattungsmerkmale darunter normal formatiert jeweils in einer eigenen Zeile stehen.

### Logik zur Erkennung von Titeln

Eine Heuristik prüft jede Zeile:
- Zeile ist komplett in Großbuchstaben → Titel (bold, etwas größere Schrift, Abstand davor)
- Oder Zeile endet mit `:` → Titel
- Alles andere → normaler Eintrag mit leichtem Einzug oder Aufzählungszeichen

### Umsetzung

In der Schleife `for (const line of equipmentLines)` (Zeilen 345-351):
- Vor einem Titel zusätzlichen Abstand einfügen (`y += 3`)
- Titel in `helvetica bold`, Größe 9
- Normale Zeilen in `helvetica normal`, Größe 8
- Jede Zeile bleibt auf einer eigenen Zeile (ist bereits so)

### Datei

| Datei | Änderung |
|---|---|
| `src/pages/AdminAngebote.tsx` | Titel-Erkennung und bold-Formatierung in der Ausstattungs-Schleife |

