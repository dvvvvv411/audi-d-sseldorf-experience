

## CO₂-Balken korrigieren + Sektion dezenter gestalten

### Problem
1. Balken sind viel zu breit — im Screenshot nehmen sie nur ca. 120px Gesamtbreite ein, unsere spannen sich ueber die ganze Spalte
2. Es fehlt der Pfeil-Effekt (rechte Seite jedes Balkens hat eine Pfeilspitze)
3. Die Sektion soll visuell zurueckgenommener sein als der Rest

### Loesung

**1. Balken kuerzer machen**
- Maximale Breite des Balken-Containers auf `max-w-[140px]` begrenzen
- Breiten anpassen: A ~55%, B ~65%, C ~72%, D ~78%, E ~85%, F ~92%, G ~100%

**2. Pfeil-Form hinzufuegen**
Jeder Balken bekommt rechts eine Pfeilspitze via CSS `clip-path`:
```css
clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%);
```
Das erzeugt die typische Energielabel-Pfeilform.

**3. Sektion dezenter/unauffaelliger gestalten**
- Hintergrund auf `bg-gray-50` setzen (leicht grau, hebt sich dezent ab)
- Text etwas kleiner/heller
- Die darueberliegenden Sektionen bleiben weiss und wirken dadurch prominenter

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Balken-Container `max-w-[140px]`, `clip-path` Pfeil auf jeden Balken, Sektion `bg-gray-50` mit voller Breite |

