

## Fahrzeugbestand Cards aufwerten

### Änderungen in `src/pages/Fahrzeugbestand.tsx`

**1. Beschreibung entfernen** (Zeilen 62-64)
- Die `beschreibung`-Zeile unter dem Titel wird komplett entfernt.

**2. Specs-Grid umgestalten — wie bei /gebrauchtwagen**
- Statt 2-Spalten-Liste mit kleinen Icons → **3x2 Grid** mit zentrierten Zellen auf dunklem Hintergrund (`bg-[#3c3c3c]`, Border `border-[#3a3a3a]`), genau wie die Info-Box auf der Detailseite.
- Jede Zelle: Icon oben (größer, `size={24}`), Label unten zentriert.
- Das Specs-Grid bekommt einen dunklen Container (`bg-[#323232]`).

**3. Preis-Footer redesign**
- Hintergrundfarbe: `bg-[#323232]` statt `bg-gray-800`
- Hover-Effekt: `hover:bg-[#00527a]` (das Petrolblau von /gebrauchtwagen)
- "Preis" in Weiß (`text-white`), normal geschrieben (kein uppercase)
- "inkl. MwSt." etwas größer (`text-xs` statt `text-[10px]`)
- Preiszahl größer (`text-xl` statt `text-lg`)
- Transition für smooth hover: `transition-colors`

### Vorher → Nachher Preisbereich

```text
Vorher:                          Nachher:
bg-gray-800                      bg-[#323232] hover:bg-[#00527a]
"PREIS" (10px, gray, caps)       "Preis" (xs, white, normal)
"inkl. MwSt." (10px, gray)       "inkl. MwSt." (xs, white/70)
Preis text-lg                    Preis text-xl font-bold
```

| Datei | Änderung |
|---|---|
| `src/pages/Fahrzeugbestand.tsx` | Beschreibung entfernen, Specs-Grid im Gebrauchtwagen-Stil, Preis-Footer mit #323232 + Hover-Blau |

