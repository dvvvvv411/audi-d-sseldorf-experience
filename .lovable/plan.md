

## Angebote: Sonderausstattungen-Text mit Zeilenumbruch

### Problem
Im Sonderausstattungen-Block (Seite 3+) wird jede Zeile mit `doc.text()` ohne Breitenbegrenzung gerendert. Lange Zeilen laufen über den rechten Seitenrand hinaus und Text geht verloren.

### Lösung
`doc.splitTextToSize(line, contentW)` verwenden, um jede Zeile automatisch umzubrechen. Danach die Höhe aller Teilzeilen berechnen, bevor sie gedruckt werden — falls sie nicht mehr auf die Seite passen, vorher Seitenumbruch.

### Änderungen in `src/pages/AdminAngebote.tsx`

**Zeilen 352-358** ersetzen:

```typescript
for (const line of equipmentLines) {
  const wrappedLines = doc.splitTextToSize(line.trim(), contentW);
  const blockH = wrappedLines.length * lineH;
  if (y + blockH > maxY) {
    y = startEquipmentPage();
  }
  for (const wl of wrappedLines) {
    doc.text(wl, marginL, y);
    y += lineH;
  }
}
```

### Dateien

| Datei | Änderung |
|---|---|
| `src/pages/AdminAngebote.tsx` | Zeilen 352-358: `splitTextToSize` für Textumbruch innerhalb `contentW` |

