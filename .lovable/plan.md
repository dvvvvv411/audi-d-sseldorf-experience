

## Bilder vor "Bild speichern" / "Bildersuche" schützen — ohne Rechtsklick zu blockieren

### Konzept
Statt `onContextMenu` zu blockieren, wird ein transparentes Overlay-`div` über jedes Bild gelegt. Der Rechtsklick funktioniert normal, aber er trifft das Overlay (nicht das `<img>`), sodass der Browser keine Bild-Optionen wie "Bild speichern unter" oder "Mit Google nach Bild suchen" anzeigt.

### Änderungen

**`src/pages/Fahrzeugbestand.tsx` (Zeile 47-53):**
- `onContextMenu` vom `<img>` entfernen
- Transparentes `<div className="absolute inset-0 z-10" />` über das Bild legen (innerhalb des `relative` Containers)

**`src/pages/Gebrauchtwagen.tsx`:**
- Gleiches Prinzip bei allen Fahrzeugbildern (Hauptbild + Thumbnails)
- `onContextMenu` entfernen, stattdessen transparentes Overlay-Div

```text
Vorher:                          Nachher:
<img onContextMenu=prevent />    <div class="relative">
                                   <img ... />
                                   <div class="absolute inset-0 z-10" />
                                 </div>
```

| Datei | Änderung |
|---|---|
| `src/pages/Fahrzeugbestand.tsx` | onContextMenu entfernen, transparentes Overlay über Bilder |
| `src/pages/Gebrauchtwagen.tsx` | onContextMenu entfernen, transparentes Overlay über Bilder |

