

## Cards full-width + Sidebar Redesign

### 1. Cards full-width (1 pro Zeile)

**`src/pages/AdminVerkaeufer.tsx`** (Zeile 226):
- `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4` -> `grid grid-cols-1 gap-4`

**`src/pages/AdminBrandings.tsx`** (Zeile 146):
- `grid grid-cols-1 lg:grid-cols-2 gap-4` -> `grid grid-cols-1 gap-4`

### 2. Sidebar modernisieren (nach Screenshot-Vorbild)

Das Referenzbild zeigt eine dunkle Sidebar im Stil: dunkelblau/slate Hintergrund (nicht reines Schwarz), abgerundete Nav-Items, Gruppen mit Uppercase-Labels durch Trennlinien getrennt, aktives Item mit blauem/hellem Hintergrund (rounded), Badge-Counts als rote Kreise, und unten ein User-Bereich mit Avatar-Initialen + E-Mail + Abmelden-Button.

**`src/pages/AdminLayout.tsx`** Änderungen:
- Sidebar-Hintergrund: `bg-black` -> `bg-slate-900` (dunkelblau statt reines Schwarz)
- Nav-Items: `rounded-none` -> `rounded-lg`, aktives Item: `bg-blue-600 text-white` statt `bg-white text-black`
- Hover-Stil: `hover:bg-white/10 hover:text-white`
- Gruppen mit Trennlinien: Items in Sektionen aufteilen (z.B. "Dashboard" | Separator | "Verwaltung"-Gruppe)
- User-Bereich unten: Initialen-Avatar-Kreis + aktuelle User-Email anzeigen (aus `supabase.auth.getUser()`)
- Abmelden-Button: als outline/ghost Button mit voller Breite

| Datei | Änderung |
|---|---|
| `src/pages/AdminVerkaeufer.tsx` | Grid auf `grid-cols-1` setzen |
| `src/pages/AdminBrandings.tsx` | Grid auf `grid-cols-1` setzen |
| `src/pages/AdminLayout.tsx` | Sidebar: slate-900 Hintergrund, rounded-lg Items, blaues Active-Highlight, Gruppen-Trenner, User-Info unten |

