

## Fade-In Animationen + Preis-Element vergrößern

### 1. Fade-In Animationen

**`src/pages/Fahrzeugbestand.tsx`:**
- Titel `<h1>` bekommt `animate-fade-in`
- Jede `FahrzeugCard` bekommt `animate-fade-in` mit gestaffeltem `style={{ animationDelay: index * 80ms }}`
- `opacity-0 animate-fade-in` + `animation-fill-mode: forwards` damit Cards erst bei Animation sichtbar werden

**`src/pages/Gebrauchtwagen.tsx`:**
- Hauptcontainer/Sektionen (Bildergalerie, Info-Box, Preis-Banner, Berater-Spalte) bekommen `animate-fade-in`

### 2. Preis-Element vergrößern (Fahrzeugbestand)

- Padding: `py-3` → `py-4` (etwas mehr vertikaler Abstand)
- Texte bleiben gleich — nur der Abstand wird erhöht

### Dateien

| Datei | Änderung |
|---|---|
| `src/pages/Fahrzeugbestand.tsx` | Fade-In auf Cards (gestaffelt) + Titel, Preis-Element py-3 → py-4 |
| `src/pages/Gebrauchtwagen.tsx` | Fade-In auf Hauptsektionen |

