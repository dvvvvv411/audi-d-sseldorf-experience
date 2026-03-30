

## Sidebar fixed machen (kein Scrollen nötig)

### Problem
Auf Desktop wird die Sidebar durch `lg:static` aus dem `fixed`-Modus geholt — dadurch scrollt sie mit dem Inhalt mit und kann bei langen Seiten aus dem Sichtfeld verschwinden.

### Lösung

**`src/pages/AdminLayout.tsx`**:

1. **Sidebar** (Zeile 98): `lg:static` entfernen, stattdessen `lg:translate-x-0` beibehalten. Die Sidebar bleibt `fixed inset-y-0 left-0` auf allen Breakpoints → immer sichtbar, kein Scrollen.

2. **Main-Container** (Zeile 157): `lg:ml-64` hinzufügen, damit der Inhalt nicht hinter der Sidebar verschwindet (da sie jetzt immer `fixed` ist).

| Zeile | Vorher | Nachher |
|---|---|---|
| 98 | `fixed ... lg:translate-x-0 lg:static lg:z-auto` | `fixed ... lg:translate-x-0` (kein `lg:static`, kein `lg:z-auto`) |
| 157 | `flex-1 flex flex-col min-w-0` | `flex-1 flex flex-col min-w-0 lg:ml-64` |

