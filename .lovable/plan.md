

## Klickbare Zellen + Zeilen-Navigation in Anfragen-Tabelle

### Änderung in `src/pages/AdminAnfragen.tsx`

**1. Kopier-Hilfsfunktion** hinzufügen:
```tsx
const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast({ title: "Kopiert", description: `${label} wurde kopiert.` });
};
```

**2. Name/Email/Telefon-Zellen** (Zeilen 305-307): Inhalt in klickbare `<span>` mit `cursor-pointer hover:underline` wrappen, `onClick` mit `e.stopPropagation()` + `copyToClipboard`.

**3. Zeilen-Klick**: Auf `<TableRow>` (Zeile 303) ein `onClick={() => navigate(/admin/anfragen/${a.id})}` und `className="cursor-pointer"` setzen. Die `stopPropagation()` in den kopierbaren Zellen und den Aktions-Buttons verhindert, dass der Zeilen-Klick ausgelöst wird.

**4. Status-Select und Aktions-Buttons**: Bereits eigenständige Klick-Handler — `stopPropagation` im Select-Trigger und den Button-Containern ergänzen.

| Datei | Änderung |
|---|---|
| `src/pages/AdminAnfragen.tsx` | `copyToClipboard`-Funktion, klickbare Name/Email/Telefon-Spans, `onClick` auf TableRow, `stopPropagation` auf Status + Aktionen |

