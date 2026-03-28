

## Thumbnails unter die Hero-Sektion verschieben (Desktop)

### Problem
Aktuell sind die Thumbnails innerhalb der linken 60%-Spalte der Hero-Sektion (innerhalb des `flex-row` mit `rounded-lg overflow-hidden`). Auf Desktop sollen sie aber UNTER der gesamten 60/40-Sektion stehen — ohne Abstand.

### Loesung

Die Thumbnails aus der linken Spalte herausnehmen und als eigene Zeile direkt unter den `flex-row`-Container setzen. Kein Abstand (`gap-0`, kein margin/padding dazwischen).

```text
Desktop:
+--[Hauptbild 60%]--------------+--[Info-Box 40%]--+
|                                |  3x3 Grid        |
|                                |  Preis, CTA      |
+-------------------------------+-------------------+
+--[Thumbnails, volle Breite, kein Abstand]---------+
|  [====progress====]                               |
+---------------------------------------------------+

Mobile (bleibt gleich):
+--[Hauptbild]------------------+
+--[Thumbnails, kein Abstand]---+
+--[Info-Box, full width]-------+
```

### Aenderung in `src/pages/Gebrauchtwagen.tsx`

1. Thumbnails aus `<div className="lg:w-[60%]">` entfernen
2. Thumbnails direkt nach dem `flex-row`-Container platzieren, innerhalb desselben aeusseren Wrapper (`pb-8` div), sodass kein Abstand entsteht
3. Auf Mobile bleiben sie per `order` oder einfacher Struktur zwischen Bild und Info-Box — dafuer auf Mobile die Thumbnails weiterhin in der linken Spalte belassen via `lg:hidden`, und eine zweite Instanz `hidden lg:block` unter der Sektion zeigen. Oder besser: eine einzige Instanz die auf Mobile (`flex-col`) zwischen Bild und Info kommt und auf Desktop unter dem gesamten Block.

Einfachste Loesung: Thumbnails bleiben im linken Container (damit Mobile-Reihenfolge stimmt), aber auf Desktop werden sie per `lg:absolute` oder besser: die gesamte Struktur wird leicht angepasst — Thumbnails kommen nach dem `flex-row` div, und auf Mobile wird die Info-Box per `order-last` nach unten geschoben.

**Konkreter Ansatz:**
- Thumbnails AUS der linken Spalte nehmen
- Thumbnails NACH dem `flex flex-col lg:flex-row` Container platzieren (kein gap/margin)
- Info-Box bekommt `order-last lg:order-none` damit sie auf Mobile nach den Thumbnails kommt
- Auf Mobile: Bild → Thumbnails → Info-Box (via order)
- Auf Desktop: [Bild|Info-Box] → Thumbnails darunter

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Thumbnails nach dem flex-row Container verschieben, CSS order fuer Mobile-Reihenfolge |

