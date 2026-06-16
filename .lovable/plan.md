## Problem

In `src/pages/Fahrzeugbestand.tsx` zeigt der Loading-Screen (Zeilen 266–275) die `BrandLogo`-Komponente. Solange `branding` noch `null` ist, fällt `BrandLogo` automatisch auf das hartcodierte `AudiLogo` zurück (Zeile 60). Sobald das Branding geladen ist, wechselt es zum VW-Logo → sichtbares Flackern.

## Lösung

Den Loading-Zustand auf einen neutralen Spinner umstellen, der kein Marken-Logo enthält. Erst wenn `loading === false` ist (und damit auch das Branding bekannt), wird die echte Seite mit dem korrekten Logo gerendert. Kein Logo-Wechsel mehr während des Ladens.

## Änderungen

**`src/pages/Fahrzeugbestand.tsx`** (Zeilen 266–275):

- Den `BrandLogo`-Block im Loading-Screen entfernen.
- Stattdessen einen neutralen, markenlosen Spinner anzeigen (z. B. `Loader2` aus `lucide-react` mit `animate-spin`, in dezentem Grau).
- Untertitel „Wird geladen..." beibehalten oder leicht angepasst.

Beispielstruktur:

```text
<div min-h-screen bg-white center>
  <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
  <p className="text-xs text-gray-400">Wird geladen...</p>
</div>
```

Der separate `loadBranding`-Effect (Zeilen 150–177), der nur dazu diente, das Logo früh in den Spinner zu bekommen, kann bleiben (schadet nicht) oder optional entfernt werden, da das Logo im Spinner nicht mehr gebraucht wird. Empfehlung: entfernen, um Doppel-Fetch zu vermeiden — Branding wird sowieso im Haupt-`load`-Effect gesetzt.

## Out of scope

- Keine Änderungen an Logo, Branding-Daten, Routing oder anderen Seiten.
- Loading-States in `Gebrauchtwagen.tsx` o. ä. bleiben unangetastet, sofern nicht ausdrücklich gewünscht.
