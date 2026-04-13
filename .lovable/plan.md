

## Fix: Disclaimer-Text im Footer nutzt volle Breite

### Problem
Der Disclaimer-Text ist manuell in kurze Zeilen aufgeteilt (hardcoded Array mit 5 Zeilen), statt die verfügbare 60%-Breite zu nutzen. Dadurch bricht der Text viel zu früh um.

### Lösung in `src/pages/AdminExposes.tsx`

Die hardcodierten `disclaimerLines` (Zeilen 329-335) durch `doc.splitTextToSize()` ersetzen, das den gesamten Disclaimer-Text automatisch auf die volle `leftW` (60% = ~108mm) umbricht:

```typescript
// Statt hardcodierter Zeilen:
const disclaimerText = "Da wir uns Zwischenverkauf vorbehalten müssen, empfehlen wir Ihnen, vor einer Besichtigung beim genannten Ansprechpartner telefonisch rückzufragen, ob das Fahrzeug noch unverkauft ist.";
const disclaimerLines = doc.splitTextToSize(disclaimerText, leftW);
```

Der Rest bleibt gleich — die Zeilen werden weiterhin mit 3.5mm Zeilenabstand gerendert, gefolgt von "Erstellt am:" und "Zwischenverkauf und Irrtum vorbehalten!".

### Dateien

| Datei | Änderung |
|---|---|
| `src/pages/AdminExposes.tsx` | Zeilen 329-335: Hardcoded Array → `splitTextToSize(disclaimerText, leftW)` |

