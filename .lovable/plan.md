

## Abbrechen-Button in Popups fixen

### Problem
Der `outline`-Button-Variant nutzt CSS-Variablen (`bg-background`, `border-input`), die im dunklen globalen Theme auf Schwarz stehen. Im weissen Dialog ist der Button dadurch schwarz mit schwarzem Text — unlesbar.

### Loesung
In `src/components/ui/button.tsx` die `outline`-Variante auf explizite helle Farben setzen:

```
outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
```

Das macht den Abbrechen-Button in allen Dialogen sofort hell und lesbar, konsistent mit dem weissen Popup-Design.

### Datei
- `src/components/ui/button.tsx` — Zeile 14, outline-Variant anpassen

