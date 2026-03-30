

## Bildschutz für Ansprechpartner-Avatare

Gleiche Technik wie bei Fahrzeugbildern: transparentes Overlay-Div (`absolute inset-0 z-10`) über die Avatar-Bilder legen. Dafür muss der Container `relative` sein.

### Betroffene Stellen

**`src/pages/Gebrauchtwagen.tsx`** (3 Stellen):
1. **Header-Avatar** (Zeile ~369): kleines `w-8 h-8` Bild — Container `relative` + Overlay
2. **Popover-Avatar** (Zeile ~393): `w-14 h-14` Bild — Container `relative` + Overlay
3. **Ansprechpartner-Card** (Zeile ~570): `w-14 h-14` Bild — Container `relative` + Overlay

**`src/pages/Fahrzeugbestand.tsx`** (2 Stellen):
1. **Header-Avatar** (Zeile ~234): `w-8 h-8` — Container `relative` + Overlay
2. **Popover-Avatar** (Zeile ~257): `w-14 h-14` — Container `relative` + Overlay

### Muster pro Stelle

```tsx
// Vorher:
<img src={v.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />

// Nachher:
<div className="relative w-8 h-8">
  <img src={v.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
  <div className="absolute inset-0 z-10 rounded-full" />
</div>
```

| Datei | Änderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | 3 Avatar-Bilder mit Overlay schützen |
| `src/pages/Fahrzeugbestand.tsx` | 2 Avatar-Bilder mit Overlay schützen |

