
## Fix-Plan: Lesbarkeit in `/admin/anfragen` + nachhaltiger Farb-Fix im Admin

### Ursache
Die App nutzt global ein dunkles Token-Theme (`--foreground` hell, `--background` dunkel).  
In Admin-Views liegen viele Flächen aber auf `bg-white`. Komponenten wie `TableHead`, `TableCell`, `Button ghost`, `Select` nutzen Tokens → dadurch entstehen „weiß auf weiß“-Effekte.

### Umsetzung

1. **Scoped Light-Theme nur für Admin einführen**
   - In `src/index.css` eine Klasse `.admin-theme` ergänzen, die die zentralen CSS-Variablen auf helle Werte setzt (`--background`, `--foreground`, `--muted`, `--accent`, `--border`, `--input`, `--popover`, `--card`, `--ring`, etc.).
   - Ziel: Alle Shadcn-Komponenten im Admin erben automatisch lesbare Farben.

2. **Admin-Bereich an das scoped Theme hängen**
   - In `src/pages/AdminLayout.tsx` auf den Root-Container die Klasse `admin-theme` setzen.
   - Ergebnis: Alle Unterseiten (`/admin/*`) sind konsistent hell, ohne die öffentliche (dunkle) Website zu beeinflussen.

3. **`/admin/anfragen` gezielt absichern (zusätzliche Klarheit)**
   - In `src/pages/AdminAnfragen.tsx` Tabellenkopf/-zeilen explizit mit hellen Klassen versehen:
     - Header: `bg-gray-50`, `text-gray-600`, `font-semibold`
     - Rows/Cells: `border-gray-100`, `text-gray-900/700/600` je nach Spalte
   - Action-Button (Auge) mit klaren Hover-Farben versehen (`hover:bg-gray-100`, `hover:text-gray-900`), damit kein Token-Missmatch mehr entsteht.

4. **Regression-Check auf anderen Admin-Seiten**
   - Visuell prüfen: `/admin`, `/admin/verkaeufer`, `/admin/brandings`, `/admin/fahrzeugbestand`, `/admin/anfragen/:id`
   - Fokus: Tabellen, Inputs, Textareas, Selects, Badges, Icon-Buttons, Dialoge.

### Technische Details
- Kein hartes Überschreiben aller Komponenten nötig; stattdessen **Theme-Scope via CSS-Variablen**.
- Dadurch bleibt die bestehende Struktur erhalten und zukünftige Admin-Seiten erben automatisch die korrekten Kontraste.
- Öffentliche Seiten behalten ihr dunkles Branding, da der Eingriff nur innerhalb von `.admin-theme` wirkt.

### Betroffene Dateien
- `src/index.css` (neue `.admin-theme` Token-Werte)
- `src/pages/AdminLayout.tsx` (Root-Klasse `admin-theme`)
- `src/pages/AdminAnfragen.tsx` (explizite Tabellen-/Button-Kontraste)
