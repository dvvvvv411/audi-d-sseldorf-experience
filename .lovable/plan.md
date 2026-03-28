

## Sheet durch Popover ersetzen (Mobile)

### Aenderungen in `src/pages/Gebrauchtwagen.tsx`

**1. Imports anpassen**
- `Sheet, SheetContent, SheetHeader, SheetTitle` entfernen
- `Popover, PopoverTrigger, PopoverContent` aus `@/components/ui/popover` importieren
- `BadgeEuro` aus lucide-react Import entfernen (nicht mehr gebraucht)

**2. Hamburger-Button + Sidebar ersetzen (Zeilen 250-345)**
- Den `sidebarOpen` State und den separaten `<Sheet>` Block entfernen
- Den Hamburger-Button in einen `PopoverTrigger` wrappen
- `PopoverContent`: heller Hintergrund (`bg-white`), abgerundete Ecken, Schatten, Breite ~`w-72`
- Inhalt: nur Ansprechpartner (Avatar, Name, Telefon, Mail, Anrufen-Button) — keine Fahrzeug-Zusammenfassung, kein Anfrage-Button

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Sheet durch Popover ersetzen, Inhalt auf Ansprechpartner reduzieren |

