

## Alle Popups/Dialoge auf weisses, modernes Design umstellen

### Problem
Die CSS-Variablen definieren ein globales dunkles Theme (`--background: 0 0% 5%`, `--popover: 0 0% 8%`). Dadurch sind alle Dialoge schwarz — das sieht auf den Admin-Seiten unpassend aus.

### Loesung
Die Dialog-Komponente (`dialog.tsx`) und Alert-Dialog-Komponente (`alert-dialog.tsx`) erhalten explizit weisse Hintergruende mit dunklem Text, unabhaengig vom globalen Theme. So bleiben die Popups universell hell und modern.

### Aenderungen

**1. `src/components/ui/dialog.tsx`**
- `DialogOverlay`: Overlay leicht abdunkeln (`bg-black/50` statt `bg-black/80`) fuer moderneren Look
- `DialogContent`: Explizit `bg-white text-gray-900 border-gray-200 rounded-xl shadow-2xl` setzen
- Close-Button: Dunkle Farbe (`text-gray-400 hover:text-gray-900`)

**2. `src/components/ui/alert-dialog.tsx`**
- Gleiche Anpassungen: `AlertDialogOverlay` auf `bg-black/50`, `AlertDialogContent` auf `bg-white text-gray-900 rounded-xl`

**3. Input-Felder in Dialogen**
- Die Seiten `AdminBrandings.tsx` und `AdminVerkaeufer.tsx` verwenden bereits `bg-gray-50 border-gray-200` auf den Inputs — das passt zum weissen Dialog und bleibt unveraendert.

### Ergebnis
Alle Dialoge im gesamten Projekt erscheinen weiss mit sauberer Typografie, abgerundeten Ecken und einem dezenten Schatten — modern und konsistent.

