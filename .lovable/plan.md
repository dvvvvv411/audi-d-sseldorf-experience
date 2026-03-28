

## Hamburger-Menue mit Fullscreen-Sidebar (Mobile)

### Aenderung in `src/pages/Gebrauchtwagen.tsx`

**Header (Zeile 213-247):**
- Rechts im Header ein Hamburger-Icon (`Menu` aus lucide-react) hinzufuegen, nur sichtbar auf Mobile (`lg:hidden`)
- State `sidebarOpen` verwalten

**Fullscreen Sidebar:**
- Sheet-Komponente (`@/components/ui/sheet`) mit `side="right"` und voller Hoehe
- Inhalt: exakt die gleichen Infos wie die Ansprechpartner-Card (Avatar, Name, Telefon, Mail, Anrufen-Button)
- Plus die "Unsere Leistungen" und "Ihre Vorteile" Sektionen
- Schliesst sich bei Klick auf X oder Overlay

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | `Menu`-Icon importieren, `sidebarOpen` State, Sheet-Komponente im Header mit Ansprechpartner-Infos |

