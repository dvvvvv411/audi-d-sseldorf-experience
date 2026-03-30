

## Dropdowns im Admin-Bereich: Helles Theme statt Dunkles

### Problem

Die Select-Dropdowns (und ggf. andere portaled Popover-Elemente) verwenden Radix `Portal`, das Inhalte direkt in `document.body` rendert — **außerhalb** des `admin-theme`-Wrappers. Dadurch greifen die dunklen `:root`-CSS-Variablen (schwarzer Hintergrund, weißer Text) statt der hellen Admin-Theme-Variablen.

### Lösung

Die `admin-theme`-Klasse auf `document.body` setzen, wenn der Admin-Bereich aktiv ist. Dann erben auch Portal-Inhalte die hellen Variablen.

### Änderungen

**`src/pages/AdminLayout.tsx`**: `useEffect` hinzufügen, der beim Mounten `admin-theme` auf `document.body` (oder `document.documentElement`) setzt und beim Unmounten wieder entfernt.

```tsx
useEffect(() => {
  document.documentElement.classList.add('admin-theme');
  return () => document.documentElement.classList.remove('admin-theme');
}, []);
```

Das löst das Problem für alle Portal-basierten Komponenten (Select, DropdownMenu, Popover, Dialog) auf einen Schlag.

| Datei | Änderung |
|---|---|
| `src/pages/AdminLayout.tsx` | `useEffect` zum Setzen/Entfernen von `admin-theme` auf `document.documentElement` |

