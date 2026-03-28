

## Gebrauchtwagen: Thumbnails direkt unter Vorschaubild + Scrollbar integriert

### Aktuelles Problem
- Thumbnails haben Abstand zum Vorschaubild (`pb-6` auf Hero, `px-4 pb-8` auf Gallery)
- Progress-Bar ist eine separate Sektion unter den Thumbnails
- Auf Mobile: Info-Box (3x3 Grid) kommt VOR den Thumbnails (weil flex-col die Info-Box direkt nach dem Bild rendert)

### Aenderungen in `src/pages/Gebrauchtwagen.tsx`

**1. Mobile Layout-Reihenfolge**
- Hero-Section aufteilen: Hauptbild und Thumbnails kommen zusammen, Info-Box danach
- Auf Mobile (`flex-col`): Bild → Thumbnails → Info-Box
- Auf Desktop (`lg:flex-row`): Bild+Thumbnails links (60%), Info-Box rechts (40%)
- Thumbnails werden Teil der linken Spalte, direkt unter dem Hauptbild ohne Abstand

**2. Kein Abstand zwischen Bild und Thumbnails**
- `pb-6` vom Hero-Container entfernen
- Gallery-Container: `px-4 pb-8` → kein padding-top, kein gap
- Thumbnails direkt am unteren Rand des Hauptbildes

**3. Progress-Bar in die Thumbnails integrieren**
- Progress-Bar (`mt-3`) → `mt-0`, absolute positioniert am unteren Rand der Thumbnail-Reihe (quasi ueberlappend)
- Container der Thumbnails bekommt `relative`, Progress-Bar wird `absolute bottom-0`

**4. Mobile Thumbnails kleiner**
- Thumbnail-Groesse: `h-16 w-28 md:h-28 md:w-48` damit auf Mobile 5,5 Bilder sichtbar bleiben

### Struktur (neu)

```text
Desktop:
+--[Hauptbild]------------------+--[Info-Box 40%]--+
|                                |  3x3 Grid        |
+--[Thumbnails, kein Abstand]---+  Preis, CTA      |
|  [====progress====]           |                   |
+-------------------------------+-------------------+

Mobile:
+--[Hauptbild]------------------+
+--[Thumbnails, kein Abstand]---+
|  [====progress====]           |
+-------------------------------+
+--[Info-Box, full width]-------+
```

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Layout-Restructuring: Thumbnails in linke Spalte verschieben, Abstaende entfernen, Progress-Bar overlay, responsive Thumbnail-Groessen |

