

## Toast-Notification hell machen

### Problem
Die Toast-Notification nutzt `bg-background text-foreground`, was im dunklen Theme schwarz ergibt.

### Aenderung in `src/components/ui/toast.tsx`

**Zeile 30 — default variant:**
- `"border bg-background text-foreground"` ersetzen durch `"border border-gray-200 bg-white text-gray-900"`

### Datei

| Datei | Aenderung |
|---|---|
| `src/components/ui/toast.tsx` | Default-Variant auf helle Farben umstellen |

