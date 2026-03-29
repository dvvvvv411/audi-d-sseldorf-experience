

## Fahrzeugbestand Header + Specs-Grid anpassen

### 1. Header erweitern — Berater + Mobile-Popover wie bei /gebrauchtwagen

Die Seite muss auch Verkaeufer laden. Dazu:
- Zusaetzlicher Fetch: `verkaeufer`-Tabelle (erster Eintrag als Fallback, da kein spezifischer Seller-Kontext)
- Import von `Popover`, `PopoverTrigger`, `PopoverContent`, `Menu`, `Phone`, `Mail` Icons
- Rechte Header-Seite: "Ihr Berater" + Name + Avatar (Desktop), Hamburger-Popover (Mobile) — 1:1 aus Gebrauchtwagen uebernommen
- Header-Container bekommt `justify-between`

### 2. Specs-Grid Hintergrund aendern

- Zeile 65: `bg-[#323232]` aendern zu `bg-[#fbfbfb]`
- Zeile 68: Border und Icon/Text-Farben anpassen fuer hellen Hintergrund: `border-gray-200`, Icons und Text in `text-gray-600`

### Aenderungen

| Datei | Aenderung |
|---|---|
| `src/pages/Fahrzeugbestand.tsx` | Verkaeufer laden, Header mit Berater-Bereich + Popover erweitern, Specs-Grid bg auf #fbfbfb mit dunkler Schrift |

