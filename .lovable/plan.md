

## Avatar im Header neben "Ihr Berater" hinzufügen

### Änderung in `src/pages/Gebrauchtwagen.tsx`

**Zeilen 341-348 — Desktop-Berater-Bereich:**

Vor dem Text-Block ein Avatar-Bild (oder Initialen-Fallback) einfügen. Der `verkaeufer[0]` hat bereits `avatar_url` (wird im Mobile-Popover genutzt).

Neues Layout: `flex items-center gap-2.5` mit einem kleinen runden Avatar (32x32px) links vom Text.

```tsx
<div className="hidden md:flex items-center gap-2.5">
  {verkaeufer[0].avatar_url ? (
    <img src={verkaeufer[0].avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold">
      {verkaeufer[0].vorname[0]}{verkaeufer[0].nachname[0]}
    </div>
  )}
  <div className="flex flex-col items-end text-right">
    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Ihr Berater</span>
    <span className="text-sm font-medium text-gray-900">{verkaeufer[0].vorname} {verkaeufer[0].nachname}</span>
  </div>
</div>
```

| Datei | Änderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Avatar-Bild/Fallback neben Berater-Name im Header |

